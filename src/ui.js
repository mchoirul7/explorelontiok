import { AppMode, AppPhase } from "./state.js";
import { airflowStages, getAirflowStage } from "./airflow.js";

const modeOrder = [AppMode.DISCOVER, AppMode.STRUCTURE, AppMode.AIR, AppMode.CLIMATE];

export function createUI(root, handlers) {
  root.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) {
      return;
    }

    const { action: name, value } = action.dataset;
    handlers.onAction?.(name, value);
  });

  root.addEventListener("input", (event) => {
    if (event.target.matches("[data-input='exploded']")) {
      handlers.onExplodedInput?.(Number(event.target.value) / 100);
    }
  });

  function render(state, t) {
    document.documentElement.lang = state.language;
    root.innerHTML = renderForPhase(state, t);
  }

  return { render };
}

function renderForPhase(state, t) {
  if (state.phase === AppPhase.OPENING) {
    return renderOpening(t);
  }

  if (state.phase === AppPhase.LOADING) {
    return renderLoading(state, t);
  }

  if (state.phase === AppPhase.ONBOARDING) {
    return renderOnboarding(state, t);
  }

  if (state.phase === AppPhase.SCANNING) {
    return renderScanning(state, t);
  }

  if (state.phase === AppPhase.ERROR) {
    return renderError(state, t);
  }

  if (state.phase === AppPhase.COMPLETION) {
    return renderCompletion(state, t);
  }

  return renderExperience(state, t);
}

function renderOpening(t) {
  return `
    <section class="opening-screen">
      <div class="opening-scrim"></div>
      <div class="opening-copy">
        <p class="eyebrow stagger">${t("opening.eyebrow")}</p>
        <h1 class="stagger">${t("opening.title")}</h1>
        <h2 class="stagger">${t("opening.subtitle")}</h2>
        <p class="opening-description stagger">${t("opening.description")}</p>
        <button type="button" class="primary-action stagger" data-action="begin">
          <span>${t("opening.begin")}</span>
          ${icon("arrowRight")}
        </button>
        <p class="opening-meta stagger">${t("opening.meta")}</p>
      </div>
      <p class="opening-next">${t("opening.nextHint")}</p>
    </section>
  `;
}

function renderLoading(state, t) {
  const tasks = t("loading.tasks");
  return `
    <section class="loading-screen">
      <div class="loading-mark">
        <p>${t("loading.title")}</p>
        <h1>${t("loading.subtitle")}</h1>
        <div class="loading-line"><span style="width:${Math.min((state.loadingStep + 1) * 34, 100)}%"></span></div>
        <ul>
          ${tasks
            .map(
              (task, index) => `
                <li class="${state.loadingStep >= index ? "is-done" : ""}">
                  <span></span>${task}
                </li>
              `,
            )
            .join("")}
        </ul>
      </div>
    </section>
  `;
}

function renderOnboarding(state, t) {
  return `
    <section class="scan-overlay">
      <div class="scan-copy">
        <p>${t("onboarding.title")}</p>
      </div>
      ${renderScanFrame(t, false)}
      <div class="journey-choice">
        <button type="button" data-action="choose-free">
          <strong>${t("onboarding.free")}</strong>
        </button>
        <button type="button" data-action="choose-guided">
          <strong>${t("onboarding.guided")}</strong>
          <span>${t("onboarding.guidedTime")}</span>
        </button>
      </div>
    </section>
  `;
}

function renderScanning(state, t) {
  return `
    <section class="scan-overlay is-searching">
      ${renderTopbar(state, t)}
      ${renderScanFrame(t, true)}
    </section>
  `;
}

function renderScanFrame(t, searching) {
  return `
    <div class="scan-frame" aria-label="${t("onboarding.findTitle")}">
      <span class="corner corner-a"></span>
      <span class="corner corner-b"></span>
      <span class="corner corner-c"></span>
      <span class="corner corner-d"></span>
      <div class="scan-line"></div>
      <div class="scan-instruction">
        ${icon("target")}
        <strong>${t("onboarding.findTitle")}</strong>
        <span>${t("onboarding.findBody")}</span>
      </div>
      <p>${searching ? t("onboarding.searching") : ""}</p>
    </div>
  `;
}

function renderError(state, t) {
  const title = state.cameraError ? t("error.cameraTitle") : t("error.targetTitle");
  const body = state.cameraError ? t("error.cameraBody") : t("error.targetBody");

  return `
    <section class="message-screen">
      <div class="message-copy">
        ${icon("camera")}
        <h1>${title}</h1>
        <p>${body}</p>
        <div class="message-actions">
          <button type="button" class="primary-action" data-action="retry-camera">
            <span>${t("error.retry")}</span>
          </button>
          <button type="button" class="quiet-action" data-action="preview-mode">
            <span>${t("error.preview")}</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderExperience(state, t) {
  return `
    ${renderTopbar(state, t)}
    ${state.targetConfirmation ? renderTargetFound(t) : ""}
    ${state.targetLost ? renderTargetLost(t) : ""}
    ${renderModeBrief(state, t)}
    ${renderGuidedPanel(state, t)}
    ${renderModeControls(state, t)}
    ${renderBottomSheet(state, t)}
    ${renderModeDock(state, t)}
  `;
}

function renderCompletion(state, t) {
  return `
    ${renderTopbar(state, t)}
    <section class="completion-overlay">
      <div class="completion-copy">
        <p class="eyebrow">${t("closing.eyebrow")}</p>
        <h1>${t("closing.title")}</h1>
        <p>${t("closing.body")}</p>
        <div class="completion-actions">
          <button type="button" class="primary-action" data-action="explore-again">
            <span>${t("closing.exploreAgain")}</span>
          </button>
          <button type="button" class="quiet-action" data-action="learn-more">
            <span>${t("closing.learnMore")}</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderTopbar(state, t) {
  return `
    <header class="topbar">
      <div class="brand-surface">
        <strong>Rumah Lontiok</strong>
        <span>${t("hud.place")}</span>
      </div>
      <div class="utility-cluster">
        <button type="button" class="utility-button" data-action="toggle-language" aria-label="${t(
          "hud.language",
        )}">
          ${icon("language")}
          <span>${state.language.toUpperCase()}</span>
        </button>
        <button type="button" class="utility-button" data-action="toggle-audio" aria-label="${
          state.audioEnabled ? t("hud.soundOn") : t("hud.soundOff")
        }">
          ${icon(state.audioEnabled ? "sound" : "soundOff")}
        </button>
        <button type="button" class="utility-button" data-action="toggle-more" aria-label="${t(
          "hud.more",
        )}">
          ${icon("more")}
        </button>
      </div>
      ${
        state.moreOpen
          ? `
            <div class="more-menu">
              <button type="button" data-action="start-guided">${icon("route")}<span>${t(
                "hud.guided",
              )}</span></button>
              <button type="button" data-action="simulate-lost">${icon("target")}<span>${t(
                "hud.imageLost",
              )}</span></button>
              <button type="button" data-action="reset-experience">${icon("reset")}<span>${t(
                "hud.reset",
              )}</span></button>
            </div>
          `
          : ""
      }
    </header>
  `;
}

function renderTargetFound(t) {
  return `
    <div class="target-confirmation">
      ${icon("check")}
      <span>${t("hud.targetFound")}</span>
    </div>
  `;
}

function renderTargetLost(t) {
  return `
    <div class="lost-banner">
      <div>
        <strong>${t("hud.targetLost")}</strong>
        <span>${t("hud.targetLostBody")}</span>
      </div>
      <button type="button" data-action="dismiss-lost">${t("hud.dismiss")}</button>
    </div>
  `;
}

function renderModeBrief(state, t) {
  if (state.mode === AppMode.DISCOVER) {
    return "";
  }

  const mode = t(`modes.${state.mode}`);
  return `
    <aside class="mode-brief">
      <span>${mode.title}</span>
      <p>${mode.body}</p>
    </aside>
  `;
}

function renderModeControls(state, t) {
  if (state.mode === AppMode.STRUCTURE) {
    return renderStructurePanel(state, t);
  }

  if (state.mode === AppMode.AIR) {
    return renderAirPanel(state, t);
  }

  if (state.mode === AppMode.CLIMATE) {
    return renderClimatePanel(state, t);
  }

  return "";
}

function renderStructurePanel(state, t) {
  return `
    <aside class="mode-panel structure-panel">
      <div class="panel-header">
        <span>${t("structure.assembly")}</span>
      </div>
      <label class="assembly-slider">
        <span>${t("structure.whole")}</span>
        <input
          type="range"
          min="0"
          max="100"
          value="${Math.round(state.explodedAmount * 100)}"
          data-input="exploded"
          aria-label="${t("structure.assembly")}"
        />
        <span>${t("structure.exploded")}</span>
      </label>
    </aside>
  `;
}

function renderAirPanel(state, t) {
  const activeStage = getAirflowStage(state.airflowStep);
  const stages = t("airflow.stages");

  return `
    <aside class="mode-panel air-panel">
      ${
        state.airflowPlaying
          ? `
            <div class="air-stage">
              <span>${stages[state.airflowStep % stages.length].index}</span>
              <strong>${t(activeStage.key)}</strong>
            </div>
            <div class="air-timeline" aria-hidden="true">
              ${airflowStages
                .map(
                  (_, index) => `
                    <span class="${index === state.airflowStep % airflowStages.length ? "is-active" : ""}">
                      ${stages[index].index}
                    </span>
                  `,
                )
                .join("")}
            </div>
          `
          : `
            <div class="air-intro">
              <span>${t("modes.air.title")}</span>
              <h2>${t("modes.air.body")}</h2>
              <button type="button" class="primary-action" data-action="start-airflow">
                <span>${t("airflow.start")}</span>
                ${icon("play")}
              </button>
            </div>
          `
      }
      <p class="caption">${t("airflow.caption")}</p>
    </aside>
  `;
}

function renderClimatePanel(state, t) {
  const selected = state.selectedClimateHotspot
    ? t(`climate.hotspots.${state.selectedClimateHotspot}`)
    : null;

  return `
    <aside class="mode-panel climate-panel">
      <div class="thermal-legend">
        <span>${t("climate.legendCool")}</span>
        <div><i></i></div>
        <span>${t("climate.legendWarm")}</span>
      </div>
      ${
        selected
          ? `
            <div class="thermal-note">
              <strong>${selected.title}</strong>
              <p>${selected.body}</p>
            </div>
          `
          : ""
      }
      <p class="caption">${t("climate.disclaimer")}</p>
    </aside>
  `;
}

function renderGuidedPanel(state, t) {
  if (!state.guidedTour || state.phase !== AppPhase.EXPERIENCE) {
    return "";
  }

  const steps = t("guided.steps");
  const step = steps[state.guidedStep] || steps[0];
  return `
    <aside class="guided-panel">
      <span>${String(state.guidedStep + 1).padStart(2, "0")} / ${String(steps.length).padStart(
        2,
        "0",
      )}</span>
      <h2>${step.title}</h2>
      <p>${step.body}</p>
      <div class="guided-actions">
        <button type="button" data-action="guided-prev" ${state.guidedStep === 0 ? "disabled" : ""}>
          ${icon("arrowLeft")}
          <span>${t("guided.previous")}</span>
        </button>
        <button type="button" data-action="guided-next">
          <span>${t("guided.continue")}</span>
          ${icon("arrowRight")}
        </button>
      </div>
    </aside>
  `;
}

function renderBottomSheet(state, t) {
  if (!state.sheet) {
    return "";
  }

  if (state.sheet === "hotspot" && state.selectedHotspot) {
    const copy = t(`hotspots.${state.selectedHotspot}`);
    return `
      <aside class="bottom-sheet">
        <button type="button" class="sheet-close" data-action="close-sheet" aria-label="Close">
          ${icon("close")}
        </button>
        <p class="eyebrow">${copy.title}</p>
        <h2>${copy.storyTitle}</h2>
        <p>${copy.body}</p>
        ${renderNarration(state, t)}
        <div class="sheet-actions">
          <button type="button" data-action="listen">${icon("sound")}<span>${copy.listen}</span></button>
          <button type="button" data-action="hotspot-explore" data-value="${state.selectedHotspot}">
            <span>${copy.explore}</span>${icon("arrowRight")}
          </button>
        </div>
      </aside>
    `;
  }

  if (state.sheet === "structure" && state.selectedStructurePart) {
    const copy = t(`structure.parts.${state.selectedStructurePart}`);
    return `
      <aside class="bottom-sheet">
        <button type="button" class="sheet-close" data-action="close-sheet" aria-label="Close">
          ${icon("close")}
        </button>
        <p class="eyebrow">${t(`structure.labels.${state.selectedStructurePart}`)}</p>
        <h2>${copy.title}</h2>
        <p>${copy.body}</p>
      </aside>
    `;
  }

  if (state.sheet === "wisdom") {
    return `
      <aside class="bottom-sheet">
        <button type="button" class="sheet-close" data-action="close-sheet" aria-label="Close">
          ${icon("close")}
        </button>
        <p class="eyebrow">${t("closing.eyebrow")}</p>
        <h2>${t("closing.title")}</h2>
        <p>${t("closing.body")}</p>
      </aside>
    `;
  }

  return "";
}

function renderNarration(state, t) {
  if (!state.narration.playing) {
    return "";
  }

  const remaining = Math.max(
    0,
    Math.ceil(state.narration.duration - state.narration.duration * state.narration.progress),
  );

  return `
    <div class="narration-progress">
      <span>${t("audio.narration")} 00:${String(remaining).padStart(2, "0")}</span>
      <div class="waveform" style="--progress:${Math.round(state.narration.progress * 100)}%">
        ${Array.from({ length: 18 }, (_, index) => `<i style="--h:${20 + (index % 5) * 12}%"></i>`).join("")}
      </div>
    </div>
  `;
}

function renderModeDock(state, t) {
  return `
    <nav class="mode-dock" aria-label="Experience navigation">
      <span class="dock-current">${t(`modes.${state.mode}.label`)}</span>
      <div>
        ${modeOrder
          .map((mode) => {
            const copy = t(`modes.${mode}`);
            return `
              <button
                type="button"
                class="${state.mode === mode ? "is-active" : ""}"
                data-action="set-mode"
                data-value="${mode}"
                aria-label="${copy.label}"
              >
                ${icon(mode)}
                <span>${copy.label}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </nav>
  `;
}

function icon(name) {
  const icons = {
    arrowRight: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
    arrowLeft: '<path d="M19 12H5"></path><path d="m11 18-6-6 6-6"></path>',
    discover:
      '<circle cx="12" cy="12" r="8"></circle><path d="m14.5 9.5-1.7 3.3-3.3 1.7 1.7-3.3 3.3-1.7Z"></path>',
    structure: '<path d="M12 3 4 7l8 4 8-4-8-4Z"></path><path d="m4 12 8 4 8-4"></path><path d="m4 17 8 4 8-4"></path>',
    air: '<path d="M4 9h10a3 3 0 1 0-3-3"></path><path d="M4 14h14a3 3 0 1 1-3 3"></path>',
    climate:
      '<path d="M14 14.76V5a2 2 0 1 0-4 0v9.76a4 4 0 1 0 4 0Z"></path><path d="M12 18v-6"></path>',
    language: '<path d="M4 5h9"></path><path d="M9 3v2c0 4-2 7-5 9"></path><path d="M6 9c1 2 3 4 6 5"></path><path d="M14 21l4-9 4 9"></path><path d="M15.5 18h5"></path>',
    sound: '<path d="M4 10v4h4l5 4V6L8 10H4Z"></path><path d="M16 9c1 1 1 5 0 6"></path><path d="M19 7c2 3 2 7 0 10"></path>',
    soundOff: '<path d="M4 10v4h4l5 4V6L8 10H4Z"></path><path d="m18 9 4 4"></path><path d="m22 9-4 4"></path>',
    more: '<circle cx="6" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="18" cy="12" r="1"></circle>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v6h6"></path>',
    play: '<path d="m8 5 11 7-11 7V5Z"></path>',
    target: '<circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path>',
    check: '<path d="m5 12 4 4L19 6"></path>',
    camera:
      '<path d="M4 8a2 2 0 0 1 2-2h2l2-2h4l2 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"></path><circle cx="12" cy="13" r="4"></circle>',
    close: '<path d="M6 6l12 12"></path><path d="M18 6 6 18"></path>',
    route: '<circle cx="6" cy="6" r="2"></circle><circle cx="18" cy="18" r="2"></circle><path d="M8 6h5a3 3 0 0 1 0 6h-2a3 3 0 0 0 0 6h5"></path>',
  };

  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.more}</svg>`;
}
