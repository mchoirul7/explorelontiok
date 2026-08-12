export const AppMode = Object.freeze({
  DISCOVER: "discover",
  STRUCTURE: "structure",
  AIR: "air",
  CLIMATE: "climate",
});

export const AppPhase = Object.freeze({
  OPENING: "opening",
  PATHS: "paths",
  LAB: "lab",
  QUIZ: "quiz",
  LOADING: "loading",
  ONBOARDING: "onboarding",
  SCANNING: "scanning",
  EXPERIENCE: "experience",
  COMPLETION: "completion",
  ERROR: "error",
});

export const initialState = Object.freeze({
  phase: AppPhase.OPENING,
  mode: AppMode.DISCOVER,
  learningPath: null,
  learningMission: "air",
  labAnswer: null,
  labSolved: false,
  quizPlan: [],
  quizIndex: 0,
  quizAnswers: {},
  quizSubmitted: false,
  quizTimedOut: false,
  quizCompleted: false,
  quizTimeLeft: 0,
  targetMode: "simulated",
  labControls: {
    openings: "medium",
    floorHeight: "raised",
    roofShade: "deep",
  },
  culturalLayer: "normal",
  layerPanelOpen: false,
  causeEffectOpen: false,
  discovered: [],
  targetFound: false,
  targetLost: false,
  targetConfirmation: false,
  cameraReady: false,
  cameraError: null,
  loadingStep: 0,
  explodedAmount: 0,
  airflowPlaying: false,
  airflowStep: 0,
  thermalEnabled: false,
  selectedHotspot: null,
  selectedClimateHotspot: null,
  selectedStructurePart: null,
  sheet: null,
  language: "en",
  audioEnabled: true,
  ambientReady: false,
  moreOpen: false,
  languageMenuOpen: false,
  shareOpen: false,
  shareCopied: false,
  guidedTour: false,
  guidedStep: 0,
  narration: {
    playing: false,
    progress: 0,
    duration: 18,
    label: "",
  },
});

let state = cloneState(initialState);
const listeners = new Set();

export function getState() {
  return state;
}

export function setState(update) {
  const patch = typeof update === "function" ? update(state) : update;
  state = {
    ...state,
    ...patch,
    narration: patch.narration ? { ...state.narration, ...patch.narration } : state.narration,
  };
  notify();
}

export function resetState(overrides = {}) {
  state = { ...cloneState(initialState), ...overrides };
  notify();
}

export function subscribe(listener) {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

function cloneState(source) {
  return {
    ...source,
    labControls: { ...source.labControls },
    quizPlan: [...source.quizPlan],
    quizAnswers: { ...source.quizAnswers },
    discovered: [...source.discovered],
    narration: { ...source.narration },
  };
}

function notify() {
  listeners.forEach((listener) => listener(state));
}
