export function createAudioController() {
  let context = null;
  let gain = null;
  let oscillators = [];
  let narrationTimer = null;

  async function ensureContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return false;
    }

    if (!context) {
      context = new AudioContextClass();
      gain = context.createGain();
      gain.gain.value = 0.0001;
      gain.connect(context.destination);
      buildAmbient();
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    return true;
  }

  function buildAmbient() {
    const frequencies = [146.83, 196, 293.66];
    oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const filter = context.createBiquadFilter();
      const voiceGain = context.createGain();

      oscillator.type = index === 1 ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      filter.type = "lowpass";
      filter.frequency.value = 520 + index * 120;
      voiceGain.gain.value = 0.16 / (index + 1);

      oscillator.connect(filter);
      filter.connect(voiceGain);
      voiceGain.connect(gain);
      oscillator.start();
      return oscillator;
    });
  }

  async function setAmbient(enabled) {
    const ready = await ensureContext();
    if (!ready || !gain || !context) {
      return false;
    }

    const target = enabled ? 0.035 : 0.0001;
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.linearRampToValueAtTime(target, context.currentTime + 0.32);
    return true;
  }

  function playNarration({ text, language, duration = 18, onProgress, onEnd }) {
    stopNarration();
    const start = performance.now();
    const utteranceSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

    if (utteranceSupported) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "id" ? "id-ID" : "en-US";
      utterance.rate = 0.88;
      utterance.pitch = 0.92;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }

    onProgress?.(0);
    narrationTimer = window.setInterval(() => {
      const elapsed = (performance.now() - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      onProgress?.(progress);

      if (progress >= 1) {
        stopNarration();
        onEnd?.();
      }
    }, 160);
  }

  function stopNarration() {
    if (narrationTimer) {
      window.clearInterval(narrationTimer);
      narrationTimer = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function dispose() {
    stopNarration();
    oscillators.forEach((oscillator) => oscillator.stop());
    oscillators = [];
    if (context) {
      context.close();
      context = null;
    }
  }

  return {
    setAmbient,
    playNarration,
    stopNarration,
    dispose,
  };
}
