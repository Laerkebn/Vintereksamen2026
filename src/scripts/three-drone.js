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

  // TEST: tydelig kube + axes
  const testCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff00ff })
  );
  testCube.position.set(0, 0, 0);
  scene.add(testCube);

  scene.add(new THREE.AxesHelper(3)); // viser XYZ akser

  // Controls (VIGTIGT: target + update)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.update();

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

  // Loader (kan komme bagefter når test virker)
  const loader = new GLTFLoader();
  loader.load(
    "/models/DroneBlender4.glb",
    (gltf) => {
      console.log("GLB loaded ✅");
      const model = gltf.scene;
      scene.add(model);
    },
    undefined,
    (err) => console.error("GLB load failed ❌", err)
  );
}
