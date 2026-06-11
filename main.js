import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const canvas = document.getElementById("experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let character = {
  instance: null,
  moveDistance: 6,
  jumpHeight: 3,
  isMoving: false,
  moveDuration: 0.15,
};

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.75;

const modalContent = {
  Cube011: {
    title: "Sistema de Ubers — SADVU",
    content:
      "Sistema web para la administración de servicios de transporte en modalidad Uber. Permite a los propietarios controlar unidades, choferes y operaciones financieras desde un panel centralizado. Incluye dashboard con gráficas interactivas de ingresos vs. egresos, módulos de operaciones y catálogos (autos, usuarios, productos) y registro de mantenimiento preventivo.\n\nCliente: Proyecto titulación\nFrontend: Angular con CoreUI y Chart.js\nBackend: API REST con Baserow\nControl de versión: GIT (Bitbucket)\nGestión del proyecto: Jira bajo metodología SCRUM",
    technologies: [
      "Angular",
      "CoreUI",
      "Chart.js",
      "Baserow",
      "Bitbucket",
      "Jira",
      "SCRUM",
    ],
    url: "https://sadvu.site/#/login",
  },
  Cube012: {
    title: "Prevengo",
    content:
      "Plataforma integral para una empresa de capacitación y seguridad. Centraliza la programación y seguimiento de cursos (ocupaciones STPS, firmantes, evaluaciones e historial de constancias), cotizaciones, órdenes de servicio (OSS) y cartera de clientes. Creación de certificados en línea así como módulo de verificación de cursos.\n\nCliente: Paymun\nFrontend: React\nBackend: API REST en Laravel 12 (PHP 8.2) con Sanctum\nBase de datos: MySQL\nControl de versión: GIT (Bitbucket)",
    technologies: ["React", "Laravel 12", "PHP 8.2", "Sanctum", "MySQL"],
    url: "https://prevengo.paymun.mx",
  },
  Cube013: {
    title: "Biblioteca Virtual",
    content:
      "Aplicación web para la gestión de libros y recursos bibliográficos. Organiza lecturas, registra títulos y mantiene la colección de libros al día.\n\nCliente: Proyecto personal\nFrontend: Blazor WebAssembly con .NET 8\nBackend: API en ASP.NET Core (C#)\nBase de datos: SQL Server\nControl de versión: GIT (Bitbucket)\nContenerizada con Docker y desplegada en producción con Dokploy.",
    technologies: [
      "Blazor WebAssembly",
      ".NET 8",
      "ASP.NET Core",
      "SQL Server",
      "Docker",
      "Dokploy",
    ],
    url: "",
  },
  Cube014: {
    title: "Kitlo",
    content:
      "Plataforma SaaS para la recolección de kits en eventos de carreras. Los organizadores gestionan eventos, participantes y documentos desde un panel con métricas e ingresos por mes, y los corredores se registran y dan seguimiento por un flujo público por evento (enlace con GUID). Se envían correos electrónicos por cada evento en la plataforma.\n\nCliente: Bytekod\nFrontend: React + TypeScript (Vite, Tailwind, ECharts)\nBackend: API REST en Laravel 12 (PHP 8.2) con Sanctum\nBase de datos: MySQL\nRepositorio de archivos: S3 con Cloudflare\nPasarela de Pago: Stripe",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "ECharts",
      "Laravel 12",
      "PHP 8.2",
      "Sanctum",
      "MySQL",
    ],
    url: "https://app.kitlo.online",
  },
  Cube015: {
    title: "Plataforma de Gestión de Incidencias",
    content:
      "Sistema integral para el registro, asignación y seguimiento de incidencias operativas en hoteles, por área o habitación. Incluye reporte externo vía código QR (sin iniciar sesión), notificaciones automáticas por correo y WhatsApp, panel de estadísticas y control de roles.\n\nCliente: Mesón de la Luna\nFrontend: React + TypeScript con Vite y Tailwind\nBackend: API REST en Laravel 12 (PHP 8.2)\nBase de datos: MySQL\nControl de versión: GIT (Bitbucket)",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Laravel 12",
      "PHP 8.2",
      "MySQL",
      "Docker",
    ],
    url: "https://incidentes-mesondelaluna.com",
  },
};

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalProjectDescription = document.querySelector(
  ".modal-project-description",
);
const modalTechnologies = document.querySelector(".modal-technologies");
const modalVisitButton = document.querySelector(".modal-project-visit-button");
const modalExitButton = document.querySelector(".exit-button");

function showModal(id) {
  const content = modalContent[id];
  if (content) {
    modalTitle.textContent = content.title;
    modalProjectDescription.innerHTML = content.content
      .split("\n")
      .map((line) => (line === "" ? "<br>" : `<span>${line}</span><br>`))
      .join("");
    modalTechnologies.innerHTML = content.technologies
      .map((t) => `<span class="tech-tag">${t}</span>`)
      .join("");
    if (content.url) {
      modalVisitButton.href = content.url;
      modalVisitButton.target = "_blank";
      modalVisitButton.style.display = "inline-block";
    } else {
      modalVisitButton.style.display = "none";
    }
    modal.classList.remove("hidden");
  }
}

function hideModal() {
  modal.classList.add("hidden");
}

modalExitButton.addEventListener("click", (e) => {
  e.stopPropagation();
  hideModal();
});

let intersectObject = "";

const intersectObjectsNames = Object.keys(modalContent);
const intersectObjects = [];
const flowers = [];
const collidables = [];
const collisionRaycaster = new THREE.Raycaster();

const loader = new GLTFLoader();

loader.load(
  "https://github.com/Betsy0505/BlenderPortfolio/releases/download/v1.0/try3.glb",
  function (glb) {
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        let ancestor = child.parent;
        while (ancestor) {
          if (intersectObjectsNames.includes(ancestor.name)) {
            intersectObjects.push(child);
            child.userData.interactiveName = ancestor.name;
            break;
          }
          ancestor = ancestor.parent;
        }
      }

      if (child.name === "Cube007") {
        character.instance = child;
      }

      if (child.isMesh) {
        const isGround = child.name.startsWith("Plane") || child.parent?.name.startsWith("Plane");
        const isCharacter = child.name === "Cube007";
        const flowerM = child.name.match(/^Cube(\d+)$/);
        const isFlower = flowerM && parseInt(flowerM[1]) >= 46 && parseInt(flowerM[1]) <= 107;
        const isScreen = intersectObjectsNames.includes(child.name) || intersectObjectsNames.includes(child.parent?.name);
        if (!isGround && !isCharacter && !isFlower && !isScreen) {
          collidables.push(child);
        }
      }

      const flowerMatch = child.name.match(/^Cube(\d+)$/);
      if (flowerMatch) {
        const num = parseInt(flowerMatch[1]);
        if (num >= 46 && num <= 107) {
          flowers.push(child);
        }
      }
    });

    scene.add(glb.scene);

    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.opacity = "0";
    setTimeout(() => loadingScreen.classList.add("hidden"), 500);
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

const sun = new THREE.DirectionalLight(0xffffff);
sun.castShadow = true;
sun.position.set(75, 580, 0);
sun.target.position.set(50, 0, 0);
scene.add(sun.target);
sun.shadow.mapSize.width = 4096;
sun.shadow.mapSize.height = 4096;
sun.shadow.camera.left = -200;
sun.shadow.camera.right = 200;
sun.shadow.camera.top = 200;
sun.shadow.camera.bottom = -200;
sun.shadow.normalBias = 0.2;
scene.add(sun);

const light = new THREE.AmbientLight(0x404040, 3);
scene.add(light);

const aspect = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
  -aspect * 35,
  aspect * 35,
  35,
  -35,
  1,
  1000,
);

camera.position.x = -60;
camera.position.y = 60;
camera.position.z = -20;

scene.background = new THREE.Color(0x7cdb54);

const controls = new OrbitControls(camera, canvas);
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;
controls.update();

function onResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  const aspect = sizes.width / sizes.height;

  camera.left = -aspect * 35;
  camera.right = aspect * 35;
  camera.top = 35;
  camera.bottom = -35;

  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onClick() {
  if (intersectObject !== "") {
    showModal(intersectObject);
  }
}

function onPointerMove(event) {
  // Calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

const WORLD_BOUNDS = { minX: -106.7, maxX: 73.3, minZ: -133.6, maxZ: 148.4 };

function canMoveTo(from, to) {
  if (to.x < WORLD_BOUNDS.minX || to.x > WORLD_BOUNDS.maxX ||
      to.z < WORLD_BOUNDS.minZ || to.z > WORLD_BOUNDS.maxZ) return false;
  const direction = new THREE.Vector3(to.x - from.x, 0, to.z - from.z).normalize();
  const origin = new THREE.Vector3(from.x, from.y + 1, from.z);
  collisionRaycaster.set(origin, direction);
  collisionRaycaster.far = 2.5;
  const hits = collisionRaycaster.intersectObjects(collidables);
  return hits.length === 0;
}

function bounceNearbyFlowers() {
  const charPos = character.instance.position;
  flowers.forEach((flower) => {
    const dx = flower.position.x - charPos.x;
    const dz = flower.position.z - charPos.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance < 4) {
      const originY = flower.position.y;
      gsap.to(flower.position, {
        y: originY + 2,
        duration: 0.15,
        ease: "power1.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => { flower.position.y = originY; },
      });
    }
  });
}

function moveCharacter(targetPosition, targetRotation) {
  if (!character.instance || character.isMoving) return;
  character.isMoving = true;

  const originY = character.instance.position.y;

  gsap.to(character.instance.rotation, {
    y: targetRotation,
    duration: character.moveDuration * 0.5,
  });

  const tl = gsap.timeline({
    onComplete: () => {
      character.isMoving = false;
      bounceNearbyFlowers();
    },
  });

  tl.to(character.instance.position, {
    x: targetPosition.x,
    z: targetPosition.z,
    y: originY + character.jumpHeight,
    duration: character.moveDuration / 2,
    ease: "power1.out",
  });

  tl.to(character.instance.position, {
    y: originY,
    duration: character.moveDuration / 2,
    ease: "power1.in",
  });
}

function handleMove(direction) {
  if (!character.instance || character.isMoving) return;
  const pos = character.instance.position;
  let targetPosition = null;
  let targetRotation = 0;

  switch (direction) {
    case "up":
      targetPosition = { x: pos.x + character.moveDistance, z: pos.z };
      targetRotation = Math.PI;
      break;
    case "down":
      targetPosition = { x: pos.x - character.moveDistance, z: pos.z };
      targetRotation = 0;
      break;
    case "left":
      targetPosition = { x: pos.x, z: pos.z - character.moveDistance };
      targetRotation = -Math.PI / 2;
      break;
    case "right":
      targetPosition = { x: pos.x, z: pos.z + character.moveDistance };
      targetRotation = Math.PI / 2;
      break;
    default:
      return;
  }

  if (!canMoveTo(pos, targetPosition)) return;
  moveCharacter(targetPosition, targetRotation);
}

function onKeyDown(event) {
  if (["arrowup","arrowdown","arrowleft","arrowright"].includes(event.key.toLowerCase())) {
    event.preventDefault();
  }
  const keyMap = { "w": "up", "arrowup": "up", "s": "down", "arrowdown": "down", "a": "left", "arrowleft": "left", "d": "right", "arrowright": "right" };
  const direction = keyMap[event.key.toLowerCase()];
  if (direction) handleMove(direction);
}

let dpadInterval = null;
document.querySelectorAll(".dpad-btn").forEach(btn => {
  const dir = btn.dataset.dir;
  const start = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleMove(dir);
    dpadInterval = setInterval(() => handleMove(dir), 180);
  };
  const stop = () => { clearInterval(dpadInterval); dpadInterval = null; };
  btn.addEventListener("touchstart", start, { passive: false });
  btn.addEventListener("touchend", stop);
  btn.addEventListener("touchcancel", stop);
  btn.addEventListener("mousedown", start);
  btn.addEventListener("mouseup", stop);
  btn.addEventListener("mouseleave", stop);
  btn.addEventListener("click", (e) => e.stopPropagation());
});

window.addEventListener("resize", onResize);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", onClick);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("keydown", onKeyDown);

const cameraOffset = new THREE.Vector3(-60, 60, -20);

function animate() {
  if (character.instance) {
    const pos = character.instance.position;
    camera.position.set(pos.x + cameraOffset.x, cameraOffset.y, pos.z + cameraOffset.z);
    controls.target.set(pos.x, 0, pos.z);
    controls.update();
  }

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(intersectObjects);

  if (intersects.length > 0) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
    intersectObject = "";
  }

  if (intersects.length > 0) {
    intersectObject = intersects[0].object.userData.interactiveName ?? "";
  }

  renderer.render(scene, camera);

  // console.log(camera.position);
}
renderer.setAnimationLoop(animate);
