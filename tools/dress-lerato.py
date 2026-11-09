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

def dominant(v, layer):
    best_i, best_w = None, 0.0
    for gi, w in v[layer].items():
        if w > best_w:
            best_i, best_w = gi, w
    return best_i

def shell(groups, name, inflate, mat, extra=None, reshape=None, hem=None):
    # Copy of the skinned body, so the armature modifier and weights stay valid.
    obj = body.copy()
    obj.data = body.data.copy()
    obj.name = name
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bm = bmesh.from_edit_mesh(obj.data)
    layer = bm.verts.layers.deform.verify()
    names = {g.index: g.name for g in obj.vertex_groups}
    idx = {g.name: g.index for g in obj.vertex_groups}
    keep = {idx[g] for g in groups if g in idx}
    mw = obj.matrix_world
    doomed = []
    for v in bm.verts:
        best_i = dominant(v, layer)
        name = names.get(best_i, "")
        world = mw @ v.co
        if best_i not in keep and not (extra and extra(name, world)):
            doomed.append(v)
    bmesh.ops.delete(bm, geom=doomed, context="VERTS")
    if reshape:
        reshape(bm, obj, layer, names)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    for _ in range(5):
        boundary = [v for v in bm.verts if any(e.is_boundary for e in v.link_edges)]
        for v in boundary:
            nbrs = [e.other_vert(v).co for e in v.link_edges if e.is_boundary]
            if nbrs:
                avg = sum(nbrs, Vector()) / len(nbrs)
                v.co = v.co.lerp(avg, 0.55)
        bmesh.ops.smooth_vert(bm, verts=list(bm.verts), factor=0.25, use_axis_x=True, use_axis_y=True, use_axis_z=True)
    if hem:
        for v in bm.verts:
            if any(e.is_boundary for e in v.link_edges) and hem(v.co):
                v.co.z -= 0.05
    for v in bm.verts:
        v.co += v.normal * inflate
    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")
    mod = obj.modifiers.new("shell", "SOLIDIFY")
    mod.thickness = 0.007
    mod.offset = 1.0
    bpy.ops.object.modifier_apply(modifier=mod.name)
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    zs = [(obj.matrix_world @ v.co).z for v in obj.data.vertices]
    print(name, "verts", len(obj.data.vertices), "z", round(min(zs), 3), round(max(zs), 3))
    return obj

def jacket_extra(name, co):
    # Collar takes the base of the neck. The hip overlap is the pelvis itself, not the thighs.
    if name == "neck_01" and co.z < 1.53:
        return True
    if name == "root" and co.z > 0.9:
        return True
    return False

def jacket_hem(co):
    return co.z < 1.02 and abs(co.x) < 0.25

def pants_extra(name, co):
    if name == "root" and co.z < 1.25:
        return True
    return False

def collapse_toes(bm, obj, layer, names):
    # Pull each foot into one toe box before the voxel fuse. Weights are rebuilt after the remesh.
    for sign in (1, -1):
        chosen = [v for v in bm.verts if v.co.x * sign > 0.02]
        if len(chosen) < 8:
            continue
        cx = sum(v.co.x for v in chosen) / len(chosen)
        cz = sum(v.co.z for v in chosen) / len(chosen)
        ys = [v.co.y for v in chosen]
        y0, y1 = min(ys), max(ys)
        span = max(1e-4, y1 - y0)
        for v in chosen:
            toe = (y1 - v.co.y) / span
            v.co.x = cx + (v.co.x - cx) * 0.4
            pinch = 0.45 if toe > 0.55 else 0.75
            v.co.z = cz + (v.co.z - cz) * pinch
        bmesh.ops.remove_doubles(bm, verts=chosen, dist=0.018)

jacket_groups = [
    "pelvis", "spine_01", "spine_02", "spine_03",
    "clavicle_l", "clavicle_r",
    "upperarm_l", "upperarm_r",
    "lowerarm_l", "lowerarm_r",
]
pants_groups = ["pelvis", "spine_01", "thigh_l", "thigh_r", "calf_l", "calf_r"]
shoe_groups = ["foot_l", "foot_r", "ball_l", "ball_r", "ball_leaf_l", "ball_leaf_r"]

jacket = shell(jacket_groups, "Jacket", 0.012, solid_mat("jacket", (0.12, 0.58, 0.54), 0.74), extra=jacket_extra)
pants = shell(pants_groups, "Trousers", 0.02, solid_mat("trousers", (0.1, 0.18, 0.16), 0.8), extra=pants_extra)
shoes = shell(shoe_groups, "Sneakers", 0.018, solid_mat("sneakers", (0.95, 0.94, 0.91), 0.4), reshape=collapse_toes)
# Fuse the toe grooves into one volume. This object already carries the body's armature modifier.
bpy.context.view_layer.objects.active = shoes
for m in shoes.modifiers:
    if m.type == "ARMATURE":
        m.show_viewport = False
fuse = shoes.modifiers.new("fuse", "REMESH")
fuse.mode = "VOXEL"
fuse.voxel_size = 0.016
fuse.use_smooth_shade = True
bpy.ops.object.modifier_apply(modifier="fuse")
for m in shoes.modifiers:
    if m.type == "ARMATURE":
        m.show_viewport = True
shoes.vertex_groups.clear()
left = shoes.vertex_groups.new(name="foot_l")
right = shoes.vertex_groups.new(name="foot_r")
lv, rv = [], []
for v in shoes.data.vertices:
    (lv if v.co.x >= 0 else rv).append(v.index)
left.add(lv, 1.0, "REPLACE")
right.add(rv, 1.0, "REPLACE")
# Scale each shoe up around its own center so the toe box meets the trouser cuff.
for indices in (lv, rv):
    if not indices:
        continue
    center = sum((shoes.data.vertices[i].co for i in indices), Vector()) / len(indices)
    zs = [shoes.data.vertices[i].co.z for i in indices]
    z0 = min(zs)
    for i in indices:
        v = shoes.data.vertices[i]
        v.co = center + (v.co - center) * 1.5
        if v.co.z < z0 + 0.015:
            v.co.z -= 0.01
print("SHOE fused", len(shoes.data.vertices))

# Hide the body under the clothes. Head, neck and hands stay.
KEEP = ("Head", "neck_", "hand_", "index_", "middle_", "ring_", "pinky_", "thumb_")
bpy.context.view_layer.objects.active = body
bpy.ops.object.mode_set(mode="EDIT")
bm = bmesh.from_edit_mesh(body.data)
layer = bm.verts.layers.deform.verify()
names = {g.index: g.name for g in body.vertex_groups}
doomed = []
for v in bm.verts:
    name = names.get(dominant(v, layer), "")
    if not any(name.startswith(p) for p in KEEP):
        doomed.append(v)
bmesh.ops.delete(bm, geom=doomed, context="VERTS")
bmesh.update_edit_mesh(body.data)
bpy.ops.object.mode_set(mode="OBJECT")
print("BODY LEFT", len(body.data.vertices))

# Drop curves and any leftover import junk. Hair from the pack is authored at the
# origin, so a fresh cap is parented to the head bone instead.
for obj in list(bpy.data.objects):
    if obj.type not in {"MESH", "ARMATURE"}:
        bpy.data.objects.remove(obj, do_unlink=True)

# Scale from the body mesh only, before adding hair.
# Height is measured on the full import, before the body under the clothes is removed.
# Scaling from the leftover head and hands made the rig about four times too tall.

hair_mat = solid_mat("hair", (0.09, 0.055, 0.04), 0.84)
head_h, head_t = (arm.matrix_world @ arm.data.bones["Head"].head_local, arm.matrix_world @ arm.data.bones["Head"].tail_local)
centroid = (head_h + head_t) * 0.5
neck_xy = Vector((head_h.x, head_h.y, 0))
head_idx = body.vertex_groups["Head"].index
coords = []
for v in body.data.vertices:
    for g in v.groups:
        if g.group == head_idx and g.weight > 0.45:
            coords.append(body.matrix_world @ v.co)
            break
nose = max(coords, key=lambda p: (Vector((p.x, p.y, 0)) - neck_xy).length)
forward = (Vector((nose.x, nose.y, 0)) - neck_xy).normalized()
crown_z = max(p.z for p in coords)
skull_center = Vector((head_h.x, head_h.y, (head_h.z + crown_z) * 0.5))
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.16, segments=32, ring_count=18, location=skull_center)
cap = bpy.context.active_object
cap.name = "Hair"
world = cap.matrix_world.copy()
cap.parent = arm
cap.matrix_world = world
wrap = cap.modifiers.new("wrap", "SHRINKWRAP")
wrap.target = body
wrap.wrap_method = "NEAREST_SURFACEPOINT"
wrap.wrap_mode = "OUTSIDE"
wrap.offset = 0.012
bpy.ops.object.modifier_apply(modifier=wrap.name)
bpy.ops.object.mode_set(mode="EDIT")
bm = bmesh.from_edit_mesh(cap.data)
doomed = []
brow_z = head_h.z + (crown_z - head_h.z) * 0.48
for v in bm.verts:
    w = cap.matrix_world @ v.co
    ahead = (Vector((w.x, w.y, 0)) - neck_xy).dot(forward)
    # The crown stays, including the front of it. Only the face and the neck come off.
    if w.z < head_h.z - 0.01:
        doomed.append(v)
    elif ahead > 0.03 and w.z < brow_z:
        doomed.append(v)
bmesh.ops.delete(bm, geom=doomed, context="VERTS")
kept_z = [(cap.matrix_world @ v.co).z for v in bm.verts]
print("HAIR kept", len(bm.verts), "z", round(min(kept_z), 3) if kept_z else None, round(max(kept_z), 3) if kept_z else None, "crown", round(crown_z, 3), "brow", round(brow_z, 3))
for _ in range(6):
    boundary = [v for v in bm.verts if any(e.is_boundary for e in v.link_edges)]
    for v in boundary:
        nbrs = [e.other_vert(v).co for e in v.link_edges if e.is_boundary]
        if nbrs:
            avg = Vector((0, 0, 0))
            for p in nbrs:
                avg += p
            v.co = v.co.lerp(avg / len(nbrs), 0.75)
    bmesh.ops.smooth_vert(bm, verts=list(bm.verts), factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
bmesh.update_edit_mesh(cap.data)
bpy.ops.object.mode_set(mode="OBJECT")
thick = cap.modifiers.new("thick", "SOLIDIFY")
thick.thickness = 0.014
thick.offset = 1
bpy.ops.object.modifier_apply(modifier=thick.name)
vg = cap.vertex_groups.new(name="Head")
vg.add(list(range(len(cap.data.vertices))), 1.0, "REPLACE")
arm_mod = cap.modifiers.new("Arm", "ARMATURE")
arm_mod.object = arm
cap.data.materials.append(hair_mat)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.075, segments=18, ring_count=12, location=Vector((head_h.x, head_h.y, crown_z + 0.02)) - forward * 0.015)
bun = bpy.context.active_object
bun.name = "Bun"
world = bun.matrix_world.copy()
bun.parent = arm
bun.matrix_world = world
vg = bun.vertex_groups.new(name="Head")
vg.add(list(range(len(bun.data.vertices))), 1.0, "REPLACE")
arm_mod = bun.modifiers.new("Arm", "ARMATURE")
arm_mod.object = arm
bun.data.materials.append(hair_mat)

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
