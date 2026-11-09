# Dress the CC0 Quaternius base body and author a run cycle. Original clothing meshes.
import bpy
import bmesh
from mathutils import Vector, Euler
import os

SRC = "/tmp/qview/model/Superhero_Female_FullBody.gltf"
HAIR = "/tmp/qview/model/Hair_Buns.gltf"
OUT = "/agent/repos/eish-your-excellency/assets/lerato.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)

arm = next(o for o in bpy.data.objects if o.type == "ARMATURE")
body = next(o for o in bpy.data.objects if o.type == "MESH" and o.name.startswith("Superhero"))
print("BODY", body.name, "verts", len(body.data.vertices), "groups", [g.name for g in body.vertex_groups])
print("ARM", arm.name)

# Drop unused maps so the glb stays small. Keep base color.
for mat in bpy.data.materials:
    if not mat.use_nodes:
        continue
    nt = mat.node_tree
    for node in list(nt.nodes):
        if node.type == "NORMAL_MAP":
            nt.nodes.remove(node)
    bsdf = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf:
        for sock in ("Normal", "Roughness", "Metallic"):
            if sock in bsdf.inputs and bsdf.inputs[sock].is_linked:
                for link in list(bsdf.inputs[sock].links):
                    nt.links.remove(link)
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = 0.62

def solid_mat(name, color, rough=0.72):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = rough
    return m

def shell(groups, name, inflate, mat):
    obj = body.copy()
    obj.data = body.data.copy()
    obj.name = name
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bm = bmesh.from_edit_mesh(obj.data)
    layer = bm.verts.layers.deform.verify()
    idx = {g.name: g.index for g in obj.vertex_groups}
    keep = {idx[g] for g in groups if g in idx}
    doomed = []
    for v in bm.verts:
        best_i, best_w = None, 0.0
        for gi, w in v[layer].items():
            if w > best_w:
                best_i, best_w = gi, w
        if best_i not in keep:
            doomed.append(v)
    bmesh.ops.delete(bm, geom=doomed, context="VERTS")
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    for v in bm.verts:
        v.co += v.normal * inflate
    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")
    mod = obj.modifiers.new("shell", "SOLIDIFY")
    mod.thickness = 0.012
    mod.offset = 1.0
    bpy.ops.object.modifier_apply(modifier=mod.name)
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    print(name, "verts", len(obj.data.vertices))
    return obj

jacket_groups = [
    "spine_01", "spine_02", "spine_03",
    "clavicle_l", "clavicle_r",
    "upperarm_l", "upperarm_r",
    "lowerarm_l", "lowerarm_r",
]
pants_groups = ["pelvis", "thigh_l", "thigh_r", "calf_l", "calf_r"]
shoe_groups = ["foot_l", "foot_r", "ball_l", "ball_r", "ball_leaf_l", "ball_leaf_r"]

jacket = shell(jacket_groups, "Jacket", 0.018, solid_mat("jacket", (0.10, 0.55, 0.50), 0.78))
pants = shell(pants_groups, "Trousers", 0.016, solid_mat("trousers", (0.08, 0.14, 0.13), 0.8))
shoes = shell(shoe_groups, "Sneakers", 0.02, solid_mat("sneakers", (0.93, 0.91, 0.86), 0.45))
# dark sole: a second thinner shell slightly lower is overkill; tint the shoe and add a sole box per foot later

# Drop curves and any leftover import junk. Hair from the pack is authored at the
# origin, so a fresh cap is parented to the head bone instead.
for obj in list(bpy.data.objects):
    if obj.type not in {"MESH", "ARMATURE"}:
        bpy.data.objects.remove(obj, do_unlink=True)

# Scale from the body mesh only, before adding hair.
corners = [body.matrix_world @ Vector(c) for c in body.bound_box]
low = min(v.z for v in corners)
high = max(v.z for v in corners)
height = high - low
print("BODY HEIGHT", height)
if height > 2.2 or height < 1.4:
    arm.scale = (1.7 / height, 1.7 / height, 1.7 / height)
    bpy.context.view_layer.update()

hair_mat = solid_mat("hair", (0.07, 0.045, 0.035), 0.86)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.085, segments=20, ring_count=12)
cap = bpy.context.active_object
cap.name = "HairCap"
cap.data.materials.append(hair_mat)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, segments=16, ring_count=10)
bun = bpy.context.active_object
bun.name = "HairBun"
bun.data.materials.append(hair_mat)
for obj, local in ((cap, (0.0, 0.16, -0.02)), (bun, (0.02, 0.22, -0.04))):
    obj.parent = arm
    obj.parent_type = "BONE"
    obj.parent_bone = "Head"
    obj.location = local
    obj.rotation_euler = (0, 0, 0)
    obj.scale = (1, 1, 1)

def pose(name, angles):
    b = arm.pose.bones[name]
    b.rotation_mode = "XYZ"
    b.rotation_euler = Euler(angles, "XYZ")

def clear_pose():
    for b in arm.pose.bones:
        b.rotation_mode = "XYZ"
        b.rotation_euler = Euler((0, 0, 0), "XYZ")
        b.location = (0, 0, 0)

# Probe: drop the arms from the T-pose. glTF bones in Blender point along +Y.
# A negative X rotation on the upper arm folds it down toward the body for a Y-aligned bone
# that sticks out on X. We'll set a candidate and the caller can re-render.
def arms_down():
    pose("upperarm_l", (0.0, 0.0, -1.25))
    pose("upperarm_r", (0.0, 0.0, 1.25))
    pose("lowerarm_l", (0.0, 0.35, 0.0))
    pose("lowerarm_r", (0.0, -0.35, 0.0))

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 13
if arm.animation_data is None:
    arm.animation_data_create()
action = bpy.data.actions.new("run")
arm.animation_data.action = action

def key_all(frame):
    scene.frame_set(frame)
    for b in arm.pose.bones:
        b.keyframe_insert("rotation_euler", frame=frame)

# 8-beat run, arms opposite the legs. Angles are a first guess, corrected after a render.
beats = [1, 4, 7, 10, 13]
# thigh swing, knee bend, arm swing, elbow bend
cycles = [
    (0.7, 0.2, -0.8, 0.4),
    (-0.2, 1.3, 0.5, 1.1),
    (-0.7, 0.25, 0.8, 0.3),
    (0.2, 1.2, -0.5, 1.0),
    (0.7, 0.2, -0.8, 0.4),
]
for frame, (th, kn, ar, el) in zip(beats, cycles):
    clear_pose()
    arms_down()
    pose("thigh_l", (th, 0, 0))
    pose("thigh_r", (-th, 0, 0))
    pose("calf_l", (kn if th < 0.3 else 0.2, 0, 0))
    pose("calf_r", (kn if th > -0.3 else 0.2, 0, 0))
    # add swing on top of the lowered arms
    pose("upperarm_l", (ar, 0, -1.25))
    pose("upperarm_r", (-ar, 0, 1.25))
    pose("lowerarm_l", (0, 0.2 + el, 0))
    pose("lowerarm_r", (0, -0.2 - el, 0))
    pose("spine_02", (0.12, 0, 0))
    key_all(frame)

# idle action
idle = bpy.data.actions.new("idle")
arm.animation_data.action = idle
clear_pose()
arms_down()
pose("spine_02", (0.06, 0, 0))
key_all(1)
key_all(8)

# jump tuck
jump = bpy.data.actions.new("jump")
arm.animation_data.action = jump
clear_pose()
arms_down()
pose("thigh_l", (1.1, 0, 0))
pose("thigh_r", (1.15, 0, 0))
pose("calf_l", (1.4, 0, 0))
pose("calf_r", (1.4, 0, 0))
pose("upperarm_l", (-1.0, 0, -0.4))
pose("upperarm_r", (-0.9, 0, 0.4))
pose("spine_02", (-0.15, 0, 0))
key_all(1)
key_all(8)

# slide
slide = bpy.data.actions.new("slide")
arm.animation_data.action = slide
clear_pose()
arms_down()
pose("thigh_l", (1.2, 0, 0))
pose("calf_l", (0.4, 0, 0))
pose("thigh_r", (0.2, 0, 0))
pose("calf_r", (1.3, 0, 0))
pose("spine_01", (-0.8, 0, 0))
pose("spine_02", (-0.4, 0, 0))
pose("upperarm_l", (0.4, 0, -1.1))
pose("upperarm_r", (0.3, 0, 1.1))
key_all(1)
key_all(8)

# leave the run as the exported default by ensuring all actions exist on the armature
# glTF export includes all actions if use_nla or export all
arm.animation_data.action = action

os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    export_animations=True,
    export_skins=True,
    export_yup=True,
    export_apply=False,
    use_active_collection=False,
)
print("WROTE", OUT, os.path.getsize(OUT))
