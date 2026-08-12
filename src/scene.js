import { AppMode, AppPhase } from "./state.js";
import { discoverHotspots } from "./hotspots.js";
import { structureParts } from "./structure.js";
import { climateHotspots } from "./thermal.js";
import { createAirflowField } from "./airflow-field.js";
import { createHouseModel } from "./model3d.js";

export function createScene(mount, handlers) {
  const airflowField = createAirflowField();
  let geometry = null;
  let lastState = null;
  let lastTranslator = null;

  let modelReady = false;
  let modelFailed = false;

  const houseModel = createHouseModel({
    onReady: () => {
      modelReady = true;
      if (lastState) render(lastState, lastTranslator);
      handlers.onModelReady?.();
    },
    onError: (error) => {
      modelFailed = true;
      if (lastState) render(lastState, lastTranslator);
      handlers.onModelError?.(error);
    },
    // The silhouette moved enough to matter, so re-register the airflow field
    // against it without waiting for the next store update.
    onGeometry: (next) => {
      geometry = next;
      if (lastState) syncAirflow(lastState);
    },
  });

  mount.addEventListener("click", (event) => {
    const sceneAction = event.target.closest("[data-scene-action]");
    if (sceneAction) {
      handlers.onSceneAction?.(sceneAction.dataset.sceneAction, sceneAction.dataset.value);
      return;
    }

    const hotspot = event.target.closest("[data-hotspot]");
    if (hotspot) {
      handlers.onHotspot?.(hotspot.dataset.hotspot, hotspot.dataset.kind);
      return;
    }

    const structurePart = event.target.closest("[data-structure-part]");
    if (structurePart) {
      handlers.onStructurePart?.(structurePart.dataset.structurePart);
    }
  });

  function render(state, t) {
    const isSceneVisible =
      state.phase === AppPhase.EXPERIENCE ||
      state.phase === AppPhase.COMPLETION ||
      state.phase === AppPhase.SCANNING;

    mount.className = [
      "scene-mount",
      `mode-${state.mode}`,
      `layer-${state.culturalLayer}`,
      `openings-${state.labControls.openings}`,
      `floor-${state.labControls.floorHeight}`,
      `shade-${state.labControls.roofShade}`,
      isSceneVisible ? "is-active" : "is-muted",
      state.targetFound ? "target-found" : "target-searching",
      state.airflowPlaying || state.culturalLayer === "airflow" ? "airflow-on" : "",
      state.thermalEnabled || state.culturalLayer === "climate" ? "thermal-on" : "",
      state.targetLost ? "target-lost" : "",
      modelReady ? "model-ready" : "",
      modelFailed ? "model-failed" : "",
      state.guidedTour ||
      state.sheet ||
      state.selectedHotspot ||
      state.selectedClimateHotspot ||
      state.selectedStructurePart
        ? "is-focused"
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    mount.innerHTML = `
      <div class="ar-depth" aria-hidden="${isSceneVisible ? "false" : "true"}">
        <div class="tracking-plane"></div>
        ${renderHouse(state)}
        ${renderDiscoverHotspots(state, t)}
        ${renderClimateHotspots(state, t)}
        ${renderStructureLabels(state, t)}
        ${renderCulturalAnnotations(state, t)}
      </div>
    `;

    // Both canvases are kept alive across renders and re-parented into the
    // freshly written markup, so WebGL and particle state survive every update.
    houseModel.sync(mount.querySelector(".model-stage"), {
      visible: isSceneVisible,
      explode: state.mode === AppMode.STRUCTURE ? state.explodedAmount : 0,
      layer: state.culturalLayer,
      thermal: state.thermalEnabled || state.culturalLayer === "climate",
      holdStill: isAirflowVisible(state),
    });

    lastState = state;
    lastTranslator = t;
    syncAirflow(state, isSceneVisible);
  }

  function isAirflowVisible(state) {
    return state.airflowPlaying || state.culturalLayer === "airflow";
  }

  function syncAirflow(state, sceneVisible) {
    const visible =
      (sceneVisible ??
        (state.phase === AppPhase.EXPERIENCE ||
          state.phase === AppPhase.COMPLETION ||
          state.phase === AppPhase.SCANNING)) && isAirflowVisible(state);

    airflowField.sync(mount.querySelector(".airflow-field"), {
      visible,
      stage: state.airflowStep,
      openings: state.labControls.openings,
      floorHeight: state.labControls.floorHeight,
      geometry,
    });
  }

  function destroy() {
    airflowField.destroy();
    houseModel.destroy();
  }

  return { render, destroy };
}

function renderHouse(state) {
  const explode = state.mode === AppMode.STRUCTURE ? state.explodedAmount : 0;

  return `
    <div class="house-model" style="--explode:${explode}">
      <div class="model-shadow" aria-hidden="true"></div>
      <div class="model-stage" aria-hidden="true"></div>
      <div class="xray-grid" aria-hidden="true"></div>
      <div class="shade-veil" aria-hidden="true"></div>
      <div class="thermal-overlay" aria-hidden="true"></div>
      <div class="airflow-field" aria-hidden="true"></div>
    </div>
  `;
}

function renderDiscoverHotspots(state, t) {
  if (state.guidedTour || state.mode !== AppMode.DISCOVER || !state.targetFound) {
    return "";
  }

  return discoverHotspots
    .map((hotspot) => {
      const copy = t(`hotspots.${hotspot.id}`);
      const isSelected = state.selectedHotspot === hotspot.id;
      const callout = isSelected
        ? `
          <div class="hotspot-callout" data-anchor="${hotspot.anchor}" style="--x:${hotspot.x}%;--y:${hotspot.y}%">
            <button type="button" class="callout-close" data-scene-action="clear-focus" aria-label="Close">x</button>
            <span>${copy.eyebrow}</span>
            <strong>${copy.title}</strong>
            <button type="button" data-scene-action="hotspot-learn" data-value="${hotspot.id}">
              Learn more
            </button>
          </div>
        `
        : "";

      return `
        <button
          type="button"
          class="hotspot ${isSelected ? "is-selected" : ""}"
          style="--x:${hotspot.x}%;--y:${hotspot.y}%"
          data-anchor="${hotspot.anchor}"
          data-hotspot="${hotspot.id}"
          data-kind="discover"
          aria-label="${copy.title}"
        >
          <span></span>
        </button>
        ${callout}
      `;
    })
    .join("");
}

function renderClimateHotspots(state, t) {
  if (state.guidedTour || state.mode !== AppMode.CLIMATE || !state.targetFound) {
    return "";
  }

  return climateHotspots
    .map((hotspot) => {
      const copy = t(`climate.hotspots.${hotspot.id}`);
      return `
        <button
          type="button"
          class="hotspot climate-hotspot ${
            state.selectedClimateHotspot === hotspot.id ? "is-selected" : ""
          }"
          style="--x:${hotspot.x}%;--y:${hotspot.y}%"
          data-anchor="${hotspot.anchor}"
          data-hotspot="${hotspot.id}"
          data-kind="climate"
          aria-label="${copy.title}"
        >
          <span></span>
        </button>
      `;
    })
    .join("");
}

function renderStructureLabels(state, t) {
  if (state.guidedTour || state.mode !== AppMode.STRUCTURE || !state.targetFound || state.explodedAmount < 0.18) {
    return "";
  }

  return `
    <div class="structure-labels">
      ${structureParts
        .map(
          (part) => `
            <button
              type="button"
              class="structure-label ${
                state.selectedStructurePart === part.id ? "is-selected" : ""
              }"
              style="--x:${part.x}%;--y:${part.y}%"
              data-anchor="${part.anchor}"
              data-structure-part="${part.id}"
            >
              ${t(part.labelKey)}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderCulturalAnnotations(state, t) {
  const annotations = t(`xray.annotations.${state.culturalLayer}`);
  if (!Array.isArray(annotations) || !state.targetFound) {
    return "";
  }

  const positions = [
    { x: 38, y: 24 },
    { x: 61, y: 47 },
    { x: 45, y: 72 },
  ];

  return `
    <div class="cultural-annotations">
      ${annotations
        .map(
          (label, index) => `
            <span style="--x:${positions[index].x}%;--y:${positions[index].y}%">
              ${label}
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}
