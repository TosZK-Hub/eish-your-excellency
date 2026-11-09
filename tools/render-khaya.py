# Original isometric sprites for Khaya Lane. Blender EEVEE, no external models.
import bpy
import math
import os
from mathutils import Euler

OUT = "/tmp/khaya-sprites"
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.eevee.taa_render_samples = 16
scene.render.resolution_x = 640
scene.render.resolution_y = 640
scene.render.film_transparent = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "Standard"
scene.render.fps = 24

world = bpy.data.worlds.new("sky")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (1.0, 0.93, 0.84, 1)
bg.inputs[1].default_value = 0.9

bpy.ops.object.light_add(type="SUN", rotation=(math.radians(52), math.radians(8), math.radians(35)))
sun = bpy.context.active_object
sun.data.energy = 2.6
sun.data.color = (1.0, 0.93, 0.82)
sun.data.angle = math.radians(8)

bpy.ops.object.light_add(type="AREA", location=(-5, 4, 6))
fill = bpy.context.active_object
fill.data.energy = 60
fill.data.size = 8
fill.data.color = (0.75, 0.86, 1.0)

target = bpy.data.objects.new("target", None)
scene.collection.objects.link(target)
target.location = (0, 0, 0.0)

bpy.ops.object.camera_add(location=(7.2, -7.2, 6.4))
cam = bpy.context.active_object
cam.data.type = "ORTHO"
cam.data.ortho_scale = 7.2
con = cam.constraints.new("TRACK_TO")
con.target = target
con.track_axis = "TRACK_NEGATIVE_Z"
con.up_axis = "UP_Y"
scene.camera = cam

keep = {sun.name, fill.name, cam.name, target.name}

def M(name, color, rough=0.62, metal=0.0):
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
    return m

PLASTER = M("plaster", (0.93, 0.82, 0.66))
PLASTER2 = M("plaster2", (0.93, 0.78, 0.62))
TEAL = M("teal", (0.16, 0.55, 0.48))
TEAL_D = M("teald", (0.10, 0.40, 0.36))
DOOR = M("door", (0.45, 0.26, 0.14))
ROOF = M("roof", (0.78, 0.32, 0.24), 0.45, 0.25)
ROOF2 = M("roof2", (0.20, 0.45, 0.38), 0.4, 0.3)
WOOD = M("wood", (0.62, 0.40, 0.22))
WOOD_D = M("woodd", (0.42, 0.26, 0.14))
GLASS = M("glass", (0.35, 0.62, 0.72), 0.12, 0.0)
SOIL = M("soil", (0.42, 0.26, 0.16))
LEAF = M("leaf", (0.28, 0.62, 0.28))
LEAF_D = M("leafd", (0.16, 0.42, 0.22))
MAIZE = M("maize", (0.93, 0.74, 0.22))
TOMATO = M("tomato", (0.82, 0.20, 0.16))
SPIN = M("spin", (0.22, 0.62, 0.32))
ALOE = M("aloe", (0.45, 0.72, 0.48))
TANKC = M("tank", (0.18, 0.48, 0.36), 0.35, 0.15)
SOLAR = M("solar", (0.12, 0.32, 0.55), 0.2, 0.4)
PURPLE = M("jac", (0.55, 0.32, 0.72))
PURPLE2 = M("jac2", (0.40, 0.22, 0.55))
SKIN = M("skin", (0.62, 0.40, 0.26))
SHIRT = M("shirt", (0.90, 0.45, 0.22))
SHIRT2 = M("shirt2", (0.20, 0.45, 0.62))
CREAM = M("cream", (0.98, 0.94, 0.86))
GOLD = M("gold", (0.90, 0.70, 0.22))
PINK = M("pink", (0.86, 0.35, 0.48))
WHITE = M("white", (0.95, 0.95, 0.93))
HEN = M("hen", (0.93, 0.90, 0.82))
DOG = M("dog", (0.55, 0.36, 0.20))

def cube(loc, dim, material):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.scale = dim
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(material)
    bev = o.modifiers.new("b", "BEVEL")
    bev.width = min(0.035, min(dim) * 0.18)
    bev.segments = 1
    bpy.ops.object.modifier_apply(modifier=bev.name)
    return o

def cyl(loc, radius, depth, material, rot=(0, 0, 0), verts=20):
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

def cone(loc, r1, depth, material):
    bpy.ops.mesh.primitive_cone_add(radius1=r1, depth=depth, location=loc, vertices=12)
    o = bpy.context.active_object
    o.data.materials.append(material)
    return o

def clear_meshes():
    for o in list(bpy.data.objects):
        if o.name not in keep and o.type == "MESH":
            bpy.data.objects.remove(o, do_unlink=True)
    for block in list(bpy.data.meshes):
        if block.users == 0:
            bpy.data.meshes.remove(block)

def shot(name, shade=1.15):
    shadow = M("shadow", (0.25, 0.16, 0.1))
    shadow.blend_method = "BLEND"
    shadow.node_tree.nodes["Principled BSDF"].inputs["Alpha"].default_value = 0.28
    uv((0, 0, 0.02), shade, shadow, (1, 0.85, 0.03))
    scene.render.filepath = os.path.join(OUT, name + ".png")
    bpy.ops.render.render(write_still=True)
    clear_meshes()
    print("SHOT", name)

def roof_corrugated(z, sx, sy, material, n=9):
    cube((0, 0, z), (sx, sy, 0.08), material)
    for i in range(n):
        y = -sy / 2 + (i + 0.5) * sy / n
        cyl((0, y, z + 0.06), 0.035, sx * 0.98, material, rot=(0, math.radians(90), 0), verts=8)

def window(x, y, z):
    cube((x, y, z), (0.12, 0.62, 0.55), WOOD_D)
    cube((x, y - 0.04, z), (0.08, 0.46, 0.38), GLASS)

def home(level):
    cube((0, 0, 0.85), (3.5, 3.5, 1.7), PLASTER)
    cube((0, -1.95, 0.12), (3.7, 0.7, 0.24), WOOD)  # stoep
    roof_corrugated(1.82, 3.9, 3.9, ROOF if level < 3 else ROOF2, 8)
    cube((0.9, -1.78, 0.7), (0.55, 0.12, 1.15), TEAL if level > 1 else DOOR)
    window(-0.9, -1.78, 1.05)
    window(0.9, -1.78, 1.15) if False else None
    window(-1.78, 0.4, 1.0)
    cube((-1.55, -1.7, 0.28), (0.35, 0.35, 0.35), WOOD)
    uv((-1.55, -1.7, 0.55), 0.22, PINK, (1, 1, 0.7))
    if level >= 2:
        cyl((-1.2, 0.2, 2.35), 0.16, 0.7, PLASTER2)
        cube((-0.2, 1.3, 1.35), (0.05, 1.6, 0.04), WOOD_D)
        cube((-0.55, 1.15, 1.15), (0.28, 0.36, 0.28), CREAM)
        cube((0.15, 1.15, 1.18), (0.28, 0.32, 0.22), TEAL)
        uv((1.5, 1.5, 0.35), 0.28, PINK, (1, 1, 0.6))
        uv((1.15, 1.55, 0.28), 0.18, GOLD, (1, 1, 0.6))
    if level >= 3:
        cube((0.4, -0.2, 2.15), (1.5, 1.1, 0.06), SOLAR)
        cube((0.4, -0.2, 2.12), (1.55, 0.06, 0.08), WOOD_D)
        cube((0.4, 0.15, 2.12), (1.55, 0.06, 0.08), WOOD_D)
        cyl((1.6, -1.5, 0.9), 0.06, 1.5, WOOD_D)
        uv((1.6, -1.5, 1.7), 0.16, GOLD)
    shot("home" + str(level), 2.05)

def spaza(level):
    cube((0, 0.25, 0.72), (1.7, 1.15, 1.4), PLASTER)
    cube((0, -0.55, 0.4), (2.05, 0.85, 0.72), WOOD)
    cube((0, -0.55, 1.22), (2.2, 1.25, 0.1), TEAL)
    cube((0, -1.05, 1.14), (2.2, 0.22, 0.14), CREAM)
    cube((0.35, -0.32, 0.72), (0.42, 0.1, 0.9), TEAL)
    window(-0.4, -0.32, 0.95)
    for i, spec in enumerate(((-0.55, TOMATO), (-0.25, MAIZE), (0.1, LEAF), (0.4, GOLD))):
        uv((spec[0], -0.7, 0.86), 0.13, spec[1])
    if level >= 2:
        cube((0.72, 0.3, 0.55), (0.4, 0.35, 0.85), TEAL_D)
        cube((0.72, 0.1, 0.75), (0.28, 0.06, 0.32), GLASS)
        uv((-0.85, -0.85, 1.0), 0.1, PINK)
    shot("spaza" + str(level), 1.25)

def bed(kind):
    cube((0, 0, 0.18), (1.7, 1.7, 0.28), WOOD)
    cube((0, 0, 0.36), (1.45, 1.45, 0.12), SOIL)
    if kind == "empty":
        for i in range(4):
            cube((0, -0.5 + i * 0.33, 0.44), (1.1, 0.06, 0.04), WOOD_D)
        shot("bed_empty")
        return
    if kind == "sown":
        for i in range(5):
            uv((-0.5 + i * 0.25, 0, 0.46), 0.05, CREAM)
        shot("bed_sown")
        return
    # kind is crop_stage
    crop, stage = kind.split("_")
    h = 0.35 if stage == "mid" else 0.62
    col = {"maize": LEAF, "spinach": SPIN, "tomato": LEAF_D, "aloe": ALOE}[crop]
    for i in range(6):
        x = -0.45 + (i % 3) * 0.45
        y = -0.28 + (i // 3) * 0.5
        cyl((x, y, 0.4 + h * 0.35), 0.035, h, LEAF_D)
        uv((x, y, 0.45 + h), 0.16 if stage == "mid" else 0.22, col, (1, 1, 0.7))
    if stage == "ready" and crop == "maize":
        for i in range(4):
            cyl((-0.42 + i * 0.28, -0.05, 1.05), 0.09, 0.42, MAIZE, rot=(math.radians(75), 0, 0.2))
    if stage == "ready" and crop == "tomato":
        for i in range(5):
            uv((-0.4 + (i % 3) * 0.35, -0.15 + (i // 3) * 0.3, 0.7), 0.1, TOMATO)
    if stage == "ready" and crop == "spinach":
        for i in range(4):
            cube((-0.4 + i * 0.26, 0, 0.55), (0.18, 0.28, 0.08), SPIN)
    if stage == "ready" and crop == "aloe":
        cone((0, 0, 0.7), 0.28, 0.7, ALOE)
        uv((0, 0, 1.15), 0.1, GOLD)
    shot("bed_" + kind)

def tank():
    cyl((0, 0, 0.85), 0.55, 1.15, TANKC, verts=24)
    cyl((0, 0, 1.45), 0.58, 0.12, TEAL_D, verts=24)
    cyl((0, 0, 0.22), 0.62, 0.16, WOOD, verts=20)
    cyl((0.62, -0.15, 0.55), 0.05, 0.35, WOOD_D, rot=(0, math.radians(90), 0))
    cube((0.78, -0.15, 0.4), (0.08, 0.08, 0.16), GOLD)
    shot("tank")

def workshop():
    cube((0, 0, 0.7), (1.8, 1.6, 1.35), WOOD)
    roof_corrugated(1.5, 2.05, 1.9, ROOF, 6)
    cube((0, -0.82, 0.55), (0.7, 0.08, 0.9), DOOR)
    window(-0.55, -0.82, 0.95)
    cube((0.7, 0.2, 0.35), (0.35, 0.15, 0.12), WOOD_D)
    cyl((0.85, -0.4, 0.5), 0.04, 0.7, WOOD_D, rot=(math.radians(80), 0, 0))
    shot("workshop")

def solar():
    cyl((0, 0, 0.45), 0.06, 0.9, WOOD_D)
    cube((0, -0.15, 1.05), (1.5, 0.9, 0.06), SOLAR)
    cube((0, -0.15, 1.0), (1.55, 0.08, 0.08), WOOD)
    cube((0, 0.15, 1.0), (1.55, 0.08, 0.08), WOOD)
    cube((0, -0.15, 1.08), (0.04, 0.9, 0.02), CREAM)
    cube((-0.4, -0.15, 1.08), (0.04, 0.9, 0.02), CREAM)
    cube((0.4, -0.15, 1.08), (0.04, 0.9, 0.02), CREAM)
    shot("solar")

def jacaranda():
    cyl((0, 0, 0.55), 0.16, 1.1, WOOD_D, verts=10)
    uv((0, 0, 1.55), 0.72, PURPLE, (1.15, 1.15, 0.85))
    uv((-0.48, 0.15, 1.4), 0.42, PURPLE2)
    uv((0.46, -0.12, 1.42), 0.4, PURPLE)
    uv((0.08, 0.38, 1.85), 0.38, PINK, (1, 1, 0.75))
    uv((-0.22, -0.32, 1.35), 0.36, PURPLE2, (1, 1, 0.8))
    uv((0.28, 0.22, 1.95), 0.28, CREAM, (1, 1, 0.6))
    shot("jacaranda", 1.35)

def acacia():
    cyl((0, 0, 0.55), 0.1, 1.1, WOOD, verts=8)
    uv((0, 0, 1.35), 1.05, LEAF, (1.4, 1.4, 0.28))
    uv((0.15, -0.1, 1.48), 0.55, LEAF_D, (1.2, 1.2, 0.25))
    shot("acacia")

def aloe_plant():
    for i in range(7):
        ang = i / 7 * math.pi * 2
        cone((math.cos(ang) * 0.18, math.sin(ang) * 0.18, 0.35), 0.1, 0.7, ALOE)
    uv((0, 0, 0.85), 0.12, GOLD)
    shot("aloeplant")

def fence():
    for i in range(3):
        x = -0.7 + i * 0.7
        cube((x, 0, 0.38), (0.08, 0.08, 0.76), WOOD)
    cube((0, 0, 0.48), (1.6, 0.05, 0.06), WOOD_D)
    cube((0, 0, 0.28), (1.6, 0.05, 0.06), WOOD_D)
    shot("fence")

def person(frame, shirt):
    swing = (frame - 1.5) * 0.28
    cyl((0, 0, 0.72), 0.26, 0.62, shirt, verts=12)
    cube((0, 0, 0.38), (0.42, 0.28, 0.28), TEAL if frame % 2 == 0 else GOLD)
    uv((0, 0, 1.22), 0.24, SKIN)
    uv((0, 0, 1.42), 0.28, shirt, (1.2, 1.2, 0.32))
    cyl((-0.14, swing, 0.28), 0.07, 0.48, SKIN, verts=8)
    cyl((0.14, -swing, 0.28), 0.07, 0.48, SKIN, verts=8)
    cyl((-0.32, 0.04, 0.78), 0.055, 0.4, SKIN, rot=(0, math.radians(75), 0), verts=8)
    shot("person" + str(frame), 0.85)

def hen(frame):
    bob = 0.06 if frame else 0
    uv((0, 0, 0.32 + bob), 0.28, HEN, (1.35, 1, 0.85))
    uv((0.18, -0.16, 0.4 + bob), 0.12, HEN)
    cone((0.32, -0.22, 0.42 + bob), 0.06, 0.14, GOLD)
    cyl((-0.08, 0.1, 0.1), 0.03, 0.16, WOOD_D)
    cyl((0.1, 0.1, 0.1), 0.03, 0.16, WOOD_D)
    shot("hen" + str(frame), 0.55)

def dog(frame):
    wag = 0.2 if frame else -0.15
    cube((0, 0, 0.28), (0.72, 0.28, 0.28), DOG)
    uv((0.32, -0.02, 0.42), 0.16, DOG)
    uv((0.4, -0.08, 0.4), 0.05, WOOD_D)
    cyl((-0.36, 0.06, 0.42), 0.035, 0.28, DOG, rot=(0, math.radians(55 + wag * 30), 0), verts=6)
    shot("dog" + str(frame), 0.6)

def neighbour():
    # A small house used along the horizon, same angle.
    cube((0, 0, 0.6), (1.6, 1.4, 1.15), PLASTER)
    roof_corrugated(1.25, 1.85, 1.7, ROOF, 5)
    cube((0.3, -0.72, 0.45), (0.35, 0.08, 0.7), TEAL)
    window(-0.35, -0.72, 0.7)
    shot("neighbour")

if os.environ.get("KHAYA_ONLY") == "life":
    for i in range(4):
        person(i, SHIRT if i % 2 == 0 else SHIRT2)
    hen(0)
    hen(1)
    dog(0)
    dog(1)
else:
    home(1)
    home(2)
    home(3)
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
    neighbour()
    for i in range(4):
        person(i, SHIRT if i % 2 == 0 else SHIRT2)
    hen(0)
    hen(1)
    dog(0)
    dog(1)
print("DONE")
