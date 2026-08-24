// Production stub — DO NOT import three.js or MissionCapture3D here.
//
// The live WebGL capture scene (MissionCapture3D) renders the real ORA flight
// CAD. Shipping it would publish the arm's kinematics + meshes as static assets
// on a public GitHub Pages site, so a normal build must NOT bundle it. This stub
// imports nothing, guaranteeing three.js and ora-t0.bin stay out of the shipped
// bundle regardless of webpack dead-code analysis.
//
// scripts/render-capture-frames.js temporarily replaces this file with a
// re-export of MissionCapture3D, builds with REACT_APP_RENDER3D=1 to screenshot
// the live scene into src/assets/capture/, then restores this stub. The site
// only ever ships those frames.
export default null;
