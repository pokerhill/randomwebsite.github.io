const fs = require('fs');
const THREE = require('three');

const buf = fs.readFileSync('src/assets/models/ora_a1.bin');
const headerLen = buf.readUInt32LE(0);
const header = JSON.parse(buf.slice(4, 4 + headerLen).toString('utf8'));

function computeFK(pose) {
  let mat = new THREE.Matrix4();
  for (let i = 0; i < header.joints.length; i++) {
    const j = header.joints[i];
    const tr = new THREE.Matrix4().makeTranslation(j.xyz[0], j.xyz[1], j.xyz[2]);
    const eu = new THREE.Euler(j.rpy[0], j.rpy[1], j.rpy[2], 'ZYX');
    const rot = new THREE.Matrix4().makeRotationFromEuler(eu);
    const axis = new THREE.Vector3(j.axis[0], j.axis[1], j.axis[2]);
    const jointRot = new THREE.Matrix4().makeRotationAxis(axis, pose[i] || 0);
    mat.multiply(tr).multiply(rot).multiply(jointRot);
  }
  const pos = new THREE.Vector3().setFromMatrixPosition(mat);
  return pos;
}

console.log("Zero pose:");
console.log(computeFK([0,0,0,0,0,0,0]));

// Let's test a few simple bends
console.log("Bend joint 2 by 0.5:");
console.log(computeFK([0, 0.5, 0, 0, 0, 0, 0]));

console.log("Bend joint 2 by -0.5:");
console.log(computeFK([0, -0.5, 0, 0, 0, 0, 0]));

console.log("Bend joint 4 by 0.5:");
console.log(computeFK([0, 0, 0, 0.5, 0, 0, 0]));

console.log("Bend joint 4 by -0.5:");
console.log(computeFK([0, 0, 0, -0.5, 0, 0, 0]));

console.log("Bend joint 6 by 0.5:");
console.log(computeFK([0, 0, 0, 0, 0, 0.5, 0]));

console.log("Bend joint 6 by -0.5:");
console.log(computeFK([0, 0, 0, 0, 0, -0.5, 0]));

console.log("Old ORA-T0 END POSE applied to A1:");
console.log(computeFK([0.0, 0.32, 0.0, -0.55, 0.0, 0.23, 0]));

console.log("My inverted pitch END POSE:");
console.log(computeFK([0.0, -0.32, 0.0, 0.55, 0.0, -0.23, 0]));

