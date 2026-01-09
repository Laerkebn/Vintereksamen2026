import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


export function startDroneScene(container) {
  console.log("container size:", container.clientWidth, container.clientHeight);



  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  

  // Fallback hvis container er 0x0
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 400;

  // Camera
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 5000);
  camera.position.set(0, 2, 20);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x222244, 1);
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 2));
  const dir = new THREE.DirectionalLight(0xffffff, 3);
  dir.position.set(10, 20, 10);
  scene.add(dir);

  // Lazor
  const Lazor = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 5, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xFF0000 })
  );
 Lazor.position.set(0, -4, 0);
  scene.add(Lazor);


  // Controls (target + update)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.update();

  //Maskine der styrre knapperne
  function goTo(pos, target = new THREE.Vector3(0, 0, 0)) {
  camera.position.set(pos.x, pos.y, pos.z);
  controls.target.set(target.x, target.y, target.z);
  controls.update();
}

  window.addEventListener("keydown", (e) => {
  if (e.key === "l") {
    console.log("📷 camera.position =", camera.position);
    console.log("🎯 controls.target =", controls.target);
  }
});

//knapper
document.getElementById("btn-lazor")?.addEventListener("click", () => {
  goTo(
    new THREE.Vector3(  4.715336941238069,  -6.725112218727403, 2.6407145325708514),   // kamera-position --- (x Venstre ↔ Højre, y Ned ↔ Op, z Bagud ↔ Frem)
    new THREE.Vector3(0, -2, 0)    // hvor kamera kigger hen
  );
});

document.getElementById("btn-ring")?.addEventListener("click", () => {
  goTo(
    new THREE.Vector3(-1.5650391565607435, -0.2404051597162703, 6.63594172759533),
    new THREE.Vector3(0, 0, 0)
  );
});

document.getElementById("btn-arme")?.addEventListener("click", () => {
  goTo(
    new THREE.Vector3(-7.623118120895998, 1.6736356947793163, 5.9303520400716305),
    new THREE.Vector3(0, 0, 0)
  );
});

document.getElementById("btn-luft")?.addEventListener("click", () => {
  goTo(
    new THREE.Vector3(-6.918673299307527, -2.490250024472993, 7.313720842195965),
    new THREE.Vector3(0, 2, 0)
  );
});

document.getElementById("btn-reset")?.addEventListener("click", () => {
  goTo(
    new THREE.Vector3(0, 2, 20),
    new THREE.Vector3(0, 0, 0)
  );
});


  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize (brug containerens aktuelle størrelse)
  window.addEventListener("resize", () => {
    const nw = container.clientWidth || 800;
    const nh = container.clientHeight || 400;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });

  // Loader 
  const loader = new GLTFLoader();
  loader.load(
    "/models/Drone.gltf",
    (gltf) => {
      console.log("GLB loaded ✅");
      const model = gltf.scene;
      scene.add(model);
    },
    undefined,
    (err) => console.error("GLB load failed ❌", err)
  );
}
