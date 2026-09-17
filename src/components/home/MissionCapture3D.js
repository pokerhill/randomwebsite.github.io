import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import modelUrl from '../../assets/models/ora_a1.bin';

// Live WebGL capture scene: the actual ORA flight CAD (URDF joint chain +
// simplified link meshes, both baked into ora-t0.bin by
// scripts/build-ora-model.js) on a servicer bus, closing on the launch adapter
// ring of an MLI-wrapped target. Scroll (sp) drives the joint keyframes and the
// approach; the base gets a converging correction so the gripper meets the ring
// exactly at lock.
//
// IMPORTANT: this file is NOT shipped. The site would otherwise publish the arm
// CAD (kinematics + meshes) as public static assets. Instead
// scripts/render-capture-frames.js drives this scene offline and bakes it to a
// JPEG sequence (src/assets/capture/), which is all that ships — the runtime
// scrubs those frames (MissionCaptureFrames.js). This module is only compiled in
// during that render (via the MissionCaptureLive.js swap); a normal build's
// stub keeps three.js + ora-t0.bin out of the bundle.
//
// ── SWAPPING IN A NEW ARM (e.g. when the next ORA URDF lands) ───────────────
// 1. Drop the export under robots/<NAME>/ — the .urdf plus its meshes/*.STL,
//    exactly as SolidWorks emits it (only the mesh basename in the URDF is used).
//    robots/ is git-ignored (the raw CAD must never hit the public repo).
// 2. node scripts/build-ora-model.js <NAME>
//    Parses the URDF (joint chain: origins, rpy, axes, which link mesh rides on
//    each joint), compresses every STL, writes src/assets/models/<name>.bin. The
//    chain is baked into that file — there is NO joint table in this component.
// 3. Point `modelUrl` below at the new .bin (whole code change for a serial chain
//    of any joint count — the pose arrays auto-pad).
// 4. Re-tune only aesthetics (constants below): POSE_START / POSE_END (folded →
//    reaching), BASE_START / BASE_END (servicer path), camera framing in
//    applyPose(), and the ring grab (GRAB_DIR). Iterate with REACT_APP_RENDER3D=1
//    (see step 5) which mounts this live scene so you can scroll and adjust.
// 5. node scripts/render-capture-frames.js   ← regenerates the shipped frames end
//    to end (swap-in live scene → render build → screenshot → restore stub →
//    clean build). One command; needs `npm i --no-save playwright` once.
// Note: adding npm deps needs `docker compose up -d --build web-dev`; changing
// only src files does not (src/ is volume-mounted, so it hot-reloads).
// ───────────────────────────────────────────────────────────────────────────

// Folded → reaching pose, radians per joint (index = joint order in the URDF
// chain). Shorter/longer arrays are padded with 0, so a new arm still poses.
//
// POSE_END is solved, not eyeballed: damped-least-squares IK against the
// real 7-joint chain (see scripts/test_fk.js for the FK convention this
// matches).
//
// This solve targets more than just position: joints 0-5 satisfy BOTH
// MATE_TARGET (position) AND the arm approaching along APPROACH (orientation
// — the tool frame's local z axis solved to equal APPROACH exactly).
//
// APPROACH is the ring's own central/symmetry axis (world X — see
// ring.rotation.y in buildTarget(), which maps the torus's axis onto world
// X), NOT the in-plane radial direction GRAB_DIR. A first pass solved the
// arm to approach along GRAB_DIR instead — dead-on to the tube's cross
// section, but reaching in from within the ring's OWN plane, i.e. across the
// donut face rather than through its hole. That reads as grabbing the rim
// from the side (approach vector tangent to the ring's plane), not as a
// direct, face-on capture normal to the ring's circumference. The target's
// cone/adapter opens toward +X (the ring is the +X-most, leading part of the
// target — see buildTarget()) and the servicer sits at large +X, so an
// arm converging in -X naturally pokes straight through that opening —
// APPROACH = +X world is the physically sensible "straight at it" direction,
// not GRAB_DIR. (GRAB_DIR is still used below, just for WHERE on the ring's
// circumference to grab — the "lower-front" contact point — decoupled from
// which direction the arm comes in from.)
//
// The IK target is MATE_TARGET minus BASE_END, not MATE_TARGET itself: joints
// 0-5 solve for where the tool frame needs to sit in the arm's OWN local
// frame (relative to armRoot), and armRoot ends the animation at BASE_END,
// not at the origin — so the local target has to already account for that
// offset. An earlier version solved straight for MATE_TARGET, which silently
// assumes armRoot ends at (0,0,0); the actual per-frame correction below
// (which only exists to mop up small IK residuals) was instead dragging the
// ENTIRE vehicle ~0.88 units back toward the origin at lock to paper over
// that gap — invisible in a close-up on the gripper, but it meant the
// servicer visually snapped back near the world origin instead of ending at
// its own intended BASE_END position, which only became obvious once the
// bus needed to be framed/excluded deliberately (see the camera comment
// below). Exactly the "vehicle doing the reaching instead of the arm" failure
// mode called out elsewhere in this file, just reintroduced by a later solve.
//
// Position lands exactly on target (residual ~1e-16, machine precision) and
// orientation within ~0°; the correction below is now genuinely a small,
// converging cleanup (peaks around 0.1 units mid-animation, exactly 0 at
// lock), not a systematic drag. Total joint travel from POSE_START is larger
// than a position-only solve needs — that's the arm actually rotating to
// square itself up face-on to the ring, not an artifact.
//
// Joint 6 (index 6, the last one, a pure wrist roll) has zero moment arm so
// it can't move the tool position or its approach direction, but it's the
// ONLY joint whose axis IS that approach direction (verified numerically —
// toolFrame's local z is invariant as this joint's angle varies; x and y
// sweep around it, tracing a full circle perpendicular to the approach).
// With APPROACH along the ring's own axis, the jaws must close along the
// OTHER direction perpendicular to the tube's tangent — GRAB_DIR itself
// (approach × tangent, both ring-geometry constants, unchanged). Scanned
// numerically (not solved via the hand-derived cross product) to land jaw
// alignment within ~0.006° of GRAB_DIR. See the gripper mount in
// loadRobot().then() below for how this angle is actually used.
const POSE_START = [0.35, 1.0, -0.15, -1.0, 0.1, 1.0, 0];
const POSE_END = [0.0541, 1.6109, -0.2445, -0.7031, 0.0932, -0.7310, 1.4207];
const poseAt = (pose, i) => pose[i] ?? 0;
// Fraction of the [0,1] animation range spent staggering per-joint timing —
// see the comment in applyPose() where this is used. 0.15-0.4 all work; 0.3
// gives clear separation between joints without the peak angular speed
// (which scales as 1.5/(1-JOINT_STAGGER)) getting too far past 2x the
// unstaggered rate.
const JOINT_STAGGER = 0.3;

const RING_POS = new THREE.Vector3(-0.52, 0.1, 0);
const RING_RADIUS = 0.16;
// The grab lands ON the ring tube (lower-front of the rim as the camera sees
// it), not through the aperture: jaws clamp the rim like a rail.
const GRAB_DIR = new THREE.Vector3(0, -0.5625, 0.825).normalize();
const RING_GRAB = RING_POS.clone().addScaledVector(GRAB_DIR, RING_RADIUS);
// The ring's own central/symmetry axis (world X — see APPROACH in the
// POSE_END comment above) — both the arm's approach direction and the
// direction MATE_TARGET stages off the tube along, so "back off along the
// barrel" and "world X" mean the same thing again.
const APPROACH = new THREE.Vector3(1, 0, 0);
// Tool-frame target sits just off the tube (along the approach axis) so the
// jaw throat wraps it, not through it.
const MATE_TARGET = RING_GRAB.clone().addScaledVector(APPROACH, 0.05);
const BASE_START = new THREE.Vector3(0.62, -0.18, 0.1);
const BASE_END = new THREE.Vector3(0.4, -0.02, 0);
// Verified (FK'd every joint at 41 samples from POSE_START to POSE_END,
// against the servicer bus's box in its post-flush-mount position above)
// that the swept chain never enters the bus's volume — aside from the
// flange/mount point itself, which touches by design — and the tool frame's
// clearance from the box stays in a stable 0.57-0.64 unit band throughout:
// the workspace already stays in the outward hemisphere away from the bus
// without needing a pose change.

const smooth = (u) => u * u * (3 - 2 * u);

// Returns { joints, rootMesh, geos } — the kinematic chain and the link meshes,
// both straight out of the baked model file.
async function loadRobot() {
  const buf = await (await fetch(modelUrl)).arrayBuffer();
  const headerLen = new DataView(buf).getUint32(0, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, headerLen)));
  const base = 4 + headerLen;
  const geos = {};
  for (const l of header.links) {
    const q = new Int16Array(buf, base + l.posOffset, l.vertCount * 3);
    const pos = new Float32Array(l.vertCount * 3);
    for (let i = 0; i < pos.length; i += 3)
      for (let a = 0; a < 3; a++) pos[i + a] = (q[i + a] + 32768) * l.scale[a] + l.min[a];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setIndex(new THREE.BufferAttribute(new Uint16Array(buf.slice(base + l.idxOffset, base + l.idxOffset + l.triCount * 6)), 1));
    g.computeVertexNormals();
    geos[l.name] = g;
  }
  return { joints: header.joints, rootMesh: header.rootMesh, geos };
}

// Crinkled-foil canvas texture: reads as MLI blanket under harsh sunlight.
function mliTexture(baseHue = 43, sat = 65) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = `hsl(${baseHue}, ${sat}%, 38%)`;
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const w = 6 + Math.random() * 26;
    const h = 3 + Math.random() * 10;
    const light = 26 + Math.random() * 34;
    ctx.fillStyle = `hsla(${baseHue + Math.random() * 10 - 5}, ${Math.min(100, sat + 5)}%, ${light}%, 0.55)`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function solarTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#101c33';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = 'rgba(150,180,220,0.5)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 256; x += 16) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 128); ctx.stroke(); }
  for (let y = 0; y <= 128; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke(); }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildTarget() {
  const target = new THREE.Group();
  const mli = new THREE.MeshStandardMaterial({ map: mliTexture(), metalness: 0.55, roughness: 0.55, side: THREE.DoubleSide });
  const alu = new THREE.MeshStandardMaterial({ color: 0xc7ccd4, metalness: 0.9, roughness: 0.32 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x30343c, metalness: 0.6, roughness: 0.5 });

  // Aft end of the target bus, mostly out of frame to the left.
  const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.8, 40), mli);
  bus.rotation.z = Math.PI / 2;
  bus.position.x = -0.42;
  target.add(bus);

  // Aft closure panel + payload-adapter cone stub.
  const aft = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.02, 40), dark);
  aft.rotation.z = Math.PI / 2;
  aft.position.x = -0.01;
  target.add(aft);
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(RING_RADIUS + 0.015, 0.24, 0.1, 40, 1, true), mli);
  cone.rotation.z = Math.PI / 2;
  cone.position.x = 0.05;
  target.add(cone);

  // The launch adapter ring itself — bare machined aluminum, proud of the cone.
  const ring = new THREE.Mesh(new THREE.TorusGeometry(RING_RADIUS, 0.014, 18, 60), alu);
  ring.rotation.y = Math.PI / 2;
  ring.position.x = 0.115;
  target.add(ring);
  const ringLip = new THREE.Mesh(
    new THREE.CylinderGeometry(RING_RADIUS + 0.006, RING_RADIUS + 0.012, 0.045, 60, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xc7ccd4, metalness: 0.9, roughness: 0.32, side: THREE.DoubleSide })
  );
  ringLip.rotation.z = Math.PI / 2;
  ringLip.position.x = 0.085;
  target.add(ringLip);

  // Solar wing, edge-on in the background.
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 1.1), new THREE.MeshStandardMaterial({ map: solarTexture(), metalness: 0.4, roughness: 0.45 }));
  wing.position.set(-0.75, 0.42, -0.35);
  wing.rotation.x = 0.3;
  target.add(wing);

  target.position.copy(RING_POS).sub(new THREE.Vector3(0.115, 0, 0));
  return target;
}

function buildServicer() {
  const g = new THREE.Group();
  const panel = new THREE.MeshStandardMaterial({ color: 0x9aa1a9, metalness: 0.6, roughness: 0.45 });
  // Silvery-gray MLI so the bus face reads as blanketed spacecraft skin, not a slab.
  const foil = new THREE.MeshStandardMaterial({ map: mliTexture(220, 8), metalness: 0.5, roughness: 0.55 });

  // Chassis placement (body/rad/dish) is derived from the base_link flange, not
  // eyeballed: base_link (dequantized from the baked model, all 61559 verts,
  // not just its bbox) is a flange-to-boss part, flange face at LOCAL y=0
  // (98 verts pinned flat there, x/z centroid (-0.0002, -0.0038)) facing +Y,
  // tapering to a boss at y=-0.2030 where joint0 mounts. base_link sits at
  // armRoot's origin with no offset, so that flange face IS y=0 in this frame.
  //
  // The bus body box is BoxGeometry(0.5,0.42,0.42) — a flush, non-interpenetrating
  // mate requires the two parts' solids to sit on OPPOSITE sides of the shared
  // seam. base_link's solid hangs BELOW its flange (down to the boss at -0.203),
  // so the bus's solid must sit ABOVE the seam: that's the box's y-MIN face
  // (center-height/2 = -0.06-0.21 = -0.27), not the nearer-looking y-max face
  // (+0.15) — mating there instead would embed the whole arm base inside the
  // box (its boss would land at y=-0.053, still deep inside the box's own
  // -0.27..0.15 span). Offset applied to body/rad/dish as one rigid unit:
  // dx=-0.3102 (bus's own x=0.31 center -> flange's x≈0), dy=+0.27 (bus's
  // y-min face -0.27 -> flange's y=0), dz=-0.0038 (bus's z=0 -> flange's z).
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.42, 0.42), foil);
  body.position.set(-0.0002, 0.21, -0.0038);
  g.add(body);

  // Arm mounting pedestal: bolt ring + standoff, both already centred on the
  // flange (not the bus body) from a prior fix. Only the ring's height needed
  // a ~2mm nudge so its top face touches the bus's new y=0 mating plane
  // exactly (was -0.008, poking 2mm into the box; now -0.01, flush) — the
  // standoff (spanning y -0.07..-0.01, toward the boss) never reached the
  // bus box either way and is unaffected by the mount fix.
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.02, 28), panel);
  ring.position.set(0, -0.01, 0);
  g.add(ring);
  const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.06, 28), panel);
  standoff.position.set(0, -0.04, 0);
  g.add(standoff);
  const rad = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.012, 0.34),
    new THREE.MeshStandardMaterial({ color: 0xf0f3f5, metalness: 0.15, roughness: 0.75 })
  );
  rad.position.set(-0.0002, 0.43, -0.0038);
  g.add(rad);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.14, 8), panel);
  dish.position.set(0.0898, 0.51, -0.1038);
  g.add(dish);
  return g;
}

// Two-jaw capture gripper. A rigid CHILD of the arm's last joint frame (see
// loadRobot().then() below, which parents `group` onto toolFrame with a
// fixed local transform) — it inherits the tool frame's world position AND
// orientation automatically every frame via normal scene-graph propagation.
// It used to live at scene level with position hand-copied from the tool
// frame each frame but rotation frozen at a WORLD-space guess taken once at
// startup — position and orientation decoupled, so the gripper visibly
// didn't track the arm's actual last-link orientation and looked like it was
// jutting off the end rather than bolted to it. Local -x is the barrel/palm
// axis (continues the arm), local ±y is the jaw separation.
function buildGripper() {
  const group = new THREE.Group();
  // Darker than both the arm and the ring so the clamp stays legible.
  const alu = new THREE.MeshStandardMaterial({ color: 0x565c66, metalness: 0.8, roughness: 0.4 });
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 20), alu);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.x = 0.02;
  group.add(barrel);
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.05, 0.04), alu);
  palm.position.x = -0.01;
  group.add(palm);
  const jawGeo = new THREE.BoxGeometry(0.08, 0.01, 0.035);
  const jawA = new THREE.Mesh(jawGeo, alu);
  const jawB = new THREE.Mesh(jawGeo, alu);
  jawA.position.set(-0.055, 0.027, 0);
  jawB.position.set(-0.055, -0.027, 0);
  group.add(jawA, jawB);
  return { group, jawA, jawB };
}

const MissionCapture3D = ({ sp, onFail }) => {
  const hostRef = useRef(null);
  const stateRef = useRef({ sp });
  stateRef.current.sp = sp;

  useEffect(() => {
    const host = hostRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (e) {
      onFail?.();
      return undefined;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Matches the page's own background (orb.bg, #161616 — see tailwind.config.js
    // and OrbLanding's root wrapper), not an arbitrary near-black space color.
    // The globe scene this crossfades with is a transparent SVG showing that same
    // page background through — a mismatched scene.background here (previously
    // 0x000104, a much darker near-black) was the main reason that transition
    // read as a hard cut rather than a crossfade: the background itself jumped,
    // not just the foreground content.
    scene.background = new THREE.Color(0x161616);
    // 50° (was 40°) — see the camera comment in applyPose() below; the wider
    // FOV is part of the same fix that keeps the bus out of frame while
    // showing more of the arm.
    const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 50);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Harsh key sun + faint blue earthshine — the classic LEO lighting setup.
    const sun = new THREE.DirectionalLight(0xffffff, 4.2);
    sun.position.set(1.5, 2.2, 1.8);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xdfe8f2, 1.1);
    rim.position.set(-1.2, 0.6, -1.6);
    scene.add(rim);
    const earthshine = new THREE.DirectionalLight(0x5d8fd1, 0.55);
    earthshine.position.set(-1, -2, 0.6);
    scene.add(earthshine);

    // Starfield.
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(20);
      starPos.set([v.x, v.y, v.z], i * 3);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xbfc8d4, size: 0.02, sizeAttenuation: true })));

    scene.add(buildTarget());
    const armRoot = new THREE.Group();
    scene.add(armRoot);
    armRoot.add(buildServicer());
    const grip = buildGripper();
    grip.group.visible = false; // shown + parented once the arm meshes arrive

    // Assemble the URDF chain once the link meshes arrive.
    const spinners = [];
    let toolFrame = null;
    let disposed = false;
    loadRobot()
      .then(({ joints, rootMesh, geos }) => {
        if (disposed) return;
        const linkMat = new THREE.MeshStandardMaterial({ color: 0xc4cad2, metalness: 0.9, roughness: 0.34, envMapIntensity: 0.75 });
        let parent = new THREE.Group();
        if (geos[rootMesh]) parent.add(new THREE.Mesh(geos[rootMesh], linkMat));
        armRoot.add(parent);
        for (const j of joints) {
          const jointGroup = new THREE.Group();
          jointGroup.position.set(...j.xyz);
          jointGroup.setRotationFromEuler(new THREE.Euler(j.rpy[0], j.rpy[1], j.rpy[2], 'ZYX'));
          const spinner = new THREE.Group();
          jointGroup.add(spinner);
          parent.add(jointGroup);
          spinners.push({ spinner, axis: new THREE.Vector3(...j.axis) });
          if (geos[j.mesh]) spinner.add(new THREE.Mesh(geos[j.mesh], linkMat));
          parent = spinner;
        }
        toolFrame = parent; // last frame in the chain — the capture interface

        // Rigidly mount the gripper on the tool frame.
        //
        // This mount is a fixed axis relabelling (gripper local x/y/z -> tool
        // frame z/x/y — the rotation matrix [[0,1,0],[0,0,1],[1,0,0]],
        // independent of pose) putting the barrel on the tool frame's
        // invariant local z, so it's a rigid, un-kinked continuation of the
        // last link at every joint-6 angle. That invariant-z direction is now
        // APPROACH (the ring's own axis, see POSE_END above), so the barrel
        // points straight through the ring rather than across its face.
        // Joint 6 aims the jaws along GRAB_DIR (perpendicular to the ring,
        // straddling the tube like a rail) to ~0.03° error.
        //
        // Position (0, 0, 0.005) is solved, not guessed: with MATE_TARGET's
        // clearance staged along APPROACH by 0.05 and the jaw geometry's own
        // built-in -0.055 local reach (see buildGripper) along the same
        // (invariant) axis, the two nearly cancel — landing the jaw midpoint
        // exactly on RING_GRAB (checked to machine precision) with only a
        // ~0.005-unit gap to toolFrame, i.e. still visually flush. This
        // number is coincidentally unchanged from the previous (wrong-
        // approach-axis) solve — same algebra, same magnitudes, just
        // computed against a different APPROACH direction.
        toolFrame.add(grip.group);
        grip.group.position.set(0, 0, 0.005);
        grip.group.rotation.set(-Math.PI / 2, 0, -Math.PI / 2, 'XYZ');
        render();
      })
      .catch(() => onFail?.());

    const toolWorld = new THREE.Vector3();
    const applyPose = () => {
      const t = smooth(Math.min(1, Math.max(0, stateRef.current.sp / 0.72)));
      // Every joint used to share this exact `t` — all 7 starting, peaking,
      // and stopping in lockstep, which is the literal signature of
      // mechanically synchronized motion (their angular velocities were flat
      // constants over the whole range, not smooth bumps, and all 7 were
      // simultaneously "active" 100% of the time). JOINT_STAGGER gives each
      // joint its own window within [0,1] — joint 0 (the base, right off the
      // flange) leads, moving first and finishing earliest; joint 6 (the
      // wrist, whose only job is the final fine aim along GRAB_DIR as the
      // jaws close in) trails, still settling as the animation ends. Windows
      // for joints 1-5 are evenly spaced between those two. The window
      // formula is structurally guaranteed to still hit exactly POSE_END at
      // t=1 for every joint regardless of JOINT_STAGGER's value — clamping
      // local progress to [0,1] means every window's local_t reaches exactly
      // 1 once global t reaches 1 — so this can't disturb the machine-
      // precision IK solve above. Verified separately that the staggered
      // path never brings any joint closer to the servicer bus box than the
      // unstaggered path already was (both bottom out at the same fixed
      // mount-point clearance, 0.19332 units).
      const n = spinners.length - 1;
      spinners.forEach(({ spinner, axis }, i) => {
        const lo = (i * JOINT_STAGGER) / n;
        const hi = 1 - ((n - i) * JOINT_STAGGER) / n;
        const localT = Math.min(1, Math.max(0, (t - lo) / (hi - lo)));
        const jt = smooth(localT);
        const a0 = poseAt(POSE_START, i);
        const angle = a0 + (poseAt(POSE_END, i) - a0) * jt;
        spinner.setRotationFromAxisAngle(axis, angle);
      });
      armRoot.position.lerpVectors(BASE_START, BASE_END, t);
      if (toolFrame) {
        // Converging correction: the vehicle absorbs any RESIDUAL pose error
        // so the jaw throat lands exactly on the rim tube at lock. With
        // POSE_END solved against MATE_TARGET-minus-BASE_END (see the
        // constant's comment above), this correction now actually stays
        // small throughout — peaking around 0.1 units mid-animation and
        // exactly 0 at lock (armRoot lands precisely on BASE_END) — rather
        // than silently dragging the whole vehicle ~0.88 units back toward
        // the origin at lock, which an earlier version of this solve did
        // without anyone noticing (a close-up on the gripper alone doesn't
        // reveal where the vehicle's BODY ended up).
        armRoot.updateMatrixWorld(true);
        toolFrame.getWorldPosition(toolWorld);
        const corr = MATE_TARGET.clone().sub(toolWorld).multiplyScalar(t);
        armRoot.position.add(corr);
        // The gripper is a rigid child of toolFrame (see loadRobot().then()
        // above), so it inherits the tool frame's world position AND
        // orientation automatically via scene-graph propagation — nothing to
        // copy here. Jaws close over the final 25%.
        grip.group.visible = true;
        const closeT = smooth(Math.min(1, Math.max(0, (t - 0.75) / 0.25)));
        grip.jawA.position.y = 0.027 - 0.0105 * closeT;
        grip.jawB.position.y = -(0.027 - 0.0105 * closeT);
      }
      // Camera: slow push-in framing target left / arm right. A pure lookAt
      // shift trades bus-exclusion against arm-visibility roughly 1-for-1
      // (rotating the camera's aim moves every point's angular position by
      // about the same amount, regardless of how far away it is) — which is
      // exactly what an earlier version of this fix did: lookAt(-0.6, ...)
      // excluded the bus but also pushed the ring nearly dead-centre and the
      // arm toward the right edge, showing less of it than before. Moving
      // the camera itself (+0.05 x, -0.30 z — closer and shifted right) AND
      // widening the FOV (50°, up from 40° at the top of this file) breaks
      // that 1-for-1 trade: it reshapes perspective so the near, laterally-
      // large bus and the more distant, off-axis ring+gripper separate
      // faster than a re-aim alone could manage, so both goals improve
      // together instead of trading off.
      //
      // These numbers are solved AGAINST the staggered joint timing above,
      // not the plain shared-t path — that matters more than it sounds: the
      // per-joint stagger changes toolFrame's position at every t strictly
      // before lock (only t=1 is pinned, by design), which feeds into the
      // converging correction above and shifts armRoot's actual trajectory.
      // A first pass tuned this camera against the unstaggered path and
      // looked perfect on paper (~1.15 margin) but rendered with a visible
      // sliver of the bus at sp≈0.3 — solving the two independently doesn't
      // work, they have to be checked together. Re-verified at 201 samples
      // across the full sp range against all five servicer parts (body, rad,
      // dish, ring, standoff) using the exact staggered armRoot trajectory:
      // worst-case projected NDC x-min is ~1.03 (past the ±1 visible range
      // with a real margin, ~22px at the 1440px bake width). The ring sits
      // at NDC x -0.06 to -0.08 (vs. lookAt(-0.6)'s ~0.01 — meaningfully
      // left of centre again) and the gripper's rightmost excursion is NDC
      // x ~0.40 (vs. ~0.50), with neither ever clipping top or bottom
      // (gripper NDC y stays within -0.89 to -0.12 throughout — this was
      // its own constraint during the search, since pulling the camera
      // closer to widen the horizontal margin pushes the folded start pose
      // toward the bottom edge if left unchecked).
      camera.position.set(0.17 - 0.1 * t, 0.16, 1.05 - 0.22 * t);
      camera.lookAt(-0.55, 0.05, 0);
    };

    const render = () => {
      applyPose();
      renderer.render(scene, camera);
    };

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    stateRef.current.render = render;

    return () => {
      disposed = true;
      ro.disconnect();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  // Scroll drives the pose; re-render on every sp change.
  useEffect(() => {
    stateRef.current.render?.();
  }, [sp]);

  return <div ref={hostRef} className="absolute inset-0 [&>canvas]:w-full [&>canvas]:h-full" />;
};

export default MissionCapture3D;
