/* Build-time robot pipeline: a URDF + its STLs (~20MB) → one compact binary the
   site ships (src/assets/models/<robot>.bin), holding BOTH the kinematic chain
   and the link meshes. MissionCapture3D.js reads the chain from this file, so
   swapping in a new arm means dropping its folder under robots/ and re-running
   this script — no joint tables to hand-copy.

   Per link: parse binary STL → weld duplicate vertices → meshopt simplify →
   int16-quantize positions against the link bbox. Normals are recomputed at
   runtime.

   Usage: node scripts/build-ora-model.js [robotName]   (default: ORA-T0) */
const fs = require('fs');
const path = require('path');

const ROBOT = process.argv[2] || 'ORA-T0';
const ROBOT_DIR = path.join(__dirname, '..', 'robots', ROBOT);
const MESH_DIR = path.join(ROBOT_DIR, 'meshes');
const OUT = path.join(__dirname, '..', 'src', 'assets', 'models', `${ROBOT.toLowerCase()}.bin`);
const TARGET_RATIO = 0.02; // keep ~2% of triangles to fit in uint16
const TARGET_ERROR = 0.01;

// Minimal URDF reader: enough for SolidWorks-exported serial chains. Pulls the
// joint list (origin xyz/rpy + axis, in parent→child order from the root) and
// the visual mesh basename per link.
const parseUrdf = (xml) => {
  const attr = (tag, name) => {
    const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`));
    return m ? m[1] : null;
  };
  const nums = (s, fallback) => (s ? s.trim().split(/\s+/).map(Number) : fallback);

  // link name → visual mesh basename (links with no visual, e.g. a tool frame,
  // map to null and simply render nothing).
  const meshes = {};
  for (const block of xml.split(/<link\b/).slice(1)) {
    const name = attr(block.slice(0, block.indexOf('>') + 1), 'name');
    const body = block.split(/<\/link>/)[0];
    const visual = body.split(/<visual>/)[1]?.split(/<\/visual>/)[0];
    const file = visual?.match(/filename\s*=\s*"([^"]*)"/)?.[1];
    meshes[name] = file ? path.basename(file).replace(/\.stl$/i, '') : null;
  }

  const joints = [];
  for (const block of xml.split(/<joint\b/).slice(1)) {
    const head = block.slice(0, block.indexOf('>') + 1);
    const body = block.split(/<\/joint>/)[0];
    const origin = body.match(/<origin[^>]*>/)?.[0] || '';
    joints.push({
      name: attr(head, 'name'),
      parent: attr(body.match(/<parent[^>]*>/)?.[0] || '', 'link'),
      child: attr(body.match(/<child[^>]*>/)?.[0] || '', 'link'),
      xyz: nums(attr(origin, 'xyz'), [0, 0, 0]),
      rpy: nums(attr(origin, 'rpy'), [0, 0, 0]),
      axis: nums(attr(body.match(/<axis[^>]*>/)?.[0] || '', 'xyz'), [1, 0, 0]),
    });
  }

  // Order joints root→tip. The root link is the one that is never a child.
  const children = new Set(joints.map((j) => j.child));
  const root = joints.map((j) => j.parent).find((p) => !children.has(p));
  const byParent = new Map(joints.map((j) => [j.parent, j]));
  const chain = [];
  for (let link = root; byParent.has(link); ) {
    const j = byParent.get(link);
    chain.push({ ...j, mesh: meshes[j.child] });
    link = j.child;
  }
  return { root, rootMesh: meshes[root], chain };
};

const urdfPath = fs
  .readdirSync(ROBOT_DIR)
  .filter((f) => f.toLowerCase().endsWith('.urdf'))
  .map((f) => path.join(ROBOT_DIR, f))[0];
if (!urdfPath) throw new Error(`no .urdf found in ${ROBOT_DIR}`);
const robot = parseUrdf(fs.readFileSync(urdfPath, 'utf8'));
// Links that actually have geometry to bake (root + every child with a mesh).
const LINKS = [robot.rootMesh, ...robot.chain.map((j) => j.mesh)].filter(Boolean);

const parseStl = (buf) => {
  const triCount = buf.readUInt32LE(80);
  const pos = new Float32Array(triCount * 9);
  for (let i = 0; i < triCount; i++) {
    const o = 84 + i * 50 + 12; // skip normal
    for (let v = 0; v < 9; v++) pos[i * 9 + v] = buf.readFloatLE(o + v * 4);
  }
  return pos;
};

const weld = (pos) => {
  const map = new Map();
  const verts = [];
  const indices = new Uint32Array(pos.length / 3);
  for (let i = 0; i < pos.length / 3; i++) {
    const key = `${Math.round(pos[i * 3] * 1e5)},${Math.round(pos[i * 3 + 1] * 1e5)},${Math.round(pos[i * 3 + 2] * 1e5)}`;
    let idx = map.get(key);
    if (idx === undefined) {
      idx = verts.length / 3;
      map.set(key, idx);
      verts.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    }
    indices[i] = idx;
  }
  return { positions: new Float32Array(verts), indices };
};

(async () => {
  const { MeshoptSimplifier } = await import('meshoptimizer');
  await MeshoptSimplifier.ready;
  // The chain travels with the meshes: name/xyz/rpy/axis per joint, plus which
  // link mesh (if any) rides on it. The renderer needs nothing else to rig it.
  const header = {
    robot: ROBOT,
    rootMesh: robot.rootMesh,
    joints: robot.chain.map((j) => ({ name: j.name, xyz: j.xyz, rpy: j.rpy, axis: j.axis, mesh: j.mesh })),
    links: [],
  };
  const payloads = [];
  let offset = 0;

  for (const name of LINKS) {
    const raw = parseStl(fs.readFileSync(path.join(MESH_DIR, `${name}.STL`)));
    const { positions, indices } = weld(raw);
    const targetCount = Math.max(1500, Math.floor((indices.length * TARGET_RATIO) / 3) * 3);
    const [simplified] = MeshoptSimplifier.simplify(indices, positions, 3, targetCount, TARGET_ERROR, []);

    // Re-index to only the vertices the simplified mesh still uses.
    const remap = new Map();
    const outVerts = [];
    const outIdx = new Uint16Array(simplified.length);
    simplified.forEach((vi, i) => {
      let ni = remap.get(vi);
      if (ni === undefined) {
        ni = outVerts.length / 3;
        remap.set(vi, ni);
        outVerts.push(positions[vi * 3], positions[vi * 3 + 1], positions[vi * 3 + 2]);
      }
      outIdx[i] = ni;
    });
    if (outVerts.length / 3 > 65535) throw new Error(`${name}: too many verts for uint16`);

    // Quantize positions to int16 across the link bbox.
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < outVerts.length; i += 3)
      for (let a = 0; a < 3; a++) {
        min[a] = Math.min(min[a], outVerts[i + a]);
        max[a] = Math.max(max[a], outVerts[i + a]);
      }
    const scale = max.map((m, a) => (m - min[a]) / 65535 || 1);
    const q = new Int16Array(outVerts.length);
    for (let i = 0; i < outVerts.length; i += 3)
      for (let a = 0; a < 3; a++) q[i + a] = Math.round((outVerts[i + a] - min[a]) / scale[a]) - 32768;

    const posBytes = Buffer.from(q.buffer);
    const idxBytes = Buffer.from(outIdx.buffer);
    header.links.push({
      name,
      vertCount: outVerts.length / 3,
      triCount: outIdx.length / 3,
      min,
      scale,
      posOffset: offset,
      idxOffset: offset + posBytes.length,
    });
    offset += posBytes.length + idxBytes.length;
    payloads.push(posBytes, idxBytes);
    console.log(`${name}: ${indices.length / 3} → ${outIdx.length / 3} tris, ${outVerts.length / 3} verts`);
  }

  // Pad the JSON header to a 4-byte boundary so typed-array views over the
  // payload stay aligned.
  let json = JSON.stringify(header);
  while ((json.length + 4) % 4 !== 0) json += ' ';
  const headerBuf = Buffer.from(json);
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32LE(headerBuf.length);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.concat([lenBuf, headerBuf, ...payloads]));
  console.log(`chain: ${header.joints.map((j) => j.name).join(' → ')}`);
  console.log(`wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
})();
