let cameraStream = null;
let scanTimer = null;

// Replace startTargetScanner with MindAR target callbacks when production targets are available.
export async function startCamera(videoElement) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera API is not available in this browser.");
  }

  cameraStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  });

  videoElement.srcObject = cameraStream;
  await videoElement.play();
  return cameraStream;
}

export function startTargetScanner({ onFound }) {
  stopTargetScanner();
  scanTimer = window.setTimeout(() => {
    scanTimer = null;
    onFound?.();
  }, 2800);
}

export function stopTargetScanner() {
  if (scanTimer) {
    window.clearTimeout(scanTimer);
    scanTimer = null;
  }
}

export function stopCamera() {
  stopTargetScanner();
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
}
