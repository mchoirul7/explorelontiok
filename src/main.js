import { AppMode, AppPhase, getState, resetState, setState, subscribe } from "./state.js";
import { makeTranslator } from "./localization.js";
import { hotspotModeTarget } from "./hotspots.js";
import { createAudioController } from "./audio.js";
import { startCamera, startTargetScanner, stopCamera, stopTargetScanner } from "./ar.js";
import { createScene } from "./scene.js";
import { createUI } from "./ui.js";

const cameraFeed = document.querySelector("#cameraFeed");
const sceneMount = document.querySelector("#sceneMount");
const uiRoot = document.querySelector("#uiRoot");

const audio = createAudioController();
let loadingTimer = null;
let airflowTimer = null;
let targetConfirmTimer = null;

const scene = createScene(sceneMount, {
  onHotspot: handleHotspot,
  onStructurePart: handleStructurePart,
  onSceneAction: handleSceneAction,
});

const ui = createUI(uiRoot, {
  onAction: handleAction,
  onExplodedInput(value) {
    setState({
      explodedAmount: value,
      selectedStructurePart: null,
      sheet: null,
    });
  },
});

subscribe((state) => {
  const t = makeTranslator(state.language);
  scene.render(state, t);
  ui.render(state, t);
});

window.addEventListener("beforeunload", () => {
  stopCamera();
  audio.dispose();
});

async function beginExperience() {
  clearTimers();
  resetState({
    phase: AppPhase.LOADING,
    audioEnabled: getState().audioEnabled,
    language: getState().language,
  });

  setState({ loadingStep: 0 });
  runLoadingSequence();

  try {
    await startCamera(cameraFeed);
    setState({ cameraReady: true, cameraError: null });
  } catch (error) {
    setState({
      phase: AppPhase.ERROR,
      cameraError: error.message || "Camera access failed.",
    });
  }

  if (getState().audioEnabled) {
    const ready = await audio.setAmbient(true);
    setState({ ambientReady: ready });
  }
}

function runLoadingSequence() {
  let step = 0;
  loadingTimer = window.setInterval(() => {
    step += 1;
    setState({ loadingStep: Math.min(step, 2) });

    if (step >= 2) {
      window.clearInterval(loadingTimer);
      loadingTimer = window.setTimeout(() => {
        if (getState().phase === AppPhase.LOADING) {
          setState({ phase: AppPhase.ONBOARDING });
        }
      }, 520);
    }
  }, 520);
}

function chooseJourney(guidedTour) {
  stopTargetScanner();
  setState({
    phase: AppPhase.SCANNING,
    guidedTour,
    guidedStep: 0,
    mode: AppMode.DISCOVER,
    targetFound: false,
    targetLost: false,
    selectedHotspot: null,
    selectedClimateHotspot: null,
    selectedStructurePart: null,
    sheet: null,
    moreOpen: false,
  });

  startTargetScanner({
    onFound: revealTarget,
  });
}

function revealTarget() {
  setState({
    phase: AppPhase.EXPERIENCE,
    targetFound: true,
    targetLost: false,
    targetConfirmation: true,
    mode: AppMode.DISCOVER,
  });

  window.clearTimeout(targetConfirmTimer);
  targetConfirmTimer = window.setTimeout(() => {
    setState({ targetConfirmation: false });
  }, 1450);

  if (getState().guidedTour) {
    applyGuidedStep(0);
  }
}

function handleAction(name, value) {
  const actions = {
    begin: beginExperience,
    "choose-free": () => chooseJourney(false),
    "choose-guided": () => chooseJourney(true),
    "retry-camera": beginExperience,
    "preview-mode": () => {
      resetState({
        phase: AppPhase.SCANNING,
        cameraReady: false,
        cameraError: null,
        language: getState().language,
        audioEnabled: getState().audioEnabled,
      });
      window.setTimeout(revealTarget, 700);
    },
    "set-mode": () => setMode(value),
    "toggle-language": toggleLanguage,
    "toggle-audio": toggleAudio,
    "toggle-more": () => setState((state) => ({ moreOpen: !state.moreOpen })),
    "reset-experience": () => {
      clearTimers();
      stopCamera();
      audio.stopNarration();
      resetState({
        language: getState().language,
        audioEnabled: getState().audioEnabled,
      });
    },
    "simulate-lost": () =>
      setState({
        targetLost: true,
        targetConfirmation: false,
        moreOpen: false,
      }),
    "dismiss-lost": () => setState({ targetLost: false }),
    "start-airflow": startAirflow,
    listen: playSelectedNarration,
    "hotspot-explore": () => exploreHotspot(value),
    "close-sheet": () => setState({ sheet: null }),
    "guided-prev": () => moveGuided(-1),
    "guided-next": () => moveGuided(1),
    "start-guided": () => {
      setState({
        guidedTour: true,
        guidedStep: 0,
        moreOpen: false,
        phase: AppPhase.EXPERIENCE,
      });
      applyGuidedStep(0);
    },
    "explore-again": () => {
      stopAirflow();
      setState({
        phase: AppPhase.EXPERIENCE,
        guidedTour: false,
        guidedStep: 0,
        mode: AppMode.DISCOVER,
        sheet: null,
        selectedHotspot: null,
        selectedClimateHotspot: null,
        selectedStructurePart: null,
      });
    },
    "learn-more": () => setState({ sheet: "wisdom" }),
  };

  actions[name]?.();
}

function handleSceneAction(name, value) {
  if (name === "hotspot-learn") {
    setState({
      selectedHotspot: value,
      sheet: "hotspot",
    });
  }
}

function handleHotspot(id, kind) {
  if (kind === "climate") {
    setState({
      selectedClimateHotspot: id,
      sheet: null,
    });
    return;
  }

  const state = getState();
  if (state.selectedHotspot === id) {
    setState({ sheet: "hotspot" });
    return;
  }

  setState({
    selectedHotspot: id,
    sheet: null,
  });
}

function handleStructurePart(partId) {
  setState({
    selectedStructurePart: partId,
    sheet: "structure",
  });
}

function setMode(mode) {
  if (!Object.values(AppMode).includes(mode)) {
    return;
  }

  stopAirflow();
  audio.stopNarration();
  setState({
    mode,
    moreOpen: false,
    selectedHotspot: null,
    selectedClimateHotspot: null,
    selectedStructurePart: null,
    sheet: null,
    narration: { playing: false, progress: 0 },
    thermalEnabled: mode === AppMode.CLIMATE,
    explodedAmount: 0,
  });

  if (mode === AppMode.STRUCTURE) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setState({ explodedAmount: 0.72 }));
    });
  }
}

function startAirflow() {
  setMode(AppMode.AIR);
  setState({
    airflowPlaying: true,
    airflowStep: 0,
  });

  window.clearInterval(airflowTimer);
  airflowTimer = window.setInterval(() => {
    setState((state) => ({
      airflowStep: (state.airflowStep + 1) % 3,
    }));
  }, 3300);
}

function stopAirflow() {
  window.clearInterval(airflowTimer);
  airflowTimer = null;
  setState({
    airflowPlaying: false,
    airflowStep: 0,
  });
}

async function toggleAudio() {
  const next = !getState().audioEnabled;
  setState({ audioEnabled: next });
  const ready = await audio.setAmbient(next);
  setState({ ambientReady: ready });
}

function toggleLanguage() {
  setState((state) => ({
    language: state.language === "en" ? "id" : "en",
    moreOpen: false,
  }));
}

function playSelectedNarration() {
  const state = getState();
  const t = makeTranslator(state.language);
  const hotspotId = state.selectedHotspot || "window";
  const copy = t(`hotspots.${hotspotId}`);
  const text = `${copy.title}. ${copy.storyTitle}. ${copy.body}`;

  setState({
    narration: {
      playing: true,
      progress: 0,
      duration: 18,
      label: copy.title,
    },
  });

  audio.playNarration({
    text,
    language: state.language,
    duration: 18,
    onProgress(progress) {
      setState({
        narration: {
          playing: progress < 1,
          progress,
        },
      });
    },
    onEnd() {
      setState({
        narration: {
          playing: false,
          progress: 0,
        },
      });
    },
  });
}

function exploreHotspot(hotspotId) {
  const target = hotspotModeTarget[hotspotId] || AppMode.DISCOVER;
  setMode(target);
  if (target === AppMode.AIR) {
    window.setTimeout(startAirflow, 240);
  }
}

function moveGuided(delta) {
  const next = Math.max(0, Math.min(getState().guidedStep + delta, 5));
  applyGuidedStep(next);
}

function applyGuidedStep(step) {
  const modeForStep = [
    AppMode.DISCOVER,
    AppMode.STRUCTURE,
    AppMode.AIR,
    AppMode.AIR,
    AppMode.CLIMATE,
    AppMode.CLIMATE,
  ][step];

  if (step >= 5) {
    stopAirflow();
    setState({
      guidedStep: step,
      mode: AppMode.CLIMATE,
      thermalEnabled: true,
      phase: AppPhase.COMPLETION,
      sheet: null,
    });
    return;
  }

  setMode(modeForStep);
  setState({
    guidedTour: true,
    guidedStep: step,
    phase: AppPhase.EXPERIENCE,
  });

  if (step === 1) {
    window.setTimeout(() => setState({ explodedAmount: 0.72 }), 220);
  }

  if (step === 3) {
    window.setTimeout(startAirflow, 220);
  }
}

function clearTimers() {
  window.clearInterval(loadingTimer);
  window.clearInterval(airflowTimer);
  window.clearTimeout(targetConfirmTimer);
  loadingTimer = null;
  airflowTimer = null;
  targetConfirmTimer = null;
  stopTargetScanner();
}
