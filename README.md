# Rumah Lontiok AR Prototype

Premium cultural AR learning prototype for Rumah Lontiok, focused on opening, onboarding, scanning, model reveal, contextual hotspots, structure, airflow, climate, narration, language switching, and guided learning.

## Run Locally

Use a local server so ES modules and camera access run in a browser context:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5173/
```

## Structure

- `src/state.js` keeps the central app state and modes.
- `src/localization.js` contains the EN/ID copy.
- `src/ar.js` owns camera access and the target lifecycle. Replace the simulated scanner with MindAR target callbacks when final tracking assets are ready.
- `src/scene.js` renders the sample Rumah Lontiok model and mode overlays. Replace the DOM sample model with the final Three.js model when available.
- `src/ui.js` renders the premium interface from state.
- `src/audio.js` handles user-triggered ambient sound and narration progress.
- `assets/rumah-lontiok-hero.png` is the generated cultural opening visual.
