import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function startDroneScene(container) {

  // --- Scene basics ---
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const w = container.clientWidth || 800;
  const h = container.clientHeight || 400;

  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 5000);
  camera.position.set(0, 2, 20);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x222244, 1);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 2));
  const dir = new THREE.DirectionalLight(0xffffff, 3);
  dir.position.set(10, 20, 10);
  scene.add(dir);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.update();

  // --- Simple camera position
  function goTo(pos, target = new THREE.Vector3(0, 0, 0)) {
    camera.position.set(pos.x, pos.y, pos.z);
    controls.target.set(target.x, target.y, target.z);
    controls.update();
  }

  // tryk L for at logge camera x,y,z og controls target
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "l") {
      console.log("camera.position =", camera.position);
      console.log("controls.target =", controls.target);
    }
  });

  // --- Objects we can show/hide ---
  let droneModel = null;
  let particles = null;
  let particlesVisible = false;

  // Lazor
  const Lazor = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 5, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x8aff8a })
  );
  Lazor.position.set(0, -4, 0);
  scene.add(Lazor);

  //  Particles system 
  //objekt
const geometry = new THREE.TorusGeometry(0.7, 0.2, 20, 100)
  //matriale
const material = new THREE.PointsMaterial({
  color: 0x8aff8a,
  size: 0.3,
  sizeAttenuation: true,
  
 } );

const sphere = new THREE.Points(geometry, material);
particles = sphere;
sphere.scale.set(8, 8, 8);

sphere.position.set(0, 0, 0);
scene.add(sphere);
 
document.getElementById("btn-torus")?.addEventListener("click", () => {
  particles.geometry = new THREE.TorusGeometry(0.7, 0.2, 20, 100);
});

document.getElementById("btn-sphere")?.addEventListener("click", () => {
  particles.geometry = new THREE.SphereGeometry(0.8, 32, 24);
});

document.getElementById("btn-knot")?.addEventListener("click", () => {
  particles.geometry = new THREE.TorusKnotGeometry(0.6, 0.18, 160, 12);
});

document.getElementById("btn-firkant")?.addEventListener("click", () => {
  particles.geometry = new THREE.TorusfirkantGeometry(1, 1, 1, 12);
});


  // Mode switching 
  function showDroneMode() {
    particlesVisible = false;

    if (droneModel) droneModel.visible = true;
    Lazor.visible = true;
    if (particles) particles.visible = false;

    // vis top-knapper
document.getElementById("top-ui")?.classList.remove("hidden");
document.getElementById("result-ui")?.classList.add("hidden");
document.getElementById("btn-resultat")?.classList.remove("hidden");

  //Positionene kameraet starter i
 goTo(new THREE.Vector3(0, 2, 20), new THREE.Vector3(0, 0, 0));
}

 function showResultMode() {
  particlesVisible = true;

  if (droneModel) droneModel.visible = false;
  Lazor.visible = false;
  if (particles) particles.visible = true;

  // skjul drone-knapper
  document.getElementById("top-ui")?.classList.add("hidden");

  // vis resultat-knapper
  document.getElementById("result-ui")?.classList.remove("hidden");

  // ✅ skjul Resultat-knappen (kun den)
  document.getElementById("btn-resultat")?.classList.add("hidden");

  goTo(new THREE.Vector3(0, 2, 20), new THREE.Vector3(0, 0, 0));
}


  //Knapper
  document.getElementById("btn-lazor")?.addEventListener("click", () => {
    goTo(new THREE.Vector3(4.715336941238069,  -6.725112218727403, 2.6407145325708514), // kamera-position --- (x Venstre ↔ Højre, y Ned ↔ Op, z Bagud ↔ Frem)
     new THREE.Vector3(0, -2, 0)); // hvor kamera kigger hen
  });

  document.getElementById("btn-ring")?.addEventListener("click", () => {
    goTo(new THREE.Vector3(-1.5650391565607435, -0.2404051597162703, 6.63594172759533),
    new THREE.Vector3(0, 0, 0));
  });

  document.getElementById("btn-arme")?.addEventListener("click", () => {
    goTo(new THREE.Vector3(-7.623118120895998, 1.6736356947793163, 5.9303520400716305),
    new THREE.Vector3(0, 0, 0));
  });

  document.getElementById("btn-luft")?.addEventListener("click", () => {
    goTo(new THREE.Vector3(-6.918673299307527, -2.490250024472993, 7.313720842195965),
    new THREE.Vector3(0, 2, 0));
  });

document.getElementById("btn-reset")?.addEventListener("click", () => {
  showDroneMode(); // showDroneMode bruger reset-positionen
});

  document.getElementById("btn-resultat")?.addEventListener("click", () => {
    showResultMode();
  });

  // --- Load drone model (vælg ÉN af de to paths) ---
  const loader = new GLTFLoader();

  // Hvis du bruger GLB:
  // const modelPath = "/models/DroneBlender.glb";

  // Hvis du bruger GLTF:
  const modelPath = "/models/DroneRigtig.gltf";

  loader.load(
    modelPath,
    (gltf) => {
      droneModel = gltf.scene;
      scene.add(droneModel);

      // Start i drone-mode
      showDroneMode();
    },
    undefined,
    (err) => console.error("Model load failed ❌", err)
  );

  // --- Resize ---
  window.addEventListener("resize", () => {
    const nw = container.clientWidth || 800;
    const nh = container.clientHeight || 400;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });

  // --- Render loop ---
  function animate() {
    requestAnimationFrame(animate);

    if (particlesVisible && particles) {
      particles.rotation.y += 0.01;
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
