# Original isometric sprites for Khaya Lane. No third-party meshes.
# Glossy, chunky, and lit like a colourful builder — modelled and rendered here.
import math
import os
import bpy
from mathutils import Matrix, Vector

OUT = os.environ.get("KHAYA_OUT", "/tmp/khaya-sprites")
os.makedirs(OUT, exist_ok=True)
SAMPLES = int(os.environ.get("KHAYA_SAMPLES", "16"))
RES = int(os.environ.get("KHAYA_RES", "640"))

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.eevee.taa_render_samples = SAMPLES
for attr, value in (
    ("use_gtao", True),
    ("gtao_distance", 0.55),
    ("gtao_factor", 1.35),
    ("use_bloom", False),
    ("use_ssr", False),
):
    try:
        setattr(scene.eevee, attr, value)
    except Exception:
        pass
scene.render.resolution_x = RES
scene.render.resolution_y = RES
scene.render.film_transparent = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.view_settings.exposure = 0.0

world = bpy.data.worlds.new("sky")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (1.0, 0.96, 0.9, 1)
bg.inputs[1].default_value = 1.05

bpy.ops.object.light_add(type="SUN", rotation=(math.radians(52), math.radians(8), math.radians(-36)))
sun = bpy.context.active_object
sun.data.energy = 4.4
sun.data.color = (1.0, 0.95, 0.84)
sun.data.angle = math.radians(8)

bpy.ops.object.light_add(type="AREA", location=(2.5, -7.5, 6.5))
fill = bpy.context.active_object
fill.data.energy = 280
fill.data.size = 8
fill.data.color = (1.0, 0.9, 0.78)

bpy.ops.object.light_add(type="SUN", rotation=(math.radians(118), math.radians(-28), math.radians(210)))
rim = bpy.context.active_object
rim.data.energy = 1.8
rim.data.color = (0.55, 0.78, 1.0)
rim.data.angle = math.radians(14)

target = bpy.data.objects.new("target", None)
scene.collection.objects.link(target)
target.location = (0, 0, 1.05)

bpy.ops.object.camera_add(location=(8.6, -8.6, 7.4))
cam = bpy.context.active_object
cam.data.type = "ORTHO"
cam.data.ortho_scale = 8.6
con = cam.constraints.new("TRACK_TO")
con.target = target
con.track_axis = "TRACK_NEGATIVE_Z"
con.up_axis = "UP_Y"
scene.camera = cam
keep = {sun.name, fill.name, rim.name, cam.name, target.name}


def M(name, color, rough=0.38, metal=0.0, spec=0.45, coat=0.0):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (color[0], color[1], color[2], 1)
    b.inputs["Roughness"].default_value = rough
    if "Metallic" in b.inputs:
        b.inputs["Metallic"].default_value = metal
    for key in ("Specular IOR Level", "Specular"):
        if key in b.inputs:
            b.inputs[key].default_value = spec
            break
    for key in ("Coat Weight", "Clearcoat"):
        if key in b.inputs and coat:
            b.inputs[key].default_value = coat
            break
    return m


CREAM = M("cream", (0.98, 0.93, 0.84), 0.42, 0, 0.4, 0.18)
YELLOW = M("yellow", (0.98, 0.78, 0.18), 0.36, 0, 0.5, 0.28)
YELLOW_D = M("yellowd", (0.86, 0.58, 0.08), 0.4)
TEAL = M("teal", (0.05, 0.62, 0.58), 0.28, 0.05, 0.55, 0.35)
TEAL_D = M("teald", (0.03, 0.38, 0.4), 0.32, 0.08)
ROOF = M("roof", (0.86, 0.28, 0.16), 0.22, 0.62, 0.7, 0.25)
ROOFG = M("roofg", (0.12, 0.48, 0.34), 0.2, 0.58, 0.65, 0.3)
ROOFB = M("roofb", (0.16, 0.38, 0.72), 0.2, 0.55, 0.6, 0.25)
BRICK = M("brick", (0.72, 0.28, 0.18), 0.55, 0, 0.3)
BRICK2 = M("brick2", (0.55, 0.2, 0.14), 0.6)
WOOD = M("wood", (0.62, 0.38, 0.16), 0.5)
WOOD_D = M("woodd", (0.36, 0.2, 0.08), 0.48)
GLASS = M("glass", (0.55, 0.82, 0.95), 0.08, 0.05, 0.8, 0.45)
METAL = M("metal", (0.55, 0.58, 0.62), 0.22, 0.85, 0.6)
GOLD = M("gold", (0.98, 0.72, 0.16), 0.2, 0.7, 0.7, 0.3)
WHITE = M("white", (0.97, 0.96, 0.93), 0.3, 0, 0.45, 0.2)
SOIL = M("soil", (0.4, 0.24, 0.12), 0.7)
LEAF = M("leaf", (0.18, 0.62, 0.22), 0.4, 0, 0.35, 0.15)
LEAF_D = M("leafd", (0.1, 0.4, 0.16), 0.45)
MAIZE = M("maize", (0.98, 0.78, 0.12), 0.35, 0, 0.4, 0.1)
TOMATO = M("tomato", (0.86, 0.12, 0.1), 0.28, 0, 0.5, 0.25)
SPIN = M("spin", (0.1, 0.58, 0.28), 0.35)
ALOE = M("aloe", (0.35, 0.7, 0.4), 0.32, 0, 0.4, 0.2)
PINK = M("pink", (0.9, 0.28, 0.48), 0.32, 0, 0.45, 0.2)
SAGE = M("sage", (0.48, 0.75, 0.48), 0.38, 0, 0.4, 0.15)
NAVY = M("navy", (0.1, 0.18, 0.42), 0.4, 0, 0.35)
GREEN = M("green", (0.08, 0.48, 0.24), 0.35, 0, 0.4, 0.12)
ORANGE = M("orange", (0.92, 0.4, 0.1), 0.34, 0, 0.45, 0.15)
SKIN_A = M("skina", (0.55, 0.32, 0.18), 0.42, 0, 0.4, 0.12)
SKIN_B = M("skinb", (0.72, 0.46, 0.28), 0.42, 0, 0.4, 0.12)
SKIN_C = M("skinc", (0.32, 0.18, 0.1), 0.4, 0, 0.35, 0.1)
HAIR = M("hair", (0.08, 0.05, 0.04), 0.45)
HAIR_B = M("hairb", (0.16, 0.08, 0.04), 0.48)
HEN = M("hen", (0.96, 0.94, 0.9), 0.35, 0, 0.4, 0.15)
DOG = M("dog", (0.52, 0.3, 0.14), 0.42)
DOG_W = M("dogw", (0.94, 0.9, 0.82), 0.4)
PURPLE = M("purple", (0.58, 0.28, 0.78), 0.35, 0, 0.4, 0.15)
PURPLE_D = M("purpled", (0.36, 0.16, 0.55), 0.4)
JOJO = M("jojo", (0.08, 0.55, 0.32), 0.22, 0.15, 0.55, 0.4)
PANEL = M("panel", (0.08, 0.22, 0.55), 0.08, 0.4, 0.8, 0.55)
EYE = M("eye", (0.12, 0.08, 0.06), 0.2)
IRIS = M("iris", (0.28, 0.16, 0.08), 0.25)
OUTLINE = None


def outline_material():
    global OUTLINE
    if OUTLINE:
        return OUTLINE
    m = bpy.data.materials.new("outline")
    m.use_nodes = True
    m.use_backface_culling = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (0.18, 0.09, 0.06, 1)
    em.inputs["Strength"].default_value = 1.0
    nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
    OUTLINE = m
    return m


def cube(loc, dim, material, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.scale = dim
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(material)
    if bevel > 0 and min(dim) > bevel * 2.4:
        b = o.modifiers.new("b", "BEVEL")
        b.width = bevel
        b.segments = 2
        bpy.ops.object.modifier_apply(modifier=b.name)
    return o


def cyl(loc, radius, depth, material, rot=(0, 0, 0), verts=16):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.active_object
    o.data.materials.append(material)
    return o


def uv(loc, radius, material, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=loc, segments=16, ring_count=10)
    o = bpy.context.active_object
    o.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(material)
    return o


def cone(loc, r, depth, material, rot=(0, 0, 0), verts=12):
    bpy.ops.mesh.primitive_cone_add(radius1=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.active_object
    o.data.materials.append(material)
    return o


def capsule(a, b, radius, material):
    a = Vector(a)
    b = Vector(b)
    d = b - a
    length = d.length
    mid = (a + b) / 2
    if length < 0.001:
        return uv((mid.x, mid.y, mid.z), radius, material)
    o = cyl((mid.x, mid.y, mid.z), radius, max(length - radius * 0.2, 0.02), material, verts=10)
    o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = d.normalized().to_track_quat("Z", "Y")
    uv((a.x, a.y, a.z), radius * 0.98, material)
    uv((b.x, b.y, b.z), radius * 0.92, material)
    return o


def clear_meshes():
    for o in list(bpy.data.objects):
        if o.name not in keep and o.type in {"MESH", "FONT", "CURVE", "EMPTY"}:
            bpy.data.objects.remove(o, do_unlink=True)
    for block in list(bpy.data.meshes):
        if block.users == 0:
            bpy.data.meshes.remove(block)


def outline_all():
    mat = outline_material()
    sources = [o for o in bpy.data.objects if o.type == "MESH" and not o.get("no_outline")]
    for src in sources:
        if mat.name not in src.data.materials:
            src.data.materials.append(mat)
        bpy.ops.object.select_all(action="DESELECT")
        src.select_set(True)
        bpy.context.view_layer.objects.active = src
        mod = src.modifiers.new("shell", "SOLIDIFY")
        mod.thickness = 0.012
        mod.offset = 1
        mod.use_flip_normals = True
        mod.material_offset = 1
        try:
            bpy.ops.object.modifier_apply(modifier="shell")
        except Exception as err:
            print("SHELL", err, flush=True)


def shadow(scale):
    m = M("shadow", (0.2, 0.1, 0.05), 1)
    try:
        m.blend_method = "BLEND"
        m.shadow_method = "NONE"
    except Exception:
        pass
    m.node_tree.nodes["Principled BSDF"].inputs["Alpha"].default_value = 0.32
    o = uv((0, 0, 0.02), scale, m, (1.15, 0.85, 0.012))
    o["no_outline"] = True


def shot(name, shade=1.6, ortho=8.6):
    cam.data.ortho_scale = ortho
    try:
        outline_all()
    except Exception as err:
        print("OUTLINE FAIL", name, err, flush=True)
    shadow(shade)
    scene.render.filepath = os.path.join(OUT, name + ".png")
    bpy.ops.render.render(write_still=True)
    clear_meshes()
    print("SHOT", name, flush=True)


def turn(angle):
    if abs(angle) < 0.0001:
        return
    rot = Matrix.Rotation(angle, 4, "Z")
    for o in list(bpy.data.objects):
        if o.type == "MESH" and o.name not in keep and not o.get("no_turn"):
            o.matrix_world = rot @ o.matrix_world


def window_y(x, y, z, w=0.62, h=0.58):
    cube((x, y, z), (w, 0.08, h), WOOD_D, 0.01)
    cube((x, y - 0.03, z), (w * 0.72, 0.05, h * 0.72), GLASS)
    bars = 4
    for i in range(bars):
        bx = x - w * 0.30 + i * (w * 0.60 / (bars - 1))
        cube((bx, y - 0.09, z), (0.028, 0.03, h * 0.78), METAL)
    cube((x, y - 0.09, z + h * 0.32), (w * 0.78, 0.025, 0.028), METAL)
    cube((x, y - 0.09, z - h * 0.32), (w * 0.78, 0.025, 0.028), METAL)


def window_x(x, y, z, w=0.62, h=0.58):
    cube((x, y, z), (0.08, w, h), WOOD_D, 0.01)
    cube((x + 0.03, y, z), (0.05, w * 0.72, h * 0.72), GLASS)
    for i in range(4):
        by = y - w * 0.30 + i * (w * 0.60 / 3)
        cube((x + 0.09, by, z), (0.03, 0.028, h * 0.78), METAL)
    cube((x + 0.09, y, z + h * 0.32), (0.025, w * 0.78, 0.028), METAL)


def door(x, y, z, color, face="y"):
    if face == "y":
        cube((x, y, z), (0.7, 0.1, 1.25), WOOD_D, 0.015)
        cube((x, y - 0.04, z - 0.02), (0.52, 0.08, 1.08), color, 0.02)
        uv((x + 0.16, y - 0.1, z), 0.055, GOLD)
        cube((x, y - 0.02, z + 0.62), (0.74, 0.06, 0.08), CREAM)
    else:
        cube((x, y, z), (0.1, 0.7, 1.25), WOOD_D, 0.015)
        cube((x + 0.04, y, z - 0.02), (0.08, 0.52, 1.08), color, 0.02)
        uv((x + 0.1, y + 0.16, z), 0.055, GOLD)


def pot(x, y, z=0.22, flower=PINK):
    cyl((x, y, z), 0.13, 0.22, BRICK, verts=10)
    cube((x, y, z + 0.12), (0.2, 0.2, 0.04), CREAM)
    uv((x, y, z + 0.28), 0.16, LEAF, (1, 1, 0.75))
    uv((x + 0.06, y - 0.06, z + 0.36), 0.07, flower)
    uv((x - 0.05, y - 0.02, z + 0.34), 0.05, GOLD)


def gutter(y, z, length):
    cyl((0, y, z), 0.045, length, METAL, rot=(0, math.radians(90), 0), verts=8)
    cyl((length / 2 - 0.05, y, z - 0.45), 0.035, 0.9, METAL, verts=8)


def gable(z, sx, sy, material, ridges=7):
    # Overhanging corrugated roof. Ridges sit on the sheet so they don't float.
    cube((0, -0.05, z + 0.05), (sx, sy * 1.06, 0.09), material, 0.01)
    cube((0, 0.0, z + 0.16), (sx * 0.96, 0.14, 0.07), CREAM)
    for i in range(ridges):
        y = -sy * 0.4 + i * (sy * 0.8 / max(1, ridges - 1))
        cyl((0, y, z + 0.1), 0.028, sx * 0.94, material, rot=(0, math.radians(90), 0), verts=6)


def stoep(y, width, depth=0.9):
    cube((0, y, 0.14), (width, depth, 0.24), CREAM, 0.02)
    cube((0, y - 0.02, 0.28), (width * 0.92, depth * 0.72, 0.06), WOOD)
    for px in (-width * 0.42, width * 0.42):
        cyl((px, y - depth * 0.38, 0.72), 0.09, 1.15, WHITE, verts=12)
        cube((px, y - depth * 0.38, 1.28), (0.2, 0.2, 0.08), TEAL)
    porch = cube((0, y - 0.05, 1.32), (width * 1.05, depth * 1.05, 0.07), ROOF)
    porch.rotation_euler[0] = math.radians(-6)


def dish(x, y, z):
    cyl((x, y, z + 0.2), 0.028, 0.45, METAL, verts=8)
    cone((x, y - 0.05, z + 0.46), 0.16, 0.07, WHITE, rot=(math.radians(100), 0, 0), verts=14)


def jojo(x, y, s=1.0):
    cyl((x, y, 0.12 * s), 0.55 * s, 0.16 * s, CREAM, verts=20)
    cyl((x, y, 0.7 * s), 0.48 * s, 1.05 * s, JOJO, verts=24)
    for i in range(4):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=0.5 * s, minor_radius=0.035 * s,
            location=(x, y, (0.35 + i * 0.22) * s), major_segments=20, minor_segments=8,
        )
        ring = bpy.context.active_object
        ring.data.materials.append(TEAL_D)
    cyl((x, y, 1.28 * s), 0.5 * s, 0.08 * s, WHITE, verts=20)
    uv((x, y, 1.36 * s), 0.1 * s, TEAL)
    cyl((x + 0.5 * s, y - 0.05 * s, 0.38 * s), 0.04 * s, 0.28 * s, METAL, rot=(0, math.radians(90), 0), verts=8)
    uv((x + 0.64 * s, y - 0.05 * s, 0.32 * s), 0.05 * s, GOLD)


def washing(x, y):
    cyl((x - 0.7, y, 0.7), 0.04, 1.35, WOOD_D, verts=6)
    cyl((x + 0.7, y, 0.7), 0.04, 1.35, WOOD_D, verts=6)
    cyl((x, y, 1.32), 0.015, 1.5, METAL, rot=(0, math.radians(90), 0), verts=6)
    cube((x - 0.35, y, 1.12), (0.32, 0.05, 0.38), TEAL)
    cube((x + 0.05, y, 1.08), (0.28, 0.05, 0.42), GOLD)
    cube((x + 0.38, y, 1.14), (0.26, 0.05, 0.3), WHITE)
    cube((x - 0.05, y, 1.16), (0.22, 0.04, 0.26), PINK)


def gate(y):
    cube((-1.15, y, 0.32), (1.15, 0.12, 0.58), BRICK, 0.01)
    cube((1.15, y, 0.32), (1.15, 0.12, 0.58), BRICK, 0.01)
    cyl((-0.5, y, 0.55), 0.045, 0.95, WOOD_D, verts=6)
    cyl((0.5, y, 0.55), 0.045, 0.95, WOOD_D, verts=6)
    for i in range(4):
        gx = -0.32 + i * 0.21
        cube((gx, y, 0.42), (0.035, 0.04, 0.7), METAL)
    cube((0, y, 0.74), (0.85, 0.04, 0.04), GOLD)


def sign(x, y, z, words, color=TEAL_D):
    cube((x, y, z), (1.35, 0.08, 0.48), color, 0.02)
    cube((x, y - 0.02, z), (1.2, 0.04, 0.1), GOLD)
    bpy.ops.object.text_add(location=(x, y - 0.08, z + 0.02), rotation=(math.radians(90), 0, 0))
    t = bpy.context.active_object
    t.data.body = words
    t.data.size = 0.32
    t.data.extrude = 0.02
    t.data.align_x = "CENTER"
    t.data.align_y = "CENTER"
    bpy.ops.object.convert(target="MESH")
    t.data.materials.append(WHITE)


def home1():
    cube((0, 0.15, 0.2), (3.15, 2.7, 0.32), BRICK, 0.02)
    cube((0, 0.15, 1.05), (3.05, 2.6, 1.45), YELLOW, 0.05)
    cube((0, 0.15, 1.72), (3.15, 2.7, 0.1), TEAL)
    for i in range(7):
        x = -1.25 + i * 0.42
        cube((x, -1.18, 1.0), (0.06, 0.04, 1.35), YELLOW_D)
    gable(1.85, 3.45, 3.05, ROOF, 9)
    gutter(-1.55, 1.7, 3.3)
    stoep(-1.55, 2.3, 0.85)
    door(0.15, -1.22, 0.85, TEAL)
    window_y(-0.85, -1.2, 1.15)
    window_x(1.55, 0.15, 1.15)
    pot(-1.35, -1.7, 0.28, PINK)
    pot(1.15, -1.85, 0.28, LEAF)
    shot("home1", 2.15, 9.2)


def home2():
    cube((0, 0.1, 0.28), (3.35, 2.9, 0.5), BRICK, 0.02)
    cube((0, 0.1, 1.15), (3.2, 2.75, 1.3), CREAM, 0.04)
    cube((0, 0.1, 1.78), (3.3, 2.85, 0.12), TEAL)
    cube((0, 0.1, 0.55), (3.28, 2.82, 0.12), BRICK2)
    gable(1.95, 3.6, 3.2, ROOF, 10)
    cube((0.95, 0.85, 2.55), (0.32, 0.32, 0.7), BRICK, 0.02)
    cube((0.95, 0.85, 2.92), (0.4, 0.4, 0.08), CREAM)
    gutter(-1.6, 1.82, 3.4)
    stoep(-1.7, 2.5, 0.95)
    door(-0.15, -1.32, 0.95, GREEN)
    window_y(0.85, -1.32, 1.25, 0.7, 0.62)
    window_x(1.65, -0.15, 1.2)
    window_x(1.65, 0.7, 1.2, 0.5, 0.5)
    pot(-1.45, -1.85, 0.32, PINK)
    washing(0.2, 1.55)
    dish(-1.15, 0.85, 2.15)
    jojo(1.85, 0.55, 0.72)
    gate(-2.35)
    shot("home2", 2.35, 10.2)


def home3():
    cube((0, 0.05, 0.32), (3.25, 2.85, 0.55), BRICK, 0.02)
    cube((0, 0.05, 1.25), (3.15, 2.75, 1.35), CREAM, 0.04)
    cube((0, 0.05, 2.35), (3.05, 2.65, 1.05), SAGE, 0.04)
    cube((0, 0.05, 1.9), (3.2, 2.8, 0.1), TEAL)
    gable(2.95, 3.4, 3.05, ROOFG, 9)
    # balcony
    cube((0, -1.55, 1.95), (2.3, 0.7, 0.08), WOOD)
    for i in range(6):
        cyl((-0.95 + i * 0.38, -1.85, 2.22), 0.03, 0.5, METAL, verts=6)
    cube((0, -1.85, 2.46), (2.15, 0.05, 0.05), GOLD)
    door(-0.2, -1.28, 0.95, TEAL)
    window_y(0.75, -1.28, 1.2)
    window_y(-0.55, -1.28, 2.45, 0.55, 0.48)
    window_y(0.55, -1.28, 2.45, 0.55, 0.48)
    window_x(1.6, 0.1, 1.15)
    window_x(1.6, 0.1, 2.45, 0.55, 0.48)
    gutter(-1.5, 2.8, 3.2)
    # roof solar
    panel = cube((0.25, 0.15, 3.55), (1.45, 0.95, 0.05), PANEL)
    panel.rotation_euler[0] = math.radians(-18)
    cube((0.25, 0.15, 3.48), (1.55, 1.02, 0.04), METAL)
    for i in range(3):
        bar = cube((0.25, -0.2 + i * 0.28, 3.6), (1.35, 0.02, 0.015), WHITE)
        bar.rotation_euler[0] = math.radians(-18)
    dish(-1.2, 0.7, 3.15)
    pot(-1.4, -1.7, 0.4, PINK)
    pot(1.35, -1.55, 0.4, GOLD)
    shot("home3", 2.15, 9.6)


def spaza(level):
    cube((0, 0.25, 0.95), (2.15, 1.7, 1.7), YELLOW, 0.05)
    cube((0, 0.25, 1.78), (2.25, 1.8, 0.12), PINK)
    cube((0, 0.25, 0.28), (2.3, 1.85, 0.4), BRICK, 0.02)
    # counter and hatch
    cube((0.1, -0.85, 0.48), (1.7, 0.7, 0.7), WOOD, 0.03)
    cube((0.15, -0.7, 0.95), (0.85, 0.12, 0.48), TEAL_D)
    cube((0.15, -0.78, 0.95), (0.7, 0.06, 0.34), GLASS)
    cube((0.15, -0.82, 0.78), (0.95, 0.35, 0.06), CREAM)
    sign(-0.15, -0.7, 1.48, "SPAZA", TEAL_D)
    # umbrella
    cyl((-0.15, -1.45, 0.7), 0.045, 1.35, WOOD_D, verts=8)
    cone((-0.15, -1.45, 1.5), 0.78, 0.38, TEAL, verts=16)
    cone((-0.15, -1.45, 1.62), 0.28, 0.16, WHITE, verts=12)
    # crates and produce
    cube((-0.85, -1.15, 0.28), (0.42, 0.36, 0.32), WOOD_D, 0.02)
    cube((0.7, -1.2, 0.26), (0.48, 0.38, 0.28), WOOD, 0.02)
    uv((-0.95, -1.15, 0.55), 0.14, TOMATO)
    uv((-0.74, -1.22, 0.52), 0.12, TOMATO)
    uv((-0.84, -1.05, 0.62), 0.1, TOMATO)
    uv((0.62, -1.18, 0.55), 0.14, MAIZE, (0.75, 0.75, 1.35))
    uv((0.86, -1.1, 0.52), 0.12, LEAF, (1, 1, 0.65))
    pot(1.15, -0.55, 0.55, PINK)
    if level >= 2:
        cube((1.05, 0.35, 0.85), (0.55, 0.45, 1.15), TEAL_D, 0.03)
        cube((1.05, 0.1, 1.05), (0.38, 0.06, 0.55), GLASS)
        cube((-1.15, 0.2, 0.7), (0.08, 0.5, 0.9), WOOD)
        uv((-1.05, -0.4, 1.35), 0.1, GOLD)
    shot("spaza" + str(level), 1.55, 6.4)


def bed(kind):
    cube((0, 0, 0.16), (1.7, 1.7, 0.28), WOOD, 0.03)
    cube((0, 0, 0.32), (1.42, 1.42, 0.12), SOIL)
    if kind == "empty":
        for i in range(4):
            cube((0, -0.5 + i * 0.33, 0.42), (1.15, 0.045, 0.03), WOOD_D)
        shot("bed_empty", 1.05, 4.2)
        return
    if kind == "sown":
        for i in range(8):
            uv((-0.5 + (i % 4) * 0.32, -0.2 + (i // 4) * 0.4, 0.42), 0.05, CREAM)
        shot("bed_sown", 1.05, 4.2)
        return
    crop, stage = kind.split("_")
    h = 0.42 if stage == "mid" else 0.85
    col = {"maize": LEAF, "spinach": SPIN, "tomato": LEAF_D, "aloe": ALOE}[crop]
    for i in range(6):
        x = -0.4 + (i % 3) * 0.4
        y = -0.25 + (i // 3) * 0.45
        cyl((x, y, 0.42 + h * 0.35), 0.035, h * 0.7, LEAF_D, verts=6)
        uv((x, y, 0.48 + h * 0.75), 0.18 if stage == "mid" else 0.24, col, (1, 1, 0.7))
    if stage == "ready" and crop == "maize":
        for i in range(3):
            cob = cyl((-0.35 + i * 0.35, 0.05, 1.15), 0.08, 0.42, MAIZE, rot=(math.radians(75), 0, 0.2), verts=8)
            cob.scale = (1, 1, 1)
    if stage == "ready" and crop == "tomato":
        for i in range(5):
            uv((-0.3 + (i % 3) * 0.3, -0.1 + (i // 3) * 0.3, 0.95), 0.1, TOMATO)
    if stage == "ready" and crop == "spinach":
        for i in range(4):
            uv((-0.3 + (i % 2) * 0.4, -0.1 + (i // 2) * 0.35, 0.7), 0.16, SPIN, (1.3, 0.8, 0.35))
    if stage == "ready" and crop == "aloe":
        for i in range(6):
            ang = i / 6 * math.pi * 2
            leaf = cone((math.cos(ang) * 0.12, math.sin(ang) * 0.12, 0.7), 0.07, 0.55, ALOE, rot=(math.radians(20), 0, ang), verts=6)
        cyl((0, 0, 1.15), 0.03, 0.55, LEAF_D, verts=6)
        uv((0, 0, 1.45), 0.1, GOLD)
    shot("bed_" + kind, 1.15, 4.4)


def tank():
    jojo(0, 0, 1.15)
    pot(0.85, -0.55, 0.2, LEAF)
    shot("tank", 1.2, 4.6)


def workshop():
    cube((0, 0.15, 0.75), (2.05, 1.65, 1.35), WOOD, 0.03)
    cube((0, 0.15, 0.22), (2.15, 1.75, 0.28), BRICK2, 0.02)
    gable(1.5, 2.35, 1.95, ROOF, 7)
    # open front
    cube((0.05, -0.72, 0.7), (1.15, 0.1, 1.05), TEAL_D)
    cube((0.05, -0.8, 0.55), (0.9, 0.08, 0.7), (M("dark", (0.12, 0.08, 0.06), 0.6)))
    window_x(1.1, 0.2, 0.95, 0.5, 0.48)
    cube((0.55, -1.15, 0.38), (0.7, 0.4, 0.1), WOOD_D)
    cyl((0.85, -1.2, 0.55), 0.035, 0.45, WOOD, rot=(math.radians(70), 0.4, 0.2), verts=6)
    cube((0.95, -1.35, 0.7), (0.16, 0.08, 0.1), METAL)
    for i in range(3):
        cyl((-0.7, 0.85, 0.2 + i * 0.12), 0.08, 0.7, WOOD, rot=(0, math.radians(90), 0), verts=8)
    shot("workshop", 1.4, 5.6)


def solar():
    cyl((0, 0.1, 0.45), 0.06, 0.9, METAL, verts=8)
    frame = cube((0, -0.05, 1.15), (1.7, 1.05, 0.06), WHITE)
    frame.rotation_euler[0] = math.radians(28)
    panel = cube((0, -0.12, 1.2), (1.5, 0.9, 0.04), PANEL)
    panel.rotation_euler[0] = math.radians(28)
    for i in range(4):
        line = cube((-0.55 + i * 0.36, -0.12, 1.24), (0.02, 0.82, 0.015), WHITE)
        line.rotation_euler[0] = math.radians(28)
    cube((0.85, 0.35, 0.28), (0.32, 0.24, 0.4), TEAL_D, 0.02)
    uv((0.85, 0.2, 0.52), 0.06, GOLD)
    shot("solar", 1.2, 4.8)


def jacaranda():
    cyl((0, 0, 0.45), 0.16, 0.9, WOOD_D, verts=8)
    trunk = cyl((0.02, -0.02, 1.15), 0.1, 0.75, WOOD, verts=8)
    trunk.rotation_euler[0] = math.radians(8)
    left = cyl((-0.15, 0.05, 1.35), 0.07, 0.7, WOOD_D, verts=6)
    left.rotation_euler[2] = math.radians(50)
    right = cyl((0.28, -0.05, 1.4), 0.06, 0.6, WOOD, verts=6)
    right.rotation_euler[2] = math.radians(-55)
    clumps = [
        (0.05, 0.0, 1.75, 0.42, PURPLE),
        (-0.42, 0.1, 1.62, 0.32, PURPLE_D),
        (0.46, -0.06, 1.6, 0.3, PURPLE),
        (-0.15, -0.22, 1.5, 0.26, LEAF_D),
        (0.18, 0.22, 1.95, 0.28, PINK),
        (-0.28, 0.16, 1.98, 0.24, PURPLE),
        (0.32, 0.12, 1.92, 0.22, PURPLE_D),
        (0.0, -0.05, 2.05, 0.2, PINK),
        (-0.48, -0.05, 1.78, 0.2, PURPLE),
        (0.5, 0.12, 1.82, 0.18, PINK),
    ]
    for x, y, z, r, col in clumps:
        uv((x, y, z), r, col, (1.05, 1.05, 0.82))
    shot("jacaranda", 1.35, 5.2)


def acacia():
    cyl((0, 0, 0.7), 0.1, 1.35, WOOD, verts=8)
    for ang, length in ((0.4, 0.7), (2.2, 0.62), (3.6, 0.55), (5.1, 0.6)):
        branch = cyl((math.cos(ang) * 0.15, math.sin(ang) * 0.12, 1.35), 0.035, length, WOOD_D, verts=6)
        branch.rotation_euler[1] = math.radians(72)
        branch.rotation_euler[2] = ang
    layers = [
        (0, 0, 1.62, 0.55, LEAF, (1.35, 1.2, 0.22)),
        (-0.45, 0.12, 1.5, 0.32, LEAF_D, (1.25, 1.05, 0.2)),
        (0.42, -0.1, 1.48, 0.3, LEAF, (1.15, 1.2, 0.18)),
        (0.08, 0.22, 1.78, 0.26, LEAF, (1.1, 0.9, 0.16)),
        (-0.15, -0.18, 1.4, 0.24, LEAF_D, (1.2, 1.0, 0.16)),
    ]
    for x, y, z, r, col, sc in layers:
        uv((x, y, z), r, col, sc)
    shot("acacia", 1.35, 5.2)


def aloe_plant():
    for i in range(9):
        ang = i / 9 * math.pi * 2
        cone((math.cos(ang) * 0.18, math.sin(ang) * 0.18, 0.32), 0.09, 0.75, ALOE, rot=(math.radians(22), 0, ang), verts=7)
    cyl((0, 0, 0.95), 0.035, 0.7, LEAF_D, verts=6)
    uv((0, 0, 1.35), 0.12, GOLD)
    uv((0.08, 0, 1.28), 0.07, ORANGE)
    shot("aloeplant", 0.85, 3.2)


def fence():
    for i in range(5):
        cyl((-1.0 + i * 0.5, 0, 0.45), 0.045, 0.9, METAL, verts=6)
        cone((-1.0 + i * 0.5, 0, 0.95), 0.07, 0.16, METAL, verts=6)
    cube((0, 0, 0.35), (2.15, 0.04, 0.05), METAL)
    cube((0, 0, 0.7), (2.15, 0.04, 0.05), GOLD)
    shot("fence", 1.15, 4.4)


def neighbour(name, wall, roof, kind):
    tall = 1.85 if kind == "double" else 1.25
    cube((0, 0, tall * 0.55), (1.85, 1.5, tall), wall, 0.04)
    cube((0, 0, 0.16), (1.95, 1.6, 0.28), BRICK, 0.01)
    gable(tall + 0.05, 2.15, 1.8, roof, 6)
    door(0.25, -0.8, 0.7, TEAL if kind != "chimney" else GREEN)
    window_y(-0.45, -0.78, tall * 0.55, 0.48, 0.42)
    if kind == "chimney":
        cube((-0.45, 0.25, tall + 0.45), (0.28, 0.28, 0.55), BRICK, 0.02)
    if kind == "dish":
        dish(0.55, 0.2, tall + 0.15)
    if kind == "double":
        window_y(0.35, -0.78, tall * 0.78, 0.42, 0.36)
        cube((0, -0.95, tall * 0.62), (1.1, 0.35, 0.06), WOOD)
    pot(-0.85, -0.95, 0.28, PINK)
    shot(name, 1.25, 5.0)


def eye(x, z, bob):
    uv((x, -0.4, z + bob), 0.09, WHITE)
    uv((x, -0.47, z - 0.012 + bob), 0.05, IRIS)
    uv((x, -0.5, z - 0.012 + bob), 0.028, EYE)
    uv((x - 0.02, -0.52, z + 0.02 + bob), 0.016, WHITE)


def brow(x, z, bob, roll):
    bar = cube((x, -0.46, z + 0.07 + bob), (0.1, 0.02, 0.028), HAIR)
    bar.rotation_euler[2] = roll


def hair_crop(z, bob, material):
    uv((0, 0.06, z + 0.18 + bob), 0.3, material, (1.15, 1.05, 0.55))
    for i in range(7):
        ang = -0.8 + i * 0.26
        uv((math.sin(ang) * 0.32, math.cos(ang) * 0.16, z + 0.08 + bob), 0.12, material)


def arm(side, action, frame, bob, sleeve, skin):
    ph = frame / 6.0 * math.pi * 2 + (math.pi if side < 0 else 0)
    shoulder = (side * 0.34, -0.02, 1.22 + bob)
    if action == "wave" and side > 0:
        elbow = (side * 0.46, -0.08, 1.58 + bob)
        hand = (side * 0.5, -0.2, 1.9 + bob)
    elif action == "water" and side > 0:
        elbow = (side * 0.22, -0.28, 1.02 + bob)
        hand = (0.05, -0.58, 0.82 + bob)
    elif action == "carry" and side > 0:
        elbow = (side * 0.4, -0.12, 0.98 + bob)
        hand = (side * 0.32, -0.28, 0.72 + bob)
    elif action == "walk":
        swing = math.sin(ph)
        elbow = (side * 0.4, -0.04 + swing * 0.16, 1.0 + bob)
        hand = (side * 0.36, 0.02 + swing * 0.32, 0.74 + bob)
    else:
        elbow = (side * 0.4, -0.06, 0.98 + bob)
        hand = (side * 0.34, -0.1, 0.72 + bob)
    capsule(shoulder, elbow, 0.075, sleeve)
    capsule(elbow, hand, 0.055, skin)
    uv(hand, 0.07, skin)


def leg(side, action, frame, bob, cloth, skin, shoe):
    ph = frame / 6.0 * math.pi * 2 + (0 if side < 0 else math.pi)
    hip = (side * 0.13, 0, 0.7 + bob)
    if action == "walk":
        swing = math.sin(ph)
        knee = (side * 0.13, swing * 0.16, 0.4 + bob + max(0, -swing) * 0.08)
        foot = (side * 0.13, swing * 0.34, 0.08)
        if swing < -0.15:
            knee = (side * 0.13, swing * 0.05, 0.46 + bob)
            foot = (side * 0.12, swing * 0.08, 0.08)
    else:
        knee = (side * 0.13, 0.02, 0.38 + bob)
        foot = (side * 0.13, 0.04, 0.08)
    capsule(hip, knee, 0.09, cloth)
    capsule(knee, foot, 0.07, skin if cloth != NAVY else cloth)
    cube((foot[0], foot[1] - 0.06, 0.06), (0.16, 0.28, 0.1), shoe, 0.02)


def figure(kind, frame, facing, action):
    phase = frame / 6.0 * math.pi * 2
    bob = abs(math.sin(phase)) * 0.07 if action == "walk" else math.sin(frame * 1.3) * 0.025
    if kind == "kid":
        bob *= 1.4
    skin = {"farmer": SKIN_A, "doek": SKIN_B, "jersey": SKIN_C, "gogo": SKIN_B, "kid": SKIN_A}[kind]
    if action == "idle":
        bob = math.sin(frame) * 0.03
    # torso and hips
    shirt = {"farmer": ORANGE, "doek": ORANGE, "jersey": GREEN, "gogo": PINK, "kid": GOLD}[kind]
    pants = {"farmer": NAVY, "doek": TEAL, "jersey": NAVY, "gogo": TEAL_D, "kid": TEAL}[kind]
    scale = 0.78 if kind == "kid" else (0.94 if kind == "gogo" else 1.0)
    s = 1.0
    def p(x, y, z):
        return (x * s, y * s, z * s + (0.0 if kind != "kid" else 0.0))
    uv(p(0, 0, 0.78 + bob), 0.24 * s, pants, (1.15, 0.9, 0.75))
    uv(p(0, -0.02, 1.08 + bob), 0.32 * s, shirt, (1.0, 0.78, 1.2))
    if kind == "farmer":
        cube(p(0, -0.02, 1.05 + bob), (0.42 * s, 0.28 * s, 0.55 * s), NAVY, 0.02)
        cube(p(-0.12, -0.2, 1.22 + bob), (0.08 * s, 0.04 * s, 0.28 * s), GOLD)
        cube(p(0.12, -0.2, 1.15 + bob), (0.08 * s, 0.04 * s, 0.28 * s), GOLD)
    if kind == "jersey":
        cube(p(0, -0.28, 1.12 + bob), (0.5 * s, 0.06 * s, 0.09 * s), GOLD)
        cyl(p(0, 0, 1.32 + bob), 0.16 * s, 0.07 * s, GOLD, verts=12)
    if kind == "doek":
        cone(p(0, 0, 0.62 + bob), 0.38 * s, 0.45 * s, TEAL, verts=12)
    if kind == "gogo":
        uv(p(0, -0.02, 1.05 + bob), 0.36 * s, PINK, (1.15, 0.85, 1.05))
    # legs
    for side in (-1, 1):
        leg(side, action, frame, bob, NAVY if kind == "farmer" else pants, skin, WOOD_D if kind != "kid" else GOLD)
    for side in (-1, 1):
        arm(side, action, frame, bob, shirt if kind != "farmer" else ORANGE, skin)
    # neck and head
    cyl(p(0, 0, 1.4 + bob), 0.08 * s, 0.12 * s, skin, verts=10)
    head_z = 1.72
    head_r = 0.4 * (1.18 if kind == "kid" else 1.0)
    uv(p(0, -0.02, head_z + bob), head_r * s, skin)
    uv(p(-0.34, 0, head_z - 0.02 + bob), 0.07 * s, skin)
    uv(p(0.34, 0, head_z - 0.02 + bob), 0.07 * s, skin)
    if kind == "doek":
        uv(p(0, 0.02, head_z + 0.12 + bob), 0.46 * s, PINK, (1.2, 1.15, 0.62))
        uv(p(0.22, -0.12, head_z + 0.02 + bob), 0.1 * s, GOLD)
        uv(p(0.38, -0.02, head_z - 0.05 + bob), 0.045 * s, GOLD)
    elif kind == "gogo":
        uv(p(0, 0.04, head_z + 0.12 + bob), 0.44 * s, TEAL, (1.25, 1.15, 0.6))
        uv(p(-0.18, -0.08, head_z + 0.02 + bob), 0.08 * s, GOLD)
    elif kind == "farmer":
        uv(p(0, 0.02, head_z + 0.16 + bob), 0.26 * s, WOOD, (1.05, 1.05, 0.42))
        cyl(p(0, -0.02, head_z + 0.22 + bob), 0.52 * s, 0.035 * s, WOOD, verts=16)
        uv(p(0, 0.04, head_z + 0.08 + bob), 0.2 * s, HAIR_B, (1.15, 0.85, 0.38))
    elif kind == "jersey":
        hair_crop(head_z, bob, HAIR)
    else:
        uv(p(0, 0.04, head_z + 0.12 + bob), 0.28 * s, HAIR, (1.2, 1.15, 0.7))
        uv(p(-0.18, 0.02, head_z + 0.2 + bob), 0.14 * s, HAIR)
        uv(p(0.2, 0.0, head_z + 0.18 + bob), 0.13 * s, HAIR)
    eye(-0.14 * s, (head_z + bob) * s, 0)
    eye(0.14 * s, (head_z + bob) * s, 0)
    brow(-0.15 * s, (head_z + bob) * s, 0, 0.15)
    brow(0.15 * s, (head_z + bob) * s, 0, -0.15)
    uv(p(0, -0.4, head_z - 0.06 + bob), 0.045 * s, skin)
    smile = uv(p(0, -0.38, head_z - 0.16 + bob), 0.055 * s, M("lip", (0.55, 0.18, 0.16), 0.35), (1.5, 0.45, 0.45))
    uv(p(-0.16, -0.32, head_z - 0.1 + bob), 0.04 * s, PINK, (1, 0.6, 0.6))
    uv(p(0.16, -0.32, head_z - 0.1 + bob), 0.04 * s, PINK, (1, 0.6, 0.6))
    if action == "water":
        cube((0.12, -0.72, 0.7 + bob), (0.16, 0.38, 0.12), TEAL, 0.02)
        cyl((0.12, -0.95, 0.62 + bob), 0.035, 0.22, METAL, rot=(math.radians(75), 0, 0), verts=8)
    if kind == "gogo":
        cube(p(0.42, -0.2, 0.7 + bob), (0.28, 0.18, 0.32), WOOD, 0.02)
        cyl(p(0.42, -0.2, 0.95 + bob), 0.02, 0.22, GOLD, verts=6)
    # kid and gogo were posed in mixed scale; turn the whole mesh
    if scale != 1:
        scale_meshes(scale)
    turn(facing * math.pi / 2)


def scale_meshes(s):
    for o in list(bpy.data.objects):
        if o.type != "MESH" or o.name in keep or o.get("no_turn"):
            continue
        o.location = o.location * s
        o.scale = (o.scale.x * s, o.scale.y * s, o.scale.z * s)


def person_shots():
    specs = [
        ("farmer", "walk", 6),
        ("doek", "walk", 6),
        ("jersey", "walk", 6),
        ("gogo", "carry", 4),
        ("kid", "idle", 4),
    ]
    for kind, action, count in specs:
        facings = (0, 1, 2, 3) if action == "walk" else (0,)
        for facing in facings:
            for frame in range(count):
                figure(kind, frame, facing, action)
                if action == "walk":
                    tag = "%s_w_%d_%d" % (kind, facing, frame)
                else:
                    tag = "%s_%d" % (kind, frame)
                shot(tag, 1.15 if kind != "kid" else 0.9, 4.6)
    for frame in range(4):
        figure("farmer", frame, 0, "water")
        shot("farmer_water_%d" % frame, 1.15, 4.6)
    for frame in range(4):
        figure("jersey", frame, 0, "wave")
        shot("jersey_wave_%d" % frame, 1.15, 4.6)


def animal_shots():
    for frame in range(4):
        bob = 0.03 * math.sin(frame * 1.4)
        step = 0.12 if frame % 2 == 0 else -0.08
        uv((0, 0, 0.36 + bob), 0.28, HEN, (1.45, 1.05, 0.85))
        uv((0.28, -0.12, 0.48 + bob), 0.14, HEN)
        cone((0.42, -0.2, 0.5 + bob), 0.06, 0.16, GOLD, rot=(math.radians(90), 0, math.radians(-40)), verts=6)
        uv((0.18, -0.02, 0.62 + bob), 0.06, PINK)
        uv((0.3, -0.22, 0.54 + bob), 0.035, EYE)
        uv((0.34, -0.26, 0.56 + bob), 0.012, WHITE)
        uv((-0.22, 0.02, 0.48 + bob), 0.1, HEN, (0.5, 1.2, 0.7))
        cyl((-0.08, 0.1 + step, 0.12), 0.03, 0.2, GOLD, verts=6)
        cyl((0.1, 0.08 - step, 0.12), 0.03, 0.2, GOLD, verts=6)
        shot("hen_%d" % frame, 0.7, 2.6)
        body = uv((0, step * 0.15, 0.32), 0.22, DOG, (1.7, 0.85, 0.8))
        uv((0.34, -0.04, 0.46), 0.16, DOG)
        uv((0.46, -0.1, 0.42), 0.07, DOG_W, (1.3, 0.7, 0.6))
        uv((0.28, -0.12, 0.52), 0.035, EYE)
        uv((0.3, -0.15, 0.54), 0.012, WHITE)
        uv((0.22, 0.08, 0.58), 0.08, DOG, (0.7, 0.4, 1.1))
        uv((-0.22, 0.06, 0.34), 0.1, DOG_W, (1.2, 0.8, 0.7))
        cyl((-0.38, 0.12, 0.42 + bob), 0.035, 0.32, DOG, rot=(0, math.radians(35 + frame * 18), math.radians(20)), verts=6)
        cyl((-0.08, 0.08 + step, 0.12), 0.04, 0.2, DOG, verts=6)
        cyl((0.16, 0.06 - step, 0.12), 0.04, 0.2, DOG, verts=6)
        cyl((0.42, -0.12, 0.4), 0.025, 0.12, GOLD, verts=6)
        shot("dog_%d" % frame, 0.85, 3.2)


def buildings():
    home1()
    home2()
    home3()
    spaza(1)
    spaza(2)
    bed("empty")
    bed("sown")
    for crop in ("maize", "spinach", "tomato", "aloe"):
        bed(crop + "_mid")
        bed(crop + "_ready")
    tank()
    workshop()
    solar()
    jacaranda()
    acacia()
    aloe_plant()
    fence()
    neighbour("neighbour", PINK, ROOFB, "chimney")
    neighbour("neighbour2", SAGE, ROOFG, "dish")
    neighbour("neighbour3", CREAM, ROOF, "double")


only = os.environ.get("KHAYA_ONLY", "test")
if only == "test":
    home1()
    spaza(1)
    jacaranda()
    figure("farmer", 0, 0, "walk")
    shot("farmer_w_0_0", 1.15, 4.6)
    figure("farmer", 2, 0, "walk")
    shot("farmer_w_0_2", 1.15, 4.6)
    figure("doek", 0, 0, "walk")
    shot("doek_w_0_0", 1.15, 4.6)
elif only == "fix":
    home2()
    home3()
elif only == "roof":
    home1()
    spaza(1)
elif only == "buildings":
    buildings()
elif only == "people":
    person_shots()
    animal_shots()
elif only == "all":
    buildings()
    person_shots()
    animal_shots()
else:
    raise SystemExit("unknown KHAYA_ONLY " + only)
print("DONE")
