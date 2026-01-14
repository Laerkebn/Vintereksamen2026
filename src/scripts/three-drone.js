import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function startDroneScene(container, { mode = "drone" } = {}) {
  if (!container) {
    console.error("Container not found");
    return;
  }

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x26264c);

  const w = container.clientWidth || 800;
  const h = container.clientHeight || 400;

  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 5000);
  camera.position.set(0, 2, 20);

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

  // --- Helpers
  function goTo(pos, target = new THREE.Vector3(0, 0, 0)) {
    camera.position.set(pos.x, pos.y, pos.z);
    controls.target.set(target.x, target.y, target.z);
    controls.update();
  }

  let droneModel = null;
  let particles = null;

  const isDrone = mode === "drone";
  
  // Gem default kamera position
  const defaultCameraPos = new THREE.Vector3(0, 2, 20);
  const defaultTarget = new THREE.Vector3(0, 0, 0);

  if (isDrone) {
    // --- DRONE MODE ---
    // Lazor (kun til drone-mode)
    const Lazor = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 5, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x58a851 })
    );
    Lazor.position.set(0, -4, 0);
    scene.add(Lazor);

    // Load drone model
    const loader = new GLTFLoader();
    const modelPath = "/models/DroneRigtig.gltf";

    loader.load(
      modelPath,
      (gltf) => {
        droneModel = gltf.scene;
        scene.add(droneModel);
        goTo(new THREE.Vector3(0, 2, 20), new THREE.Vector3(0, 0, 0));
      },
      undefined,
      (err) => console.error("Model load failed ⌛", err)
    );

    // Bind drone info-knapperne (de ændrer kun tekst, ikke 3D-scenen)
    const topButtons = ["btn-lazor", "btn-ring", "btn-arme", "btn-luft"];
    topButtons.forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener("click", () => {
          // Kamera-positioner for forskellige dele af dronen
          switch(btnId) {
            case "btn-lazor":
              goTo(new THREE.Vector3(4.715336941238069,  -6.725112218727403, 2.6407145325708514), // kamera-position --- (x Venstre ↔ Højre, y Ned ↔ Op, z Bagud ↔ Frem)
     new THREE.Vector3(0, -2, 0)); // hvor kamera kigger hen
              break;
            case "btn-ring":
              goTo(new THREE.Vector3(-1.5650391565607435, -0.2404051597162703, 6.63594172759533),
    new THREE.Vector3(0, 0, 0));
              break;
            case "btn-arme":
                  goTo(new THREE.Vector3(-7.623118120895998, 1.6736356947793163, 5.9303520400716305),
    new THREE.Vector3(0, 0, 0));
              break;
            case "btn-luft":
              goTo(new THREE.Vector3(-6.918673299307527, -2.490250024472993, 7.313720842195965),
    new THREE.Vector3(0, 2, 0));
              break;
          }
        });
      }
    });
    
    // Reset knap for drone-scenen
    const resetBtn = document.getElementById("btn-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        goTo(defaultCameraPos, defaultTarget);
      });
    }

  } else {
    // --- PARTICLES MODE ---
    const pGeom = new THREE.TorusGeometry(0.7, 0.2, 20, 100);
    const pMat = new THREE.PointsMaterial({
      color: 0x58a851,
      size: 0.3,
      sizeAttenuation: true,
    });
    particles = new THREE.Points(pGeom, pMat);
    particles.scale.set(7, 7, 7);
    scene.add(particles);

    goTo(new THREE.Vector3(0, 2, 20), new THREE.Vector3(0, 0, 0));

    // Bind particles-knapperne
    document.getElementById("btn-torus")?.addEventListener("click", () => {
      if (particles) {
        particles.geometry.dispose();
        particles.geometry = new THREE.TorusGeometry(0.7, 0.2, 20, 100);
      }
    });

    document.getElementById("btn-sphere")?.addEventListener("click", () => {
      if (particles) {
        particles.geometry.dispose();
        particles.geometry = new THREE.SphereGeometry(0.8, 32, 24);
      }
    });

    document.getElementById("btn-knot")?.addEventListener("click", () => {
      if (particles) {
        particles.geometry.dispose();
        particles.geometry = new THREE.TorusKnotGeometry(0.6, 0.18, 160, 12);
      }
    });

    document.getElementById("btn-firkant")?.addEventListener("click", () => {
      if (particles) {
        particles.geometry.dispose();
        particles.geometry = new THREE.BoxGeometry(1, 1, 1, 20, 20, 20);
      }
    });
  }

  // --- Resize (container-baseret)
  const ro = new ResizeObserver(() => {
    const nw = container.clientWidth || 800;
    const nh = container.clientHeight || 400;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
  ro.observe(container);

  // --- Render loop
  function animate() {
    requestAnimationFrame(animate);

    if (!isDrone && particles) {
      particles.rotation.y += 0.01;
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}