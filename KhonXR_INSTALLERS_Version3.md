# Building Desktop Installers for Khon Graphics

This document explains how to produce Windows (.exe via NSIS) and Linux (AppImage / .deb) installers that bundle the KhonXR runtime (.khon) and the built-in UI.

Important notes
- This repo intentionally vendors third-party libraries only when you pin upstream URLs and checksums in libs.json (see README). The build pipeline is deterministic — do not commit large vendor binaries unless you intend to.
- Desktop builds use Electron and electron-builder. The produced installers will include dist/khonxr.khon as a bundled resource so desktop installs are self-contained.

Local developer workflow
1. Prepare the .khon bundle:
   - Copy `libs.json.example` -> `libs.json` and populate canonical URLs & SHA256 checksums for TFJS, Coco-SSD, MiDaS, MediaPipe, OpenCV, etc.
   - Run: node fetch-libs.js
   - Run: node build-khon.js
   - Confirm `dist/khonxr.khon` exists.

2. Install dev dependencies (requires Node.js >= 18):
   - npm ci

3. Run the desktop app in development mode:
   - npm run desktop:dev
   - This opens an Electron window which loads README.html (the engine UI) and provides access to the bundled .khon.

4. Build installers locally:
   - Windows (on Windows host): npm run desktop:build:win
   - Linux (on Linux host): npm run desktop:build:linux
   - Or build both (packager will create artifacts in `dist/`).

CI / Official releases
- The included GitHub Actions workflow `.github/workflows/release-desktop.yml` builds installers on GitHub runners:
  - Windows installer is built on windows-latest
  - Linux installers are built on ubuntu-latest
  - Artifacts are attached to a GitHub release by the workflow
- Use the workflow_dispatch trigger to run a release build and attach the installers to a release.

Signing & notarization
- Windows code-signing and macOS notarization require vendor certificates and secrets. Add the relevant secrets (e.g., SIGNING_CERT, SIGNING_KEY, or GPG/P12) in the repository settings and modify the workflow to use them.
- For Windows: configure electron-builder's win.sign and provide certificate via secrets.
- For Linux AppImages: consider using gpg signing of the final artifact for provenance.

What the installer contains
- A desktop application (Khon Graphics) that:
  - Contains the HTML-based engine UI (README.html / examples).
  - Bundles dist/khonxr.khon into application resources (extraResources).
  - Provides a small Electron bridge (preload) so the UI can read the bundled .khon and run the engine offline.

Security & provenance
- Pin upstream artifact SHA256 sums in `libs.json` to ensure deterministic builds.
- Run the GitHub Actions workflow in your GitHub repo to produce release artifacts that you can sign and publish.