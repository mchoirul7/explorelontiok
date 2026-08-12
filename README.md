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
- 3D House Model: `assets/3d/rumahadat-web.glb` rendered with three.js (`src/model3d.js`). The glTF nodes are unnamed, so parts are grouped by height band (roof / body / deck / stilts); those groups drive the exploded structure view, the X-ray layer tints, and the anchors that every hotspot and label is pinned to. Drag to orbit; it idles into a slow spin and holds still during the airflow lesson.
- Airflow Simulation: a canvas velocity field (`src/airflow-field.js`) that advects particles along the house silhouette measured from the 3D model each frame — in under the raised floor, across through the openings, then up and out of the ridge — with a distinct path, tint, and set of streamlines per stage.
- Standalone Quiz: visual questions with timer, score, A-D choices, true/false, and multi-answer rounds outside the AR experience.
- Share Sheet: WhatsApp, Facebook, X, Telegram, native device sharing, and copy-link actions with social preview metadata.
- Guided Reflection Ending: an elegant learning summary covering discovery, architecture, science, and cultural wisdom.

Social thumbnails use Open Graph and Twitter metadata in `index.html`. WhatsApp/Facebook previews require absolute HTTPS URLs, so the tags point at `https://explorelontiok.vercel.app/` and at `assets/og-image.jpg` (1200x630, ~110 KB — the full-size hero PNG is too large for WhatsApp to fetch). Update those absolute URLs if the site moves to another domain.

## 3D Asset

`assets/3d/rumahadat.glb` is the source model (6.66 MB — a 2048x2048 RGBA PNG atlas is 97% of it).
`assets/3d/rumahadat-web.glb` is what the app loads: identical geometry, the two textures re-encoded
as WebP via `EXT_texture_webp`, 0.79 MB. Regenerate it after replacing the source model; the atlas
has real alpha, so JPEG is not an option.

three.js is vendored under `src/vendor/three` (v0.180.0) and resolved through the import map in
`index.html`, so the site has no third-party runtime dependency.

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
