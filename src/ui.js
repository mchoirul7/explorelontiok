import { AppMode, AppPhase } from "./state.js";
import { languages } from "./localization.js";
import { airflowStages, getAirflowStage } from "./airflow.js";
import { QUIZ_BANK_SIZE, resolveQuizQuestions } from "./quiz-bank.js";

const modeOrder = [
  AppMode.DISCOVER,
  AppMode.STRUCTURE,
  AppMode.AIR,
  AppMode.CLIMATE,
];
const pathOrder = ["explore", "guided", "quiz"];
const missionOrder = ["air", "structure", "climate"];
const layerOrder = ["normal", "architecture", "airflow", "climate", "dailyLife", "wisdom"];

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
    root.innerHTML = `${renderForPhase(state, t)}${renderShareSheet(state, t)}`;
  }

  return { render };
}

function renderForPhase(state, t) {
  if (state.phase === AppPhase.OPENING) {
    return renderOpening(state, t);
  }

  if (state.phase === AppPhase.PATHS) {
    return renderLearningPaths(state, t);
  }

  if (state.phase === AppPhase.LAB) {
    return renderInteractiveLab(state, t);
  }

  if (state.phase === AppPhase.QUIZ) {
    return renderQuizScreen(state, t);
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

function renderOpening(state, t) {
  return `
    <section class="opening-screen">
      <div class="opening-scrim"></div>
      ${renderLanguageSelector(state, t, "opening")}
      <div class="opening-copy">
        <p class="eyebrow stagger">${t("opening.eyebrow")}</p>
        <h1 class="stagger">${t("opening.title")}</h1>
        <h2 class="stagger">${t("opening.subtitle")}</h2>
        <p class="opening-description stagger">${t("opening.description")}</p>
        <div class="opening-actions stagger">
          <button type="button" class="primary-action" data-action="begin">
            <span>${t("opening.begin")}</span>
            ${icon("arrowRight")}
          </button>
          <button type="button" class="quiet-action opening-share-action" data-action="open-share" aria-label="${t(
            "share.cta",
          )}">
            ${icon("share")}
            <span>${t("share.cta")}</span>
          </button>
        </div>
        <p class="opening-meta stagger">${t("opening.meta")}</p>
      </div>
      <p class="opening-next">${t("opening.nextHint")}</p>
    </section>
  `;
}

function renderLearningPaths(state, t) {
  return `
    <section class="path-screen">
      <div class="path-scrim"></div>
      ${renderLanguageSelector(state, t, "floating")}
      <button type="button" class="path-back" data-action="back-opening">
        ${icon("arrowLeft")}
        <span>${t("paths.back")}</span>
      </button>
      <div class="path-shell">
        <div class="path-copy">
          <p class="eyebrow">${t("paths.eyebrow")}</p>
          <h1>${t("paths.title")}</h1>
          <p>${t("paths.body")}</p>
        </div>
        <div class="path-menu">
          ${pathOrder
            .map((path, index) => {
              const item = t(`paths.items.${path}`);
              return `
                <button type="button" class="path-option" data-action="select-path" data-value="${path}">
                  <span class="path-index">${String(index + 1).padStart(2, "0")}</span>
                  <span class="path-icon">${icon(
                    path === "guided"
                      ? "route"
                      : path === "lab"
                        ? "target"
                        : path === "quiz"
                          ? "quiz"
                          : "discover",
                  )}</span>
                  <span class="path-text">
                    <strong>${item.label}</strong>
                    <em>${item.title}</em>
                    <small>${item.body}</small>
                  </span>
                  <span class="path-action">${item.action}${icon("arrowRight")}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderInteractiveLab(state, t) {
  const missionId = state.learningMission || "air";
  const mission = t(`lab.missions.${missionId}`);
  const choices = mission.choices || [];
  const selectedChoice = choices.find((choice) => choice.id === state.labAnswer);
  const hasAnswer = Boolean(selectedChoice);

  return `
    <section class="lab-screen">
      <div class="path-scrim"></div>
      ${renderLanguageSelector(state, t, "floating")}
      <button type="button" class="path-back" data-action="back-paths">
        ${icon("arrowLeft")}
        <span>${t("lab.changePath")}</span>
      </button>
      <div class="lab-shell">
        <div class="lab-copy">
          <p class="eyebrow">${t("lab.eyebrow")}</p>
          <h1>${t("lab.title")}</h1>
          <p>${t("lab.body")}</p>
          <span>${mission.modeHint}</span>
        </div>
        <div class="mission-tabs" aria-label="${t("lab.missionsTitle")}">
          ${missionOrder
            .map((id) => {
              const item = t(`lab.missions.${id}`);
              return `
                <button
                  type="button"
                  class="${id === missionId ? "is-active" : ""}"
                  data-action="set-mission"
                  data-value="${id}"
                >
                  ${item.label}
                </button>
              `;
            })
            .join("")}
        </div>
        <div class="lab-question">
          <div>
            <span>${mission.label}</span>
            <h2>${mission.title}</h2>
            <p>${mission.body}</p>
          </div>
          <strong>${mission.question}</strong>
          <div class="answer-grid">
            ${choices
              .map(
                (choice) => `
                  <button
                    type="button"
                    class="answer-choice ${state.labAnswer === choice.id ? "is-selected" : ""} ${
                      state.labAnswer === choice.id && choice.correct ? "is-correct" : ""
                    }"
                    data-action="answer-lab"
                    data-value="${choice.id}"
                  >
                    <span>${choice.title}</span>
                    <small>${choice.body}</small>
                  </button>
                `,
              )
              .join("")}
          </div>
          ${
            hasAnswer
              ? `
                <div class="answer-feedback ${selectedChoice.correct ? "is-correct" : ""}">
                  <strong>${selectedChoice.correct ? t("lab.correct") : t("lab.incorrect")}</strong>
                  <span>${selectedChoice.correct ? mission.insight : selectedChoice.body}</span>
                </div>
              `
              : ""
          }
          <div class="lab-actions">
            <button type="button" class="quiet-action" data-action="back-paths">
              <span>${t("lab.changePath")}</span>
            </button>
            <button type="button" class="primary-action" data-action="start-lab-ar" ${
              state.labSolved ? "" : "disabled"
            }>
              <span>${t("lab.startAr")}</span>
              ${icon("arrowRight")}
            </button>
          </div>
        </div>
      </div>
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
  if (state.learningPath) {
    const path = t(`paths.items.${state.learningPath}`);
    const mission = state.learningPath === "lab" ? t(`lab.missions.${state.learningMission}`) : null;

    return `
      <section class="scan-overlay">
        ${renderLanguageSelector(state, t, "floating")}
        <div class="scan-copy">
          <p>${t("onboarding.title")}</p>
        </div>
        ${renderScanFrame(t, false)}
        ${renderTargetModeSelector(state, t)}
        <div class="onboarding-context">
          <span>${t("onboarding.pathTitle")}</span>
          <strong>${path.label}</strong>
          <p>${mission ? mission.modeHint : t("onboarding.pathBody")}</p>
        </div>
        <div class="journey-choice compact">
          <button type="button" data-action="start-selected-scan">
            <strong>${t("onboarding.startScan")}</strong>
          </button>
          <button type="button" data-action="back-paths">
            <strong>${t("onboarding.changePath")}</strong>
          </button>
        </div>
      </section>
    `;
  }

  return `
    <section class="scan-overlay">
      ${renderLanguageSelector(state, t, "floating")}
      <div class="scan-copy">
        <p>${t("onboarding.title")}</p>
      </div>
      ${renderScanFrame(t, false)}
      ${renderTargetModeSelector(state, t)}
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
      ${renderTargetModeSelector(state, t)}
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

function renderTargetModeSelector(state, t) {
  const activeBody =
    state.targetMode === "real" ? t("target.realBody") : t("target.simulatedBody");

  return `
    <aside class="target-mode-panel">
      <span>${t("target.mode")}</span>
      <div class="target-mode-switch">
        <button
          type="button"
          class="${state.targetMode === "simulated" ? "is-active" : ""}"
          data-action="set-target-mode"
          data-value="simulated"
        >
          ${t("target.simulated")}
        </button>
        <button
          type="button"
          class="${state.targetMode === "real" ? "is-active" : ""}"
          data-action="set-target-mode"
          data-value="real"
        >
          ${t("target.real")}
        </button>
      </div>
      <p>${activeBody}</p>
      <a href="target.html" target="_blank" rel="noopener">${t("target.openTarget")}</a>
      ${state.targetMode === "real" ? `<small>${t("target.realNote")}</small>` : ""}
    </aside>
  `;
}

function renderExperience(state, t) {
  const guidedActive = state.guidedTour && state.phase === AppPhase.EXPERIENCE;
  const focusActive = Boolean(
    state.sheet ||
      state.selectedHotspot ||
      state.selectedStructurePart ||
      state.selectedClimateHotspot,
  );
  const suppressPanels = guidedActive || state.sheet || state.selectedHotspot || state.selectedStructurePart;
  const suppressModeControls =
    suppressPanels || state.layerPanelOpen || state.causeEffectOpen;

  return `
    ${renderTopbar(state, t)}
    ${state.targetConfirmation ? renderTargetFound(t) : ""}
    ${state.targetLost ? renderTargetLost(t) : ""}
    ${focusActive ? renderFocusScrim() : ""}
    ${guidedActive || focusActive ? "" : renderModeBrief(state, t)}
    ${renderGuidedPanel(state, t)}
    ${suppressModeControls ? "" : renderModeControls(state, t)}
    ${suppressPanels ? "" : renderLayerPanel(state, t)}
    ${suppressPanels ? "" : renderCauseEffectPanel(state, t)}
    ${guidedActive ? "" : renderBottomSheet(state, t)}
    ${focusActive ? "" : renderModeDock(state, t)}
  `;
}

function renderFocusScrim() {
  return `<div class="focus-scrim" aria-hidden="true"></div>`;
}

function renderCompletion(state, t) {
  return `
    ${renderTopbar(state, t)}
    <section class="completion-overlay">
      <div class="completion-copy">
        <p class="eyebrow">${t("closing.eyebrow")}</p>
        <h1>${t("closing.title")}</h1>
        <p>${t("closing.body")}</p>
        ${renderLearningSummary(t)}
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
        ${renderLanguageSelector(state, t, "topbar")}
        <button type="button" class="utility-button topbar-menu-button" data-action="toggle-more" aria-label="${t(
          "hud.more",
        )}">
          ${icon("menu")}
        </button>
      </div>
      ${
        state.moreOpen
          ? `
            <div class="more-menu">
              <button type="button" class="mobile-menu-action" data-action="toggle-audio">
                ${icon(state.audioEnabled ? "sound" : "soundOff")}
                <span>${state.audioEnabled ? t("hud.soundOn") : t("hud.soundOff")}</span>
              </button>
              <span class="more-menu-divider"></span>
              <button type="button" class="desktop-menu-action" data-action="start-guided">${icon("route")}<span>${t(
                "hud.guided",
              )}</span></button>
              <button type="button" class="home-menu-action" data-action="reset-experience">${icon("home")}<span>${t(
                "hud.home",
              )}</span></button>
            </div>
          `
          : ""
      }
    </header>
  `;
}

function renderLearningSummary(t) {
  const items = ["discovered", "architecture", "science", "wisdom"];
  return `
    <div class="learning-summary">
      <strong>${t("closing.summaryTitle")}</strong>
      <div>
        ${items
          .map((item) => {
            const copy = t(`closing.summary.${item}`);
            return `
              <article>
                <span>${copy.title}</span>
                <p>${copy.body}</p>
              </article>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderShareSheet(state, t) {
  if (!state.shareOpen) {
    return "";
  }

  const share = getShareData(t);
  const links = getShareLinks(share);

  return `
    <section class="share-overlay" role="dialog" aria-modal="true" aria-label="${t("share.heading")}">
      <button type="button" class="share-backdrop" data-action="close-share" aria-label="${t(
        "share.close",
      )}"></button>
      <aside class="share-sheet">
        <button type="button" class="sheet-close" data-action="close-share" aria-label="${t(
          "share.close",
        )}">
          ${icon("close")}
        </button>
        <div class="share-preview">
          <img src="assets/rumah-lontiok-hero.png" alt="${share.title}" />
          <div>
            <span>${t("share.cta")}</span>
            <h2>${t("share.heading")}</h2>
            <p>${t("share.body")}</p>
          </div>
        </div>
        <div class="share-actions">
          <button type="button" data-action="native-share">
            ${icon("share")}
            <span>${t("share.native")}</span>
          </button>
          <a href="${links.whatsapp}" target="_blank" rel="noopener">
            <b>WA</b>
            <span>${t("share.whatsapp")}</span>
          </a>
          <a href="${links.facebook}" target="_blank" rel="noopener">
            <b>f</b>
            <span>${t("share.facebook")}</span>
          </a>
          <a href="${links.x}" target="_blank" rel="noopener">
            <b>X</b>
            <span>${t("share.x")}</span>
          </a>
          <a href="${links.telegram}" target="_blank" rel="noopener">
            <b>TG</b>
            <span>${t("share.telegram")}</span>
          </a>
          <button type="button" data-action="copy-share">
            ${icon("copy")}
            <span>${state.shareCopied ? t("share.copied") : t("share.copy")}</span>
          </button>
        </div>
        <p class="share-note">${t("share.previewNote")}</p>
      </aside>
    </section>
  `;
}

function getShareData(t) {
  const url =
    typeof window !== "undefined" && window.location
      ? new URL(window.location.pathname || "/", window.location.origin).href
      : "";
  return {
    title: t("share.title"),
    text: t("share.message"),
    url,
  };
}

function getShareLinks({ title, text, url }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${text} ${url}`.trim());
  return {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
  };
}

function renderLanguageSelector(state, t, variant) {
  const activeLanguage = languages.find((language) => language.code === state.language) || languages[0];

  return `
    <div class="language-selector language-selector-${variant} ${
      state.languageMenuOpen ? "is-open" : ""
    }" aria-label="${t("language.label")}">
      <button
        type="button"
        class="language-trigger"
        data-action="toggle-language-menu"
        aria-expanded="${state.languageMenuOpen ? "true" : "false"}"
        aria-label="${t("language.label")}"
      >
        ${icon("language")}
        <span>${activeLanguage.short}</span>
        ${icon("chevronDown")}
      </button>
      <div class="language-options">
        ${languages
          .map(
            (language) => `
              <button
                type="button"
                class="language-choice ${state.language === language.code ? "is-active" : ""}"
                data-action="set-language"
                data-value="${language.code}"
                aria-label="${language.label}"
              >
                ${language.short}
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
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

function renderLayerPanel(state, t) {
  if (!state.layerPanelOpen && state.culturalLayer === "normal") {
    return "";
  }

  const active = t(`xray.layers.${state.culturalLayer}`);
  return `
    <aside class="layer-panel">
      <div class="panel-header">
        <span>${t("xray.eyebrow")}</span>
        <button type="button" data-action="play-layer-sequence">${icon("play")}${t("xray.auto")}</button>
      </div>
      <h2>${active.title}</h2>
      <p>${active.body}</p>
      <div class="layer-rail">
        ${layerOrder
          .map((layer) => {
            const copy = t(`xray.layers.${layer}`);
            return `
              <button
                type="button"
                class="${state.culturalLayer === layer ? "is-active" : ""}"
                data-action="set-layer"
                data-value="${layer}"
              >
                <span>${copy.label}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </aside>
  `;
}

function renderCauseEffectPanel(state, t) {
  if (
    state.sheet ||
    state.selectedHotspot ||
    state.selectedStructurePart ||
    state.selectedClimateHotspot ||
    (!state.causeEffectOpen && state.learningPath !== "lab")
  ) {
    return "";
  }

  return `
    <aside class="cause-panel ${state.mode !== AppMode.DISCOVER ? "is-stacked" : ""}">
      <div class="panel-header">
        <span>${t("causeEffect.eyebrow")}</span>
      </div>
      <h2>${t("causeEffect.title")}</h2>
      <p>${t("causeEffect.body")}</p>
      ${renderLabControlGroup(t, "openings", state.labControls.openings, [
        ["low", t("causeEffect.low")],
        ["medium", t("causeEffect.medium")],
        ["wide", t("causeEffect.wide")],
      ])}
      ${renderLabControlGroup(t, "floorHeight", state.labControls.floorHeight, [
        ["low", t("causeEffect.low")],
        ["raised", t("causeEffect.raised")],
      ])}
      ${renderLabControlGroup(t, "roofShade", state.labControls.roofShade, [
        ["short", t("causeEffect.short")],
        ["deep", t("causeEffect.deep")],
      ])}
      <p class="caption">${t("causeEffect.feedback.openings")}</p>
    </aside>
  `;
}

function renderLabControlGroup(t, key, active, options) {
  return `
    <div class="lab-control">
      <span>${t(`causeEffect.${key}`)}</span>
      <div>
        ${options
          .map(
            ([value, label]) => `
              <button
                type="button"
                class="${active === value ? "is-active" : ""}"
                data-action="set-lab-control"
                data-value="${key}:${value}"
              >
                ${label}
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
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
      ${
        selected
          ? `
            <button type="button" class="panel-close" data-action="clear-focus" aria-label="Close">
              ${icon("close")}
            </button>
          `
          : ""
      }
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

function renderQuizScreen(state, t) {
  const questions = resolveQuizQuestions(state.quizPlan, state.language);
  const total = questions.length;
  const activeIndex = Math.min(state.quizIndex, Math.max(total - 1, 0));
  const question = questions[activeIndex];
  const score = calculateQuizScore(questions, state.quizAnswers);

  if (!question) {
    return "";
  }

  if (state.quizCompleted) {
    return renderQuizCompletion(state, t, questions, score);
  }

  const selectedAnswers = getQuizSelectedAnswers(state, question);
  const hasSelection = selectedAnswers.length > 0;
  const isCorrect = isQuizAnswerCorrect(question, selectedAnswers);
  const timeLimit = question.timeLimit || 30;
  const timerPercent = Math.max(0, Math.min(100, Math.round((state.quizTimeLeft / timeLimit) * 100)));
  const typeLabel = t(`quiz.types.${question.type}`);
  const progress = `${activeIndex + 1} / ${total}`;
  const shuffleNote = String(t("quiz.shuffleNote"))
    .replace("{count}", String(total))
    .replace("{total}", String(QUIZ_BANK_SIZE));
  const answerGridClass = [
    "quiz-answer-grid",
    question.choices.length <= 2 ? "is-binary" : "",
    question.choices.some((choice) => choice.visual) ? "is-visual" : "is-text",
    hasLongChoiceLabels(question.choices) ? "is-stacked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <section class="quiz-screen">
      <div class="path-scrim"></div>
      ${renderLanguageSelector(state, t, "floating")}
      <button type="button" class="path-back" data-action="back-paths">
        ${icon("arrowLeft")}
        <span>${t("quiz.back")}</span>
      </button>
      <div class="quiz-shell">
        <aside class="quiz-status">
          <p class="eyebrow">${t("quiz.eyebrow")}</p>
          <h1>${t("quiz.title")}</h1>
          <p>${t("quiz.body")}</p>
          <p class="quiz-shuffle-note">${shuffleNote}</p>
          <div class="quiz-stat-grid">
            <span><strong>${score}</strong>${t("quiz.score")}</span>
            <span><strong>${progress}</strong>${t("quiz.progress")}</span>
          </div>
          <div class="quiz-timer">
            <div>
              <span>${t("quiz.timer")}</span>
              <strong>00:${String(Math.max(state.quizTimeLeft, 0)).padStart(2, "0")}</strong>
            </div>
            <i><b style="width:${timerPercent}%"></b></i>
          </div>
        </aside>
        <article class="quiz-card">
          <div class="quiz-card-top">
            <span>${typeLabel}</span>
            <strong>${question.points || 1} ${t("quiz.points")}</strong>
          </div>
          ${renderQuizArt(question.visual, question.visualLabel, "question")}
          <div class="quiz-question-copy">
            <h2>${question.prompt}</h2>
            <p>${question.multiple ? t("quiz.selectMultiple") : question.hint || t("quiz.selectOne")}</p>
          </div>
          <div class="${answerGridClass}">
            ${question.choices
              .map((choice, index) =>
                renderQuizAnswerChoice(question, choice, index, selectedAnswers, state.quizSubmitted),
              )
              .join("")}
          </div>
          ${
            state.quizSubmitted
              ? `
                <div class="quiz-feedback ${isCorrect ? "is-correct" : ""}">
                  <strong>${
                    state.quizTimedOut
                      ? t("quiz.timeUp")
                      : isCorrect
                        ? t("quiz.correct")
                        : t("quiz.incorrect")
                  }</strong>
                  <span>${question.feedback}</span>
                </div>
                <div class="quiz-actions">
                  <button type="button" class="primary-action" data-action="next-quiz">
                    <span>${activeIndex >= total - 1 ? t("quiz.finish") : t("quiz.continue")}</span>
                    ${icon("arrowRight")}
                  </button>
                </div>
              `
              : `
                <div class="quiz-actions">
                  <button type="button" class="primary-action" data-action="submit-quiz" ${
                    hasSelection ? "" : "disabled"
                  }>
                    <span>${t("quiz.submit")}</span>
                    ${icon("check")}
                  </button>
                </div>
              `
          }
        </article>
      </div>
    </section>
  `;
}

function renderQuizCompletion(state, t, questions, score) {
  const total = questions.length;
  const totalPoints = calculateQuizTotalPoints(questions);
  const correctCount = calculateQuizCorrectCount(questions, state.quizAnswers);
  const grade = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const gradeTone = grade >= 80 ? "is-strong" : grade >= 60 ? "is-mid" : "is-low";
  const resultMessage =
    grade >= 80 ? t("quiz.resultStrong") : grade >= 60 ? t("quiz.resultGood") : t("quiz.resultRetry");

  return `
    <section class="quiz-screen is-complete">
      <div class="path-scrim"></div>
      ${renderLanguageSelector(state, t, "floating")}
      <button type="button" class="path-back" data-action="back-paths">
        ${icon("arrowLeft")}
        <span>${t("quiz.back")}</span>
      </button>
      <div class="quiz-completion">
        <header class="quiz-result-header">
          <div class="quiz-copy">
            <span>${t("quiz.eyebrow")}</span>
            <h1>${t("quiz.completeTitle")}</h1>
            <p>${resultMessage}</p>
          </div>
          <div class="quiz-grade-card ${gradeTone}">
            <span>${t("quiz.grade")}</span>
            <strong>${grade}</strong>
            <small>${t("quiz.gradeScale")}</small>
            <i><b style="width:${Math.max(0, Math.min(100, grade))}%"></b></i>
          </div>
        </header>
        <div class="quiz-result-grid">
          <article>
            <span>${t("quiz.correctAnswers")}</span>
            <strong>${correctCount} / ${total}</strong>
            <small>${accuracy}% ${t("quiz.accuracy")}</small>
          </article>
          <article>
            <span>${t("quiz.score")}</span>
            <strong>${score} / ${totalPoints}</strong>
            <small>${t("quiz.points")}</small>
          </article>
        </div>
        <div class="quiz-review-panel">
          <div class="quiz-review-title">
            <span>${t("quiz.answerReview")}</span>
            <small>${correctCount} / ${total} ${t("quiz.correctAnswers")}</small>
          </div>
          <div class="quiz-review">
            ${questions
              .map((question, index) => {
                const correct = isQuizAnswerCorrect(question, getQuizSelectedAnswers(state, question));
                return `
                  <span class="${correct ? "is-correct" : ""}">
                    <b>${String(index + 1).padStart(2, "0")}</b>
                    <i>${correct ? icon("check") : icon("close")}</i>
                    <em>${correct ? t("quiz.reviewCorrect") : t("quiz.reviewIncorrect")}</em>
                  </span>
                `;
              })
              .join("")}
          </div>
        </div>
        <div class="quiz-actions">
          <button type="button" class="quiet-action" data-action="restart-quiz">
            <span>${t("quiz.restart")}</span>
          </button>
          <button type="button" class="primary-action" data-action="back-paths">
            <span>${t("quiz.back")}</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderQuizAnswerChoice(question, choice, index, selectedAnswers, submitted) {
  const isSelected = selectedAnswers.includes(choice.id);
  const correctnessClass = submitted
    ? choice.correct
      ? "is-correct"
      : isSelected
        ? "is-wrong"
        : ""
    : "";
  const option = choice.option || String.fromCharCode(65 + index);
  const visualClass = choice.visual ? "is-visual" : "";

  return `
    <button
      type="button"
      class="quiz-answer ${visualClass} ${isSelected ? "is-selected" : ""} ${correctnessClass}"
      data-action="toggle-quiz-answer"
      data-value="${question.id}:${choice.id}"
      ${submitted ? "disabled" : ""}
    >
      <span class="quiz-option">${option}</span>
      ${renderQuizArt(choice.visual, choice.label, "choice")}
      <strong>${choice.label}</strong>
    </button>
  `;
}

function renderQuizArt(visual = "", label = "", size = "choice") {
  if (!visual) {
    return "";
  }

  return `
    <div class="quiz-art quiz-art-${size} art-${visual}" role="img" aria-label="${label || visual}">
      <span></span>
      <i></i>
      <em></em>
    </div>
  `;
}

function hasLongChoiceLabels(choices) {
  return choices.some((choice) => String(choice.label || "").length > 44);
}

function getQuizSelectedAnswers(state, question) {
  const selected = state.quizAnswers[question.id];
  if (Array.isArray(selected)) {
    return selected;
  }
  return selected ? [selected] : [];
}

function calculateQuizScore(questions, answers) {
  return questions.reduce((score, question) => {
    const selected = Array.isArray(answers[question.id])
      ? answers[question.id]
      : answers[question.id]
        ? [answers[question.id]]
        : [];
    return isQuizAnswerCorrect(question, selected) ? score + (question.points || 1) : score;
  }, 0);
}

function calculateQuizCorrectCount(questions, answers) {
  return questions.reduce((count, question) => {
    const selected = Array.isArray(answers[question.id])
      ? answers[question.id]
      : answers[question.id]
        ? [answers[question.id]]
        : [];
    return isQuizAnswerCorrect(question, selected) ? count + 1 : count;
  }, 0);
}

function calculateQuizTotalPoints(questions) {
  return questions.reduce((total, question) => total + (question.points || 1), 0);
}

function isQuizAnswerCorrect(question, selectedAnswers) {
  const correctAnswers = question.choices
    .filter((choice) => choice.correct)
    .map((choice) => choice.id);
  return sameAnswerSet(correctAnswers, selectedAnswers);
}

function sameAnswerSet(correctAnswers, selectedAnswers) {
  if (correctAnswers.length !== selectedAnswers.length) {
    return false;
  }
  return correctAnswers.every((answer) => selectedAnswers.includes(answer));
}

function renderGuidedPanel(state, t) {
  if (!state.guidedTour || state.phase !== AppPhase.EXPERIENCE) {
    return "";
  }

  const steps = t("guided.steps");
  const step = steps[state.guidedStep] || steps[0];
  return `
    <aside class="guided-panel">
      <button type="button" class="panel-close guided-close" data-action="close-guided" aria-label="Close">
        ${icon("close")}
      </button>
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
    quiz:
      '<path d="M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path><path d="M15 3v5h5"></path><path d="M9 12h6"></path><path d="M9 16h4"></path>',
    share:
      '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.6 10.6 6.8-4.2"></path><path d="m8.6 13.4 6.8 4.2"></path>',
    copy:
      '<rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>',
    language: '<path d="M4 5h9"></path><path d="M9 3v2c0 4-2 7-5 9"></path><path d="M6 9c1 2 3 4 6 5"></path><path d="M14 21l4-9 4 9"></path><path d="M15.5 18h5"></path>',
    settings:
      '<path d="M12.22 2h-.44a2 2 0 0 0-2 1.74l-.08.62a2 2 0 0 1-2.9 1.45l-.56-.32a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.53.31a2 2 0 0 1 0 3.46l-.53.31a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.56-.32a2 2 0 0 1 2.9 1.45l.08.62a2 2 0 0 0 2 1.74h.44a2 2 0 0 0 2-1.74l.08-.62a2 2 0 0 1 2.9-1.45l.56.32a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.53-.31a2 2 0 0 1 0-3.46l.53-.31a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.56.32a2 2 0 0 1-2.9-1.45l-.08-.62a2 2 0 0 0-2-1.74Z"></path><circle cx="12" cy="12" r="3"></circle>',
    sound: '<path d="M4 10v4h4l5 4V6L8 10H4Z"></path><path d="M16 9c1 1 1 5 0 6"></path><path d="M19 7c2 3 2 7 0 10"></path>',
    soundOff: '<path d="M4 10v4h4l5 4V6L8 10H4Z"></path><path d="m18 9 4 4"></path><path d="m22 9-4 4"></path>',
    more: '<circle cx="6" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="18" cy="12" r="1"></circle>',
    menu: '<path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v6h6"></path>',
    home: '<path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>',
    play: '<path d="m8 5 11 7-11 7V5Z"></path>',
    chevronDown: '<path d="m6 9 6 6 6-6"></path>',
    layers: '<path d="M12 3 3 8l9 5 9-5-9-5Z"></path><path d="m3 13 9 5 9-5"></path><path d="m3 18 9 5 9-5"></path>',
    sliders: '<path d="M4 6h9"></path><path d="M17 6h3"></path><circle cx="15" cy="6" r="2"></circle><path d="M4 12h3"></path><path d="M11 12h9"></path><circle cx="9" cy="12" r="2"></circle><path d="M4 18h11"></path><path d="M19 18h1"></path><circle cx="17" cy="18" r="2"></circle>',
    target: '<circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M2 12h3"></path><path d="M19 12h3"></path>',
    check: '<path d="m5 12 4 4L19 6"></path>',
    camera:
      '<path d="M4 8a2 2 0 0 1 2-2h2l2-2h4l2 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"></path><circle cx="12" cy="13" r="4"></circle>',
    close: '<path d="M6 6l12 12"></path><path d="M18 6 6 18"></path>',
    route: '<circle cx="6" cy="6" r="2"></circle><circle cx="18" cy="18" r="2"></circle><path d="M8 6h5a3 3 0 0 1 0 6h-2a3 3 0 0 0 0 6h5"></path>',
  };

  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.more}</svg>`;
}
