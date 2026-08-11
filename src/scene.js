import { AppMode, AppPhase } from "./state.js";
import { discoverHotspots } from "./hotspots.js";
import { structureParts, getPartMotion } from "./structure.js";
import { climateHotspots } from "./thermal.js";
import { renderAirParticles } from "./airflow.js";

export function createScene(mount, handlers) {
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
      isSceneVisible ? "is-active" : "is-muted",
      state.targetFound ? "target-found" : "target-searching",
      state.airflowPlaying ? "airflow-on" : "",
      state.thermalEnabled ? "thermal-on" : "",
      state.targetLost ? "target-lost" : "",
    ]
      .filter(Boolean)
      .join(" ");

    mount.innerHTML = `
      <div class="ar-depth" aria-hidden="${isSceneVisible ? "false" : "true"}">
        <div class="tracking-plane"></div>
        <div class="model-shadow"></div>
        ${renderHouse(state)}
        ${renderDiscoverHotspots(state, t)}
        ${renderClimateHotspots(state, t)}
        ${renderStructureLabels(state, t)}
      </div>
    `;
  }

  return { render };
}

function renderHouse(state) {
  const explode = state.mode === AppMode.STRUCTURE ? state.explodedAmount : 0;

  return `
    <div class="house-model" style="--explode:${explode}">
      <div class="thermal-overlay" aria-hidden="true"></div>
      <div class="house-part roof" data-part="roof" style="${getPartMotion("roof", explode)}">
        <span class="roof-plane roof-plane-a"></span>
        <span class="roof-plane roof-plane-b"></span>
        <span class="roof-ridge"></span>
      </div>
      <div class="house-part wall front-wall" data-part="frontWall" style="${getPartMotion(
        "frontWall",
        explode,
      )}">
        <span class="timber-line line-a"></span>
        <span class="timber-line line-b"></span>
        <span class="window window-a"></span>
        <span class="window window-b"></span>
        <span class="door"></span>
      </div>
      <div class="house-part wall side-walls" data-part="sideWalls" style="${getPartMotion(
        "sideWalls",
        explode,
      )}">
        <span class="timber-line line-c"></span>
        <span class="window window-c"></span>
      </div>
      <div class="house-part floor" data-part="floor" style="${getPartMotion("floor", explode)}">
        <span class="floor-beam beam-a"></span>
        <span class="floor-beam beam-b"></span>
      </div>
      <div class="house-part foundation" data-part="foundation" style="${getPartMotion(
        "foundation",
        explode,
      )}">
        <span class="post post-a"></span>
        <span class="post post-b"></span>
        <span class="post post-c"></span>
        <span class="post post-d"></span>
      </div>
      <div class="airflow-field" aria-hidden="true">${state.airflowPlaying ? renderAirParticles() : ""}</div>
    </div>
  `;
}

function renderDiscoverHotspots(state, t) {
  if (state.mode !== AppMode.DISCOVER || !state.targetFound) {
    return "";
  }

  return discoverHotspots
    .map((hotspot) => {
      const copy = t(`hotspots.${hotspot.id}`);
      const isSelected = state.selectedHotspot === hotspot.id;
      const callout = isSelected
        ? `
          <div class="hotspot-callout" style="--x:${hotspot.x}%;--y:${hotspot.y}%">
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
  if (state.mode !== AppMode.CLIMATE || !state.targetFound) {
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
  if (state.mode !== AppMode.STRUCTURE || !state.targetFound || state.explodedAmount < 0.18) {
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
