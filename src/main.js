import { AppMode, AppPhase, getState, resetState, setState, subscribe } from "./state.js";
import { languages, makeTranslator } from "./localization.js";
import { hotspotModeTarget } from "./hotspots.js";
import { createAudioController } from "./audio.js";
import { startCamera, startTargetScanner, stopCamera, stopTargetScanner } from "./ar.js";
import { createScene } from "./scene.js";
import { createUI } from "./ui.js";
import { createQuizPlan, resolveQuizQuestions } from "./quiz-bank.js";

const cameraFeed = document.querySelector("#cameraFeed");
const sceneMount = document.querySelector("#sceneMount");
const uiRoot = document.querySelector("#uiRoot");

const audio = createAudioController();
let loadingTimer = null;
let airflowTimer = null;
let targetConfirmTimer = null;
let quizTimer = null;
let layerTimers = [];

const missionMode = {
  air: AppMode.AIR,
  structure: AppMode.STRUCTURE,
  climate: AppMode.CLIMATE,
};

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

syncShareMetadata();

subscribe((state) => {
  const t = makeTranslator(state.language);
  scene.render(state, t);
  ui.render(state, t);
});

window.addEventListener("beforeunload", () => {
  stopCamera();
  audio.dispose();
});

async function beginExperience(options = {}) {
  const current = getState();
  clearTimers();
  resetState({
    phase: AppPhase.LOADING,
    audioEnabled: current.audioEnabled,
    language: current.language,
    guidedTour: Boolean(options.guidedTour),
    learningPath: options.learningPath ?? current.learningPath ?? "explore",
    learningMission: options.learningMission ?? current.learningMission ?? "air",
    labSolved: Boolean(options.labSolved ?? current.labSolved),
    targetMode: options.targetMode ?? current.targetMode ?? "simulated",
    labControls: { ...current.labControls },
    discovered: [...current.discovered],
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
  const current = getState();
  stopTargetScanner();
  setState({
    phase: AppPhase.SCANNING,
    guidedTour,
    learningPath: current.learningPath,
    learningMission: current.learningMission,
    labSolved: current.labSolved,
    targetMode: current.targetMode,
    labControls: { ...current.labControls },
    discovered: [...current.discovered],
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
    mode: getState().targetMode,
    onFound: revealTarget,
  });
}

function revealTarget() {
  const current = getState();
  const initialMode =
    current.learningPath === "lab"
      ? missionMode[current.learningMission] || AppMode.DISCOVER
      : AppMode.DISCOVER;

  setState({
    phase: AppPhase.EXPERIENCE,
    targetFound: true,
    targetLost: false,
    targetConfirmation: true,
    languageMenuOpen: false,
    mode: initialMode,
    causeEffectOpen: current.learningPath === "lab",
    thermalEnabled: initialMode === AppMode.CLIMATE,
    explodedAmount: 0,
  });

  if (initialMode === AppMode.STRUCTURE) {
    window.setTimeout(() => setState({ explodedAmount: 0.72 }), 240);
  }

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
    begin: () =>
      setState({
        phase: AppPhase.PATHS,
        moreOpen: false,
        languageMenuOpen: false,
      }),
    "back-opening": () =>
      resetState({
        language: getState().language,
        audioEnabled: getState().audioEnabled,
      }),
    "back-paths": () => {
      clearQuizTimer();
      setState({
        phase: AppPhase.PATHS,
        labAnswer: null,
        labSolved: false,
        quizSubmitted: false,
        quizTimedOut: false,
        quizCompleted: false,
        quizTimeLeft: 0,
        languageMenuOpen: false,
      });
    },
    "select-path": () => selectPath(value),
    "set-mission": () =>
      setState({
        learningMission: value,
        labAnswer: null,
        labSolved: false,
      }),
    "answer-lab": () => answerLab(value),
    "start-lab-ar": () => {
      if (getState().labSolved) {
        beginExperience({
          guidedTour: false,
          learningPath: "lab",
          learningMission: getState().learningMission,
          labSolved: true,
          targetMode: getState().targetMode,
        });
      }
    },
    "start-selected-scan": () => chooseJourney(getState().guidedTour),
    "choose-free": () => chooseJourney(false),
    "choose-guided": () => chooseJourney(true),
    "retry-camera": () =>
      beginExperience({
        guidedTour: getState().guidedTour,
        learningPath: getState().learningPath,
        learningMission: getState().learningMission,
        labSolved: getState().labSolved,
        targetMode: getState().targetMode,
      }),
    "preview-mode": () => {
      resetState({
        phase: AppPhase.SCANNING,
        cameraReady: false,
        cameraError: null,
        language: getState().language,
        audioEnabled: getState().audioEnabled,
        guidedTour: getState().guidedTour,
        learningPath: getState().learningPath,
        learningMission: getState().learningMission,
        labSolved: getState().labSolved,
        targetMode: getState().targetMode,
        labControls: { ...getState().labControls },
        discovered: [...getState().discovered],
      });
      window.setTimeout(revealTarget, 700);
    },
    "set-mode": () => setMode(value),
    "set-target-mode": () => setTargetMode(value),
    "toggle-layers": () =>
      setState((state) => ({
        layerPanelOpen: !state.layerPanelOpen,
        moreOpen: false,
        culturalLayer: state.layerPanelOpen ? state.culturalLayer : "architecture",
      })),
    "set-layer": () => setCulturalLayer(value),
    "play-layer-sequence": playLayerSequence,
    "toggle-cause-effect": () =>
      setState((state) => ({
        causeEffectOpen: !state.causeEffectOpen,
        moreOpen: false,
      })),
    "set-lab-control": () => setLabControl(value),
    "toggle-quiz-answer": () => toggleQuizAnswer(value),
    "submit-quiz": () => submitQuiz(false),
    "next-quiz": nextQuiz,
    "restart-quiz": restartQuiz,
    "open-share": () =>
      setState({
        shareOpen: true,
        shareCopied: false,
        moreOpen: false,
        languageMenuOpen: false,
      }),
    "close-share": () =>
      setState({
        shareOpen: false,
        shareCopied: false,
      }),
    "native-share": nativeShare,
    "copy-share": copyShare,
    "toggle-language-menu": () =>
      setState((state) => ({
        languageMenuOpen: !state.languageMenuOpen,
        moreOpen: false,
        shareOpen: false,
      })),
    "set-language": () => setLanguage(value),
    "toggle-audio": toggleAudio,
    "toggle-more": () =>
      setState((state) => ({
        moreOpen: !state.moreOpen,
        languageMenuOpen: false,
      })),
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
    "close-sheet": clearFocus,
    "guided-prev": () => moveGuided(-1),
    "guided-next": () => moveGuided(1),
    "close-guided": closeGuided,
    "clear-focus": clearFocus,
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
        culturalLayer: "normal",
        layerPanelOpen: false,
        causeEffectOpen: false,
        shareOpen: false,
      });
    },
    "learn-more": () => setState({ sheet: "wisdom" }),
  };

  actions[name]?.();
}

function selectPath(path) {
  if (path === "lab") {
    setState({
      phase: AppPhase.LAB,
      learningPath: "lab",
      learningMission: getState().learningMission || "air",
      labAnswer: null,
      labSolved: false,
      languageMenuOpen: false,
    });
    return;
  }

  if (path === "quiz") {
    startQuizScreen();
    return;
  }

  beginExperience({
    guidedTour: path === "guided",
    learningPath: path,
    learningMission: getState().learningMission,
    targetMode: getState().targetMode,
  });
}

function setTargetMode(targetMode) {
  if (!["simulated", "real"].includes(targetMode)) {
    return;
  }

  setState({ targetMode });
}

function answerLab(answerId) {
  const state = getState();
  const correctAnswer = {
    air: "opposite-openings",
    structure: "ground-moisture",
    climate: "shade-airflow",
  }[state.learningMission];

  setState({
    labAnswer: answerId,
    labSolved: answerId === correctAnswer,
  });
}

function startQuizScreen() {
  const current = getState();
  clearTimers();
  stopCamera();
  audio.stopNarration();
  const quizPlan = createQuizPlan();
  const firstQuestion = resolveQuizQuestions(quizPlan, current.language)[0];

  setState({
    phase: AppPhase.QUIZ,
    learningPath: "quiz",
    language: current.language,
    audioEnabled: current.audioEnabled,
    quizPlan,
    quizIndex: 0,
    quizAnswers: {},
    quizSubmitted: false,
    quizTimedOut: false,
    quizCompleted: false,
    quizTimeLeft: firstQuestion?.timeLimit || 30,
    targetFound: false,
    targetLost: false,
    targetConfirmation: false,
    cameraReady: false,
    moreOpen: false,
    languageMenuOpen: false,
  });

  startQuizTimer();
}

function toggleQuizAnswer(value) {
  if (!value || !value.includes(":")) {
    return;
  }

  const state = getState();
  if (state.quizSubmitted || state.quizCompleted || state.phase !== AppPhase.QUIZ) {
    return;
  }

  const [questionId, choiceId] = value.split(":");
  const questions = getQuizQuestions();
  const question = questions.find((item) => item.id === questionId);
  if (!question?.choices.some((choice) => choice.id === choiceId)) {
    return;
  }

  markDiscovered("quiz");
  setState((state) => ({
    quizAnswers: {
      ...state.quizAnswers,
      [questionId]: getNextQuizSelection(question, state.quizAnswers[questionId], choiceId),
    },
  }));
}

function submitQuiz(timedOut) {
  const state = getState();
  if (state.phase !== AppPhase.QUIZ || state.quizSubmitted || state.quizCompleted) {
    return;
  }

  clearQuizTimer();
  setState({
    quizSubmitted: true,
    quizTimedOut: Boolean(timedOut),
  });
}

function nextQuiz() {
  const questions = getQuizQuestions();
  if (questions.length === 0) {
    return;
  }

  if (getState().quizIndex >= questions.length - 1) {
    clearQuizTimer();
    setState({
      quizCompleted: true,
      quizSubmitted: false,
      quizTimedOut: false,
      quizTimeLeft: 0,
    });
    return;
  }

  const nextIndex = getState().quizIndex + 1;
  const nextQuestion = questions[nextIndex];
  setState((state) => ({
    quizIndex: nextIndex,
    quizSubmitted: false,
    quizTimedOut: false,
    quizTimeLeft: nextQuestion?.timeLimit || 30,
  }));
  startQuizTimer();
}

function restartQuiz() {
  clearQuizTimer();
  const quizPlan = createQuizPlan();
  const questions = resolveQuizQuestions(quizPlan, getState().language);
  setState({
    phase: AppPhase.QUIZ,
    learningPath: "quiz",
    quizPlan,
    quizIndex: 0,
    quizAnswers: {},
    quizSubmitted: false,
    quizTimedOut: false,
    quizCompleted: false,
    quizTimeLeft: questions[0]?.timeLimit || 30,
  });
  startQuizTimer();
}

function getQuizQuestions(language = getState().language) {
  return resolveQuizQuestions(getState().quizPlan, language);
}

function getNextQuizSelection(question, currentSelection, choiceId) {
  if (!question.multiple && question.type !== "multi") {
    return [choiceId];
  }

  const selected = Array.isArray(currentSelection)
    ? currentSelection
    : currentSelection
      ? [currentSelection]
      : [];
  return selected.includes(choiceId)
    ? selected.filter((id) => id !== choiceId)
    : [...selected, choiceId];
}

function startQuizTimer() {
  clearQuizTimer();
  quizTimer = window.setInterval(() => {
    const state = getState();
    if (state.phase !== AppPhase.QUIZ || state.quizSubmitted || state.quizCompleted) {
      clearQuizTimer();
      return;
    }

    if (state.quizTimeLeft <= 1) {
      setState({ quizTimeLeft: 0 });
      submitQuiz(true);
      return;
    }

    setState({ quizTimeLeft: state.quizTimeLeft - 1 });
  }, 1000);
}

function clearQuizTimer() {
  window.clearInterval(quizTimer);
  quizTimer = null;
}

function handleSceneAction(name, value) {
  if (name === "clear-focus") {
    clearFocus();
    return;
  }

  if (name === "hotspot-learn") {
    setState({
      selectedHotspot: value,
      sheet: "hotspot",
    });
  }
}

function handleHotspot(id, kind) {
  if (kind === "climate") {
    if (getState().selectedClimateHotspot === id) {
      clearFocus();
      return;
    }

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
  markDiscovered(mode);
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

function clearFocus() {
  audio.stopNarration();
  setState({
    selectedHotspot: null,
    selectedClimateHotspot: null,
    selectedStructurePart: null,
    sheet: null,
    narration: { playing: false, progress: 0 },
  });
}

function setCulturalLayer(layer) {
  const validLayers = ["normal", "architecture", "airflow", "climate", "dailyLife", "wisdom"];
  if (!validLayers.includes(layer)) {
    return;
  }

  clearLayerTimers();
  markDiscovered(layer);
  setState({
    culturalLayer: layer,
    layerPanelOpen: true,
    moreOpen: false,
    airflowPlaying: layer === "airflow" ? true : getState().airflowPlaying,
    thermalEnabled: layer === "climate" ? true : getState().mode === AppMode.CLIMATE,
  });
}

function playLayerSequence() {
  clearLayerTimers();
  const layers = ["normal", "architecture", "airflow", "climate", "dailyLife", "wisdom"];
  setState({
    layerPanelOpen: true,
    moreOpen: false,
  });

  layers.forEach((layer, index) => {
    const timer = window.setTimeout(() => {
      markDiscovered(layer);
      setState({
        culturalLayer: layer,
        airflowPlaying: layer === "airflow",
        thermalEnabled: layer === "climate" || getState().mode === AppMode.CLIMATE,
      });
    }, index * 1150);
    layerTimers.push(timer);
  });
}

function setLabControl(value) {
  const [key, setting] = value.split(":");
  const valid = {
    openings: ["low", "medium", "wide"],
    floorHeight: ["low", "raised"],
    roofShade: ["short", "deep"],
  };

  if (!valid[key]?.includes(setting)) {
    return;
  }

  markDiscovered("lab");
  setState((state) => ({
    causeEffectOpen: true,
    labControls: {
      ...state.labControls,
      [key]: setting,
    },
    airflowPlaying: key === "openings" ? true : state.airflowPlaying,
    thermalEnabled: key === "roofShade" ? true : state.thermalEnabled,
  }));
}

function startAirflow() {
  setMode(AppMode.AIR);
  markDiscovered("airflow");
  setState({
    airflowPlaying: true,
    airflowStep: 0,
  });

  window.clearInterval(airflowTimer);
  airflowTimer = window.setInterval(() => {
    setState((state) => ({
      airflowStep: (state.airflowStep + 1) % 3,
    }));
  }, 5200);
}

function stopAirflow() {
  window.clearInterval(airflowTimer);
  airflowTimer = null;
  setState({
    airflowPlaying: false,
    airflowStep: 0,
  });
}

function markDiscovered(item) {
  setState((state) => {
    if (state.discovered.includes(item)) {
      return {};
    }
    return { discovered: [...state.discovered, item] };
  });
}

async function toggleAudio() {
  const next = !getState().audioEnabled;
  setState({ audioEnabled: next, moreOpen: false });
  const ready = await audio.setAmbient(next);
  setState({ ambientReady: ready });
}

function setLanguage(language) {
  if (!languages.some((item) => item.code === language)) {
    return;
  }

  setState({
    language,
    moreOpen: false,
    languageMenuOpen: false,
  });
}

async function nativeShare() {
  const payload = getSharePayload();
  if (!navigator.share) {
    setState({ shareOpen: true });
    return;
  }

  try {
    await navigator.share(payload);
    setState({
      shareOpen: false,
      shareCopied: false,
    });
  } catch (error) {
    if (error?.name !== "AbortError") {
      setState({ shareOpen: true });
    }
  }
}

async function copyShare() {
  const payload = getSharePayload();
  const text = `${payload.text} ${payload.url}`.trim();
  const copied = await copyText(text);
  setState({ shareCopied: copied });
}

function getSharePayload() {
  const t = makeTranslator(getState().language);
  const url = new URL(window.location.pathname || "/", window.location.origin).href;
  return {
    title: t("share.title"),
    text: t("share.message"),
    url,
  };
}

function syncShareMetadata() {
  const pageUrl = new URL(window.location.pathname || "/", window.location.origin).href;
  const imageUrl = new URL("assets/rumah-lontiok-hero.png", pageUrl).href;
  setMetaContent('meta[property="og:url"]', pageUrl);
  setMetaContent('meta[property="og:image"]', imageUrl);
  setMetaContent('meta[name="twitter:image"]', imageUrl);
  const canonical = document.querySelector('link[rel="canonical"]');
  canonical?.setAttribute("href", pageUrl);
}

function setMetaContent(selector, value) {
  document.querySelector(selector)?.setAttribute("content", value);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the textarea fallback for restricted browser contexts.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
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

function closeGuided() {
  setState({
    guidedTour: false,
    moreOpen: false,
  });
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
  clearQuizTimer();
  stopTargetScanner();
  clearLayerTimers();
}

function clearLayerTimers() {
  layerTimers.forEach((timer) => window.clearTimeout(timer));
  layerTimers = [];
}
