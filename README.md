# Rumah Lontiok AR Prototype

Premium cultural learning prototype for Rumah Lontiok, focused on opening, learning paths, AR scanning, model reveal, contextual hotspots, structure, airflow, climate, standalone quiz, narration, language switching, and guided learning.

Current entry flow:

```text
Opening -> Learning Path -> Loading -> Onboarding -> Scanning -> AR Experience
```

The learning path screen offers free AR exploration, a guided lesson, and a standalone quiz path. The hidden lab flow remains available in code for cause-and-effect learning experiments; the quiz path opens a non-AR visual quiz with timer, score, A-D options, true/false, and multi-answer questions.

Language selection is available from the opening screen and supports English, Indonesian, Korean, and Traditional Chinese for Taiwan.

Additional learning features:

- X-Ray Cultural Layers: normal, architecture, airflow, climate, daily life, and local wisdom layers with a cinematic reveal sequence.
- Cause & Effect Lab: openings, floor height, and roof shade controls that visibly affect airflow, floor elevation, and thermal/shade overlays.
- Standalone Quiz: visual questions with timer, score, A-D choices, true/false, and multi-answer rounds outside the AR experience.
- Share Sheet: WhatsApp, Facebook, X, Telegram, native device sharing, and copy-link actions with social preview metadata.
- Guided Reflection Ending: an elegant learning summary covering discovery, architecture, science, and cultural wisdom.

Social thumbnails use Open Graph and Twitter metadata in `index.html`. WhatsApp/Facebook previews require the page and `assets/rumah-lontiok-hero.png` to be available from a public HTTPS URL.

## AR Target

Generated target image:

```text
assets/targets/rumah-lontiok-target.png
```

Open or print the target page:

```text
http://127.0.0.1:5173/target.html
```

The prototype now has two target modes during onboarding:

- `Simulated`: auto target-found mode for presentation.
- `Real target`: uses the generated image as the scan reference while waiting for real MindAR integration.

For production tracking, compile the PNG into:

```text
assets/targets/rumah-lontiok.mind
```

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
