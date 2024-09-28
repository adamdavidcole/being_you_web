import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.001,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Set the background color
scene.background = new THREE.Color(0x0d0a21);

const ambientLight = new THREE.HemisphereLight(
  "white", // bright sky color
  "darkslategrey", // dim ground color
  5 // intensity
);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(5, 10, 7.5).normalize();
// scene.add(directionalLight);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// // Hexagon arrangement
const radius = 5;
const angleStep = Math.PI / 3;
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
video1.play();
video2.play();
const videoTexture1 = new THREE.VideoTexture(video1);
const videoTexture2 = new THREE.VideoTexture(video2);

for (let i = 0; i < 6; i++) {
  const angle = i * angleStep;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);

  const planeScaler = 2;
  const geometry = new THREE.PlaneGeometry(
    0.9 * planeScaler,
    1.6 * planeScaler
  );
  let plane;

  if (i === 0 || i === 3) {
    const material = new THREE.MeshBasicMaterial({
      map: i === 0 ? videoTexture1 : videoTexture2,
    });
    plane = new THREE.Mesh(geometry, material);
  } else {
    plane = new Reflector(geometry, {
      color: new THREE.Color(0x7f7f7f),
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
    });
    // material = reflector.material;
  }

  //   const mirrorBack1 = new Reflector(new THREE.PlaneGeometry(2, 2), {
  //     color: new THREE.Color(0x7f7f7f),
  //     textureWidth: window.innerWidth * window.devicePixelRatio,
  //     textureHeight: window.innerHeight * window.devicePixelRatio,
  //   });

  //   mirrorBack1.position.y = 1;
  //   mirrorBack1.position.z = -1;
  //   scene.add(mirrorBack1);

  //   const plane = new THREE.Mesh(geometry, material);
  plane.position.set(x, 0, z);
  plane.lookAt(0, 0, 0);

  // Create a box geometry with a small depth
  const boxDepth = 0.1;
  const frameThickness = plane.geometry.parameters.width / 10;
  console.log(plane.geometry.parameters.width);
  const boxGeometry = new THREE.BoxGeometry(
    plane.geometry.parameters.width + frameThickness,
    plane.geometry.parameters.height + frameThickness,
    boxDepth
  );
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x4a0b11 });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  // Position the box slightly behind the plane
  box.position.z = plane.position.z;
  box.position.x = plane.position.x;
  box.position.y = plane.position.y;

  box.lookAt(0, 0, 0);

  const distanceOffset = 0.02;
  const distanceFromCenter = boxDepth / 2 + distanceOffset; // Adjust this value as needed
  const directionVector = new THREE.Vector3(
    box.position.x,
    box.position.y,
    box.position.z
  ).normalize();
  box.position.add(directionVector.multiplyScalar(distanceFromCenter));

  scene.add(plane);
  scene.add(box);
}

camera.position.z = 5;
controls.update();

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
