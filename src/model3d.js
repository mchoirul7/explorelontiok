// Three.js house model that replaces the old CSS-built house.
//
// The glTF exporter left every node with a generic name (Plane.004, Cube.012),
// so parts are classified by where they sit in the model's own bounding box
// rather than by name: stilts at the bottom, the deck above them, the body,
// then the roof. Those same groups drive the exploded view, the layer looks,
// and the anchors that the 2D hotspots and the airflow field are pinned to.

// "three" is resolved by the import map in index.html, which points at the
// vendored copy in src/vendor/three. GLTFLoader is pulled in by path because it
// resolves its own bare "three" import through that same map.
import * as THREE from "three";
import { GLTFLoader } from "./vendor/three/examples/jsm/loaders/GLTFLoader.js";

const MODEL_URL = "assets/3d/rumahadat-web.glb";

// Vertical bands as a fraction of the model height, read off the geometry.
const BANDS = [
  { id: "roof", from: 0.55, top: 0.62 },
  { id: "walls", from: 0.4 },
  { id: "floor", from: 0.26 },
  { id: "foundation", from: -Infinity },
];

// Where each group flies when the structure view explodes, in units of the
// model's own bounding box, plus the stagger the old CSS version used.
const EXPLODE = {
  roof: { x: 0, y: 0.58, z: 0, delay: 0 },
  walls: { x: 0.42, y: 0.06, z: 0, delay: 150 },
  floor: { x: 0, y: -0.16, z: 0, delay: 350 },
  foundation: { x: 0, y: -0.34, z: 0, delay: 430 },
};

// Anchor points in normalised model space (u across the short axis, v up,
// w along the length). Hotspots and structure labels ride on these.
const ANCHORS = {
  roof: [0.5, 0.86, 0.45],
  roofEdge: [0.5, 0.68, 0.2],
  window: [0.5, 0.5, 0.3],
  wall: [0.5, 0.48, 0.5],
  interior: [0.5, 0.42, 0.62],
  deck: [0.5, 0.3, 0.5],
  raisedFloor: [0.5, 0.17, 0.45],
  stairs: [0.5, 0.22, 0.92],
};

const LAYER_LOOKS = {
  normal: { opacity: 1, saturation: 1, tint: null },
  architecture: { opacity: 0.94, saturation: 0.72, tint: 0xd8b98a },
  airflow: { opacity: 0.82, saturation: 0.58, tint: 0x79d8e2 },
  climate: { opacity: 0.9, saturation: 0.6, tint: 0xd7683c },
  dailyLife: { opacity: 0.96, saturation: 0.86, tint: 0xe2c07f },
  wisdom: { opacity: 0.94, saturation: 0.68, tint: 0xe29d57 },
};

function detectTier() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const coarse = window.matchMedia?.("(hover: none) and (pointer: coarse)").matches;
  return cores <= 4 || memory <= 4 || coarse ? "low" : "high";
}

export function createHouseModel(handlers = {}) {
  const canvas = document.createElement("canvas");
  canvas.className = "model-canvas";
  canvas.setAttribute("aria-hidden", "true");

  const tier = detectTier();
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  let renderer = null;
  let scene = null;
  let camera = null;
  let pivot = null;
  let groups = {};
  let bounds = null;
  let ready = false;
  let failed = false;

  let width = 0;
  let height = 0;
  let rafId = null;
  let running = false;
  let lastTime = 0;
  let stopTimer = null;

  // Presentation state, driven from the app store on every render().
  let targetExplode = 0;
  let explode = 0;
  let layer = "normal";
  let thermal = false;
  let visible = false;
  let autoSpin = true;

  let yaw = Math.PI / 2 + 0.34;
  let targetYaw = yaw;
  let pitch = 0.12;
  let targetPitch = pitch;
  let dragging = false;
  let dragId = null;
  let dragX = 0;
  let dragY = 0;
  let idleSince = 0;

  let anchorHosts = [];
  let overlayRoot = null;
  let geometrySignature = "";
  let geometry = null;
  const projected = new THREE.Vector3();

  function init() {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: tier === "high",
      powerPreference: "high-performance",
    });
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(32, 1.24, 0.1, 100);

    // Soft sky/ground light keeps the baked texture readable without a costly
    // environment map, plus one key light so the roof planes separate.
    scene.add(new THREE.HemisphereLight(0xf6ecd8, 0x36251a, 2.6));
    const key = new THREE.DirectionalLight(0xffe9c9, 2.1);
    key.position.set(2.4, 3.4, 2.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fd8e6, 0.7);
    rim.position.set(-2.6, 1.4, -2.0);
    scene.add(rim);

    pivot = new THREE.Group();
    scene.add(pivot);

    new GLTFLoader().load(
      MODEL_URL,
      (gltf) => {
        setupModel(gltf.scene);
        ready = true;
        handlers.onReady?.();
        if (visible) start();
      },
      undefined,
      (error) => {
        failed = true;
        handlers.onError?.(error);
      },
    );
  }

  function setupModel(root) {
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Normalise so the model is one unit tall and stands on y = 0, which makes
    // every explode offset and anchor independent of the export's scale.
    const scale = 1 / size.y;
    root.position.set(-center.x, -box.min.y, -center.z);
    const holder = new THREE.Group();
    holder.add(root);
    holder.scale.setScalar(scale);
    pivot.add(holder);

    bounds = {
      size: size.clone().multiplyScalar(scale),
      // Long axis of the plan, used to face the camera at the long facade.
      long: size.z > size.x ? "z" : "x",
    };

    groups = {};
    BANDS.forEach((band) => {
      const group = new THREE.Group();
      group.name = band.id;
      groups[band.id] = { group, rest: new THREE.Vector3() };
      holder.add(group);
    });

    // Re-parent each mesh into its band group. Traversing into an array first
    // avoids mutating the tree while walking it.
    const meshes = [];
    root.traverse((child) => {
      if (child.isMesh) meshes.push(child);
    });

    meshes.forEach((mesh) => {
      const meshBox = new THREE.Box3().setFromObject(mesh);
      const top = (meshBox.max.y - box.min.y) / size.y;
      const mid = ((meshBox.min.y + meshBox.max.y) / 2 - box.min.y) / size.y;
      const band =
        BANDS.find((b) => (b.top !== undefined ? top >= b.top && mid >= b.from : mid >= b.from)) ??
        BANDS[BANDS.length - 1];

      prepareMaterial(mesh);
      // Keep the mesh's world placement while changing its parent.
      groups[band.id].group.attach(mesh);
    });

    Object.values(groups).forEach((entry) => entry.rest.copy(entry.group.position));
    frameCamera();
    // The store may already have moved off the default layer while the glTF
    // was still downloading.
    applyLayer();
  }

  function prepareMaterial(mesh) {
    const material = mesh.material;
    if (!material) {
      return;
    }

    // The export marks the whole atlas as fully transmissive, which forces
    // three.js into an extra render pass for glass. The atlas already carries
    // real alpha, so plain blending gives the same look far cheaper.
    if (material.transmission !== undefined) {
      material.transmission = 0;
      material.transmissionMap = null;
    }

    material.transparent = true;
    material.alphaTest = 0.35;
    material.depthWrite = true;
    material.side = THREE.DoubleSide;
    material.roughness = 0.86;
    material.metalness = 0;
    material.needsUpdate = true;

    mesh.userData.baseColor = material.color?.clone() ?? new THREE.Color(0xffffff);
    mesh.userData.baseOpacity = material.opacity ?? 1;
    mesh.frustumCulled = true;
  }

  function frameCamera() {
    if (!bounds) {
      return;
    }

    const { size } = bounds;
    const aspect = camera.aspect;
    const halfV = Math.tan((camera.fov * Math.PI) / 360);
    const halfH = halfV * aspect;
    // Fit whichever axis is tighter: the plan's long side across, height up.
    const span = Math.max(size.x, size.z);
    const distance = Math.max(span / 2 / halfH, size.y / 2 / halfV) * 1.08;

    camera.position.set(0, size.y * 0.52, distance);
    camera.lookAt(0, size.y * 0.46, 0);
    camera.updateProjectionMatrix();
  }

  function resize(cssWidth, cssHeight) {
    if (cssWidth < 4 || cssHeight < 4 || (cssWidth === width && cssHeight === height)) {
      return;
    }

    width = cssWidth;
    height = cssHeight;
    const cap = tier === "low" ? 1.75 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    renderer.setSize(cssWidth, cssHeight, false);
    camera.aspect = cssWidth / cssHeight;
    frameCamera();
  }

  const resizeObserver =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver((entries) => {
          const box = entries[0]?.contentRect;
          if (box) resize(box.width, box.height);
        });

  function applyLayer() {
    const look = LAYER_LOOKS[layer] ?? LAYER_LOOKS.normal;

    Object.values(groups).forEach(({ group }) => {
      group.traverse((child) => {
        if (!child.isMesh || !child.material) {
          return;
        }

        const base = child.userData.baseColor;
        const material = child.material;
        material.opacity = look.opacity * (child.userData.baseOpacity ?? 1);

        if (!look.tint) {
          material.color.copy(base);
        } else {
          // Desaturate toward the layer tint instead of replacing the texture,
          // so the carving stays legible under every X-ray layer.
          const tint = new THREE.Color(look.tint);
          material.color.copy(base).lerp(tint, 1 - look.saturation);
        }

        if (thermal) {
          material.color.lerp(new THREE.Color(0xd7683c), 0.22);
        }
      });
    });
  }

  function updateExplode(dt) {
    const ease = 1 - Math.pow(0.001, dt);
    explode += (targetExplode - explode) * ease;

    Object.entries(groups).forEach(([id, entry]) => {
      const offset = EXPLODE[id];
      if (!offset) {
        return;
      }
      // The stagger from the CSS version is kept by delaying each group's ramp.
      const lag = Math.min(1, Math.max(0, explode * 1.6 - offset.delay / 900));
      const amount = lag * lag * (3 - 2 * lag);
      const side = id === "walls" ? 1 : 1;
      entry.group.position.set(
        entry.rest.x + offset.x * amount * side,
        entry.rest.y + offset.y * amount,
        entry.rest.z + offset.z * amount,
      );
    });
  }

  // Projects an anchor to a fraction of the canvas box. The airflow overlay
  // shares that box, so it consumes these numbers directly.
  function projectAnchor(anchor) {
    const [u, v, w] = anchor;
    const { size } = bounds;
    projected.set((u - 0.5) * size.x, v * size.y, (w - 0.5) * size.z);
    pivot.localToWorld(projected);
    projected.project(camera);
    return { x: projected.x * 0.5 + 0.5, y: -projected.y * 0.5 + 0.5 };
  }

  // Hotspots and labels live in .ar-depth, which covers the whole scene rather
  // than the model box, so canvas fractions are remapped through both rects.
  function updateAnchors() {
    if (!bounds || !anchorHosts.length || !overlayRoot) {
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const rootRect = overlayRoot.getBoundingClientRect();
    if (!rootRect.width || !rootRect.height) {
      return;
    }

    anchorHosts.forEach(({ element, anchor }) => {
      const point = ANCHORS[anchor];
      if (!point) {
        return;
      }

      const at = projectAnchor(point);
      const x = ((canvasRect.left + at.x * canvasRect.width - rootRect.left) / rootRect.width) * 100;
      const y = ((canvasRect.top + at.y * canvasRect.height - rootRect.top) / rootRect.height) * 100;
      element.style.setProperty("--x", `${x.toFixed(2)}%`);
      element.style.setProperty("--y", `${y.toFixed(2)}%`);
    });
  }

  // Landmarks the airflow field needs, in the same 0..1 box coordinates the
  // canvas overlay uses, recomputed from wherever the model currently sits.
  function updateGeometry() {
    if (!bounds) {
      return;
    }

    const ridge = projectAnchor([0.5, 1, 0.5]);
    const eaveL = projectAnchor([0.5, 0.62, 0]);
    const eaveR = projectAnchor([0.5, 0.62, 1]);
    const wallTop = projectAnchor([0.5, 0.58, 0.5]);
    const wallBottom = projectAnchor([0.5, 0.3, 0.5]);
    const deckL = projectAnchor([0.5, 0.28, 0.04]);
    const deckR = projectAnchor([0.5, 0.28, 0.96]);
    const groundL = projectAnchor([0.5, 0.02, 0.04]);
    const groundR = projectAnchor([0.5, 0.02, 0.96]);

    const next = {
      ridge: [ridge.x, ridge.y],
      eaveL: [Math.min(eaveL.x, eaveR.x), (eaveL.y + eaveR.y) / 2],
      eaveR: [Math.max(eaveL.x, eaveR.x), (eaveL.y + eaveR.y) / 2],
      wall: {
        x0: Math.min(deckL.x, deckR.x),
        x1: Math.max(deckL.x, deckR.x),
        y0: wallTop.y,
        y1: wallBottom.y,
      },
      kolong: {
        x0: Math.min(groundL.x, groundR.x),
        x1: Math.max(groundL.x, groundR.x),
        y0: Math.max(deckL.y, deckR.y),
        y1: Math.max(groundL.y, groundR.y),
      },
    };

    // Rebake downstream only when the silhouette really moved.
    const signature = [
      next.ridge,
      next.eaveL,
      next.eaveR,
      next.wall.y0,
      next.wall.y1,
      next.kolong.y0,
    ]
      .flat()
      .map((v) => Math.round(v * 40))
      .join(",");

    if (signature !== geometrySignature) {
      geometrySignature = signature;
      next.signature = signature;
      geometry = next;
      publishCssGeometry(next);
      handlers.onGeometry?.(next);
    }
  }

  // The X-ray, shade and thermal overlays are still plain DOM. Handing them the
  // measured silhouette keeps them pinned to the model instead of to the old
  // hand-tuned percentages.
  function publishCssGeometry(geo) {
    const box = canvas.parentElement?.parentElement;
    if (!box) {
      return;
    }

    const left = Math.min(geo.eaveL[0], geo.wall.x0);
    const right = Math.max(geo.eaveR[0], geo.wall.x1);
    const top = geo.ridge[1];
    const bottom = geo.kolong.y1;
    const span = Math.max(right - left, 0.01);
    const drop = Math.max(bottom - top, 0.01);
    const pct = (v) => `${(v * 100).toFixed(2)}%`;

    box.style.setProperty("--house-left", pct(left));
    box.style.setProperty("--house-right", pct(1 - right));
    box.style.setProperty("--house-top", pct(top));
    box.style.setProperty("--house-bottom", pct(1 - bottom));
    // Positions within the overlay box itself, for clip paths.
    box.style.setProperty("--ridge-cx", pct((geo.ridge[0] - left) / span));
    box.style.setProperty("--eave-cy", pct((geo.eaveL[1] - top) / drop));
    box.style.setProperty("--wall-cy", pct((geo.wall.y1 - top) / drop));
  }

  function frame(now) {
    rafId = window.requestAnimationFrame(frame);

    if (!ready || width < 4) {
      return;
    }

    const dt = Math.min(lastTime ? (now - lastTime) / 1000 : 0.016, 0.05);
    lastTime = now;

    if (autoSpin && !dragging && !reduceMotion && now - idleSince > 2600) {
      targetYaw += dt * 0.12;
    }

    yaw += (targetYaw - yaw) * (1 - Math.pow(0.002, dt));
    pitch += (targetPitch - pitch) * (1 - Math.pow(0.002, dt));
    pivot.rotation.y = yaw;
    pivot.rotation.x = pitch;

    updateExplode(dt);
    updateAnchors();
    updateGeometry();
    renderer.render(scene, camera);
  }

  function start() {
    if (running || !renderer) {
      return;
    }
    running = true;
    lastTime = 0;
    rafId = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function onPointerDown(event) {
    if (dragId !== null) {
      return;
    }
    dragId = event.pointerId;
    dragging = true;
    dragX = event.clientX;
    dragY = event.clientY;
    canvas.setPointerCapture?.(dragId);
  }

  function onPointerMove(event) {
    if (!dragging || event.pointerId !== dragId) {
      return;
    }
    targetYaw += (event.clientX - dragX) * 0.008;
    targetPitch = Math.min(0.42, Math.max(-0.16, targetPitch + (event.clientY - dragY) * 0.004));
    dragX = event.clientX;
    dragY = event.clientY;
    idleSince = performance.now();
  }

  function onPointerUp(event) {
    if (event.pointerId !== dragId) {
      return;
    }
    canvas.releasePointerCapture?.(dragId);
    dragId = null;
    dragging = false;
    idleSince = performance.now();
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  function handleVisibility() {
    if (document.hidden) {
      if (running && rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (running && rafId === null) {
      lastTime = 0;
      rafId = window.requestAnimationFrame(frame);
    }
  }

  document.addEventListener("visibilitychange", handleVisibility);

  init();
  resizeObserver?.observe(canvas);

  function sync(host, options) {
    if (!host || failed) {
      return;
    }

    if (canvas.parentNode !== host) {
      host.appendChild(canvas);
      if (!width && host.clientWidth) {
        resize(host.clientWidth, host.clientHeight);
      }
      // The host element is rewritten on every render, taking the published
      // custom properties with it, so restate them on the new node.
      if (geometry) publishCssGeometry(geometry);
    }

    // Anchored overlay nodes are rewritten on every render, so re-collect them.
    overlayRoot = options.overlayRoot ?? host.closest(".ar-depth") ?? host.parentElement;
    anchorHosts = Array.from(overlayRoot?.querySelectorAll("[data-anchor]") ?? []).map(
      (element) => ({ element, anchor: element.dataset.anchor }),
    );

    const nextLayer = options.layer ?? "normal";
    if (nextLayer !== layer || options.thermal !== thermal) {
      layer = nextLayer;
      thermal = Boolean(options.thermal);
      if (ready) applyLayer();
    }

    targetExplode = options.explode ?? 0;
    // Hold the model still while the airflow lesson runs, so the flow overlay
    // stays registered with the silhouette it was baked against.
    autoSpin = !options.holdStill;
    visible = Boolean(options.visible);

    if (visible) {
      window.clearTimeout(stopTimer);
      canvas.classList.add("is-live");
      if (ready) start();
    } else {
      canvas.classList.remove("is-live");
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(stop, 620);
    }
  }

  function destroy() {
    stop();
    window.clearTimeout(stopTimer);
    resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", handleVisibility);
    renderer?.dispose();
    canvas.remove();
  }

  return { sync, destroy, isReady: () => ready, getGeometry: () => geometry };
}
