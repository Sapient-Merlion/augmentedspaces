import * as THREE from 'three';

const cameraSpeed = 0.0003;
const lightSpeed = 0.001;
const tubularSegments = 1000;
const radialSegments = 3;
const tubeRadius = 2;
const ambientLight = 0x878787;
const lightColor = 0xffffff;
const lightIntensity = 1;
const lightDistance = 20;
const hs = 200; // Hue-Start
const he = 260; // Hue-End
let w = window.innerWidth;
let h = window.innerHeight;
const p = [
  [389, 246, 0],
  [410, 255, 20],
  [413, 268, 7],
  [431, 261, 12],
  [418, 244, 30],
  [416, 217, 25],
  [420, 205, 8],
  [427, 227, -20],
  [432, 236, 5],
  [444, 228, 12],
  [451, 232, 41],
  [446, 246, 72],
  [443, 264, 96],
  [446, 278, 65],
  [463, 267, 20],
  [460, 258, -10],
  [464, 243, -20],
  [459, 233, 0],
  [475, 225, 22],
  [484, 225, 29],
  [490, 214, 51],
  [476, 202, 55],
  [462, 202, 55],
  [446, 205, 42],
  [440, 192, 42],
  [430, 183, 72],
  [413, 184, 58],
  [406, 191, 32],
  [406, 207, 0],
  [402, 220, 0],
  [390, 222, 20],
  [385, 228, 10],
  [389, 246, 0]
];

const CanvasAnimate = () => {
  window.onresize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  var renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas'),
    antialias: true
  });
  renderer.setSize(w, h);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.001, 1000);

  const starsGeometry = new THREE.Geometry();
  for (let i = 0; i < 3000; i++) {
    const star = new THREE.Vector3();
    star.x = THREE.Math.randFloatSpread(1500);
    star.y = THREE.Math.randFloatSpread(1500);
    star.z = THREE.Math.randFloatSpread(1500);
    starsGeometry.vertices.push(star);
  }
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);

  for (let i = 0; i < p.length; i++) {
    const x = p[i][0];
    const y = p[i][2];
    const z = p[i][1];
    p[i] = new THREE.Vector3(x, y, z);
  }
  const path = new THREE.CatmullRomCurve3(p);
  const geometry = new THREE.TubeGeometry(path, tubularSegments, tubeRadius, radialSegments, true);

  let hue = hs;
  let hup = true;
  for (let i = 0; i < geometry.faces.length; i++) {
    hup == 1 ? hue++ : hue--;
    hue == he ? (hup = false) : hue == hs ? (hup = true) : 0;
    geometry.faces[i].color = new THREE.Color(`hsl(${hue},100%,60%)`);
  }

  const material = new THREE.MeshLambertMaterial({
    side: THREE.BackSide,
    vertexColors: THREE.FaceColors,
    wireframe: true
  });

  const tube = new THREE.Mesh(geometry, material);
  scene.add(tube);

  const light = new THREE.PointLight(0xffffff, 1, 50);
  scene.add(light);
  const light2 = new THREE.AmbientLight(ambientLight);
  scene.add(light2);

  const l1 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
  scene.add(l1);
  const l2 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
  scene.add(l2);
  const l3 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
  scene.add(l3);
  const l4 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
  scene.add(l4);
  const l5 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
  scene.add(l5);

  let pct = 0;
  let pct2 = 0;
  function render() {
    pct += cameraSpeed;
    pct2 += lightSpeed;
    const pt1 = path.getPointAt(pct % 1);
    const pt2 = path.getPointAt((pct + 0.01) % 1);
    camera.position.set(pt1.x, pt1.y, pt1.z);
    camera.lookAt(pt2);
    light.position.set(pt2.x, pt2.y, pt2.z);

    l1.position.set(
      path.getPointAt((pct2 + 0.0) % 1).x,
      path.getPointAt((pct2 + 0.0) % 1).y,
      path.getPointAt((pct2 + 0.0) % 1).z
    );
    l2.position.set(
      path.getPointAt((pct2 + 0.2) % 1).x,
      path.getPointAt((pct2 + 0.2) % 1).y,
      path.getPointAt((pct2 + 0.2) % 1).z
    );
    l3.position.set(
      path.getPointAt((pct2 + 0.4) % 1).x,
      path.getPointAt((pct2 + 0.4) % 1).y,
      path.getPointAt((pct2 + 0.4) % 1).z
    );
    l4.position.set(
      path.getPointAt((pct2 + 0.6) % 1).x,
      path.getPointAt((pct2 + 0.6) % 1).y,
      path.getPointAt((pct2 + 0.6) % 1).z
    );
    l5.position.set(
      path.getPointAt((pct2 + 0.8) % 1).x,
      path.getPointAt((pct2 + 0.8) % 1).y,
      path.getPointAt((pct2 + 0.8) % 1).z
    );

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
};

export default CanvasAnimate;
