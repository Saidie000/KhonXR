# Khon Graphics Engine

<div style="display: flex; align-items: center; margin-bottom: 20px;">
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="84.000000pt" height="104.000000pt" viewBox="0 0 84.000000 104.000000" preserveAspectRatio="xMidYMid meet" style="width: 50px; height: auto; margin-right: 10px;">
    <metadata>Created by potrace 1.10, written by Peter Selinger 2001-2011</metadata>
    <g transform="translate(0.000000,104.000000) scale(0.100000,-0.100000)" fill="#800080" stroke="none">
      <path d="M99 896 c6 -8 24 -16 39 -19 15 -3 52 -12 82 -22 30 -9 80 -23 110 -31 30 -8 78 -30 105 -48 199 -133 208 -138 216 -124 5 7 30 49 55 93 26 44 60 99 76 123 l29 42 -362 0 c-308 0 -360 -2 -350 -14z"/>
      <path d="M349 713 c-45 -41 -45 -40 -14 -163 20 -80 29 -120 45 -190 7 -30 16 -59 20 -65 5 -5 13 -32 18 -60 15 -78 53 -219 62 -228 4 -5 13 13 20 40 6 26 15 64 20 83 5 19 16 64 24 100 8 36 22 94 30 130 9 36 21 92 27 125 6 33 15 64 20 69 26 28 7 52 -100 124 -59 39 -113 72 -120 72 -6 0 -29 -17 -52 -37z"/>
    </g>
  </svg>
  <h1 style="margin: 0;">Khon | <span style="text-decoration: underline wavy red;">.khon</span> Khon Graphics Engine</h1>
</div>

Khon Graphics is NCOM's dedicated graphics protocol that serves as a "partially local" graphics engine that lives partly on the device as well as on the cloud. It acts as a WebRTC handler where <span style="text-decoration: underline wavy red;">khon</span> handles OS-level renderer that predates modern cloud GPU rendering.

For non-intensive graphics such as UX, Khon native engine lives on the built-in graphics CPU. but, for more graphic intensive graphics, <span style="text-decoration: underline wavy red;">khon</span> uses a graphics cloud pipeline though containers called manifests or .mf. A manifest may not contain all real assets but - it contains references. meaning inside the .mf you'd likely see structures like:

```
| ASSET: KHON.RASTER.LIGHTING
| SRC: https://plx-khon-relay/core/light/index.hdr
```

<div style="display: flex; justify-content: space-around; margin-top: 40px;">
  <div>
    <h3><svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 84.000000 104.000000" preserveAspectRatio="xMidYMid meet" style="display: inline-block; vertical-align: middle; margin-right: 5px;">
      <g transform="translate(0.000000,104.000000) scale(0.100000,-0.100000)" fill="#800080" stroke="none">
        <path d="M99 896 c6 -8 24 -16 39 -19 15 -3 52 -12 82 -22 30 -9 80 -23 110 -31 30 -8 78 -30 105 -48 199 -133 208 -138 216 -124 5 7 30 49 55 93 26 44 60 99 76 123 l29 42 -362 0 c-308 0 -360 -2 -350 -14z"/>
        <path d="M349 713 c-45 -41 -45 -40 -14 -163 20 -80 29 -120 45 -190 7 -30 16 -59 20 -65 5 -5 13 -32 18 -60 15 -78 53 -219 62 -228 4 -5 13 13 20 40 6 26 15 64 20 83 5 19 16 64 24 100 8 36 22 94 30 130 9 36 21 92 27 125 6 33 15 64 20 69 26 28 7 52 -100 124 -59 39 -113 72 -120 72 -6 0 -29 -17 -52 -37z"/>
      </g>
    </svg> Small stuff = local rendering</h3>
    <p>UI, windows, overlays, animated icons<br>(aka what you see with no heavy GPU)</p>
  </div>
  <div>
    <h3><svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 84.000000 104.000000" preserveAspectRatio="xMidYMid meet" style="display: inline-block; vertical-align: middle; margin-right: 5px;">
      <g transform="translate(0.000000,104.000000) scale(0.100000,-0.100000)" fill="#800080" stroke="none">
        <path d="M99 896 c6 -8 24 -16 39 -19 15 -3 52 -12 82 -22 30 -9 80 -23 110 -31 30 -8 78 -30 105 -48 199 -133 208 -138 216 -124 5 7 30 49 55 93 26 44 60 99 76 123 l29 42 -362 0 c-308 0 -360 -2 -350 -14z"/>
        <path d="M349 713 c-45 -41 -45 -40 -14 -163 20 -80 29 -120 45 -190 7 -30 16 -59 20 -65 5 -5 13 -32 18 -60 15 -78 53 -219 62 -228 4 -5 13 13 20 40 6 26 15 64 20 83 5 19 16 64 24 100 8 36 22 94 30 130 9 36 21 92 27 125 6 33 15 64 20 69 26 28 7 52 -100 124 -59 39 -113 72 -120 72 -6 0 -29 -17 -52 -37z"/>
      </g>
    </svg> Heavy stuff = streamed rendering</h3>
    <p>lighting<br>high-resolution textures<br>complex geometry<br>ray-blur, bloom, ambient maps, etc.</p>
  </div>
</div>

<div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="450.000000pt" height="233.000000pt" viewBox="0 0 450.000000 233.000000" preserveAspectRatio="xMidYMid meet" style="width: 300px; height: auto;">
    <metadata>Created by potrace 1.10, written by Peter Selinger 2001-2011</metadata>
    <g transform="translate(0.000000,233.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
      <path d="M2040 2160 c-41 -3 -91 -14 -109 -24 -19 -10 -211 -195 -427 -410 -306 -305 -397 -402 -415 -441 -23 -48 -24 -62 -27 -291 l-3 -242 27 -21 c24 -19 39 -21 164 -21 219 0 159 -43 719 514 382 380 488 491 507 531 22 46 24 63 24 203 0 85 -5 162 -10 172 -6 11 -27 24 -48 30 -40 11 -279 11 -402 0z"/>
      <path d="M3045 2154 c-46 -14 -86 -52 -506 -472 -303 -303 -465 -472 -480 -502 -22 -42 -24 -58 -27 -232 l-4 -187 26 -26 25 -25 229 0 c225 0 229 0 280 26 74 37 743 718 787 801 l30 57 0 267 c0 244 -2 270 -18 286 -25 25 -267 30 -342 7z"/>
    </g>
  </svg>
</div>

NCOM KhonXR is NCOM's graphics API featuring OpenXR, SLAM, TFJS, MiDaS, Coco-SSD, MediaPipe, OpenCV, WebGL, and PLX code handler for .khon shaders—all in a single free build script. See README for full details and usage.

# NCOM Khon Graphics Docs & Instructions

Comprehensive documentation for **Khon Graphics**, NCOM’s full-stack WebXR/WebGL graphics engine with OpenXR support, immersive UI, and advanced tracking systems.

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Installation](#installation)
5. [Core Modules](#core-modules)
6. [Tracking Systems](#tracking-systems)
7. [Rendering & Shaders](#rendering--shaders)
8. [WebXR/OpenXR Integration](#webxropenxr-integration)
9. [Scene Examples](#scene-examples)
10. [Performance Optimization](#performance-optimization)
11. [Troubleshooting](#troubleshooting)
12. [License](#license)

---

## Overview
Khon Graphics is designed for **immersive applications** in WebXR/VR/AR with:
- **Full OpenXR support** for desktop VR and headset integration
- **Real-time tracking**: hand, face, body, eye
- **Soft-glass UI overlay** for physical-surface-aligned HUDs
- **Integrated RANSAC plane detection** for spatial interaction
- **Advanced rendering pipeline** with WebGL2/WebGPU, PBR materials, and glass shaders
It powers **NCOM FocalOS**, enabling VR, AR, and mixed-reality environments in a browser or web app.

---

## Features
- **Soft-Glass UI:** Floating HUDs that snap to surfaces with realistic transparency and refraction
- **Full-body tracking:** Hand, eye, and facial tracking compatible with VR controllers and webcams
- **Physics and Occlusion:** Rigid body simulation, depth-aware occlusion of objects in scenes
- **WebXR/OpenXR Ready:** Full headset support, including controller input and room-scale tracking
- **Asset Manager:** Efficient streaming/loading of 3D models, animations, and textures
- **Shader Suite:** Glass, PBR, holographic, and customizable GLSL shaders

---

## System Architecture
Khon Graphics consists of layered modules:
1. **Core Engine:** Initializes canvas, manages render loop, handles WebGL/WebGPU context
2. **Renderer Module:** Manages shaders, lighting, shadows, reflections, and soft-glass effects
3. **Tracking Module:** Hand, face, eye, and full-body motion capture; integrates MediaPipe, TensorFlow.js, or SteamVR trackers
4. **UI Module:** Soft-glass overlays, menus, HUD elements, and interactive buttons
5. **Physics Module:** Optional rigid body, collision detection, occlusion management
6. **Asset Manager:** Handles model/textures/animations, caching, LOD, and instancing
7. **WebXR/OpenXR Adapter:** Connects Khon Graphics engine to OpenXR API for VR/AR support
Each module can be **enabled/disabled independently**, making the engine modular and lightweight.

---

## Installation
### Browser (Standalone HTML)
1. Clone or download the repository:
```bash
git clone https://github.com/NCOM/khon-graphics.git
```

2. Include in your HTML:
```html
<link rel="stylesheet" href="khon-graphics.css">
<script src="khon-graphics.bundle.js"></script>
```

3. Initialize:
```javascript
const khon = new KhonGraphics({
  canvas: document.getElementById('renderCanvas'),
  enableVR: true,
  enableSoftGlass: true
});
khon.start();
```

### Node/NPM Environment
```bash
npm install khon-graphics
```

Then in your JS/TS:
```javascript
import { KhonGraphics } from 'khon-graphics';

const engine = new KhonGraphics({ canvas: document.getElementById('renderCanvas') });
engine.start();
```

---

## Core Modules
### Renderer
* Supports WebGL2 and WebGPU
* Handles PBR, glass, and custom shaders
* Dynamic lighting and reflections

### UI Layer
* Soft-glass HUD
* Snap-to-surface logic
* Fully interactive buttons and overlays

### Tracking
* Hands: OpenXR or MediaPipe
* Face: TensorFlow.js FaceMesh
* Eyes: Iris tracking
* Body: Pose detection via TensorFlow.js or SteamVR

### Physics
* Optional Rigid Body and collision detection
* Occlusion-aware rendering

### Asset Manager
* Load .glb, .gltf, .obj models
* Manage animations, textures, and materials
* Instancing and LOD support

---

## Tracking Systems
*Detailed in Core Modules above.*

---

## Rendering & Shaders
* Glass Shader: Soft transparency, refraction, HDR reflections
* PBR Shader: Metallic/roughness-based realistic materials
* Holographic Shader: Neon outlines, emissive glow
* Custom Shader Support: Load your own GLSL scripts

```javascript
const glassMaterial = engine.createMaterial('glass');
mesh.setMaterial(glassMaterial);
```

---

## WebXR/OpenXR Integration
Khon Graphics connects directly to OpenXR:

```javascript
khon.xr.startSession({
  referenceSpace: 'local-floor',
  optionalFeatures: ['hand-tracking', 'layers', 'plane-detection']
});
```

* Controllers: Automatically mapped to engine input
* Hands: Gesture recognition for interaction
* Room-scale VR: Automatic scaling and collision boundaries
* Planes: RANSAC plane detection for spatial awareness

---

## Scene Examples
### Simple Cube in VR
```javascript
const scene = khon.createScene();

const cube = scene.createMesh('cube', { width: 1, height: 1, depth: 1 });
cube.setMaterial(engine.createMaterial('glass'));
cube.position.set(0, 1, 0);

scene.add(cube);
khon.renderScene(scene);
```

### Soft-Glass HUD Panel
```javascript
const hud = khon.ui.createPanel({ width: 0.5, height: 0.3, glass: true });
hud.position.set(0, 1.5, -1);
khon.scene.add(hud);
```

---

## Performance Optimization
* Use instancing for repeated objects
* Limit high-res textures in VR
* Batch draw calls
* Enable lazy loading of models and textures

---

## Troubleshooting
* Canvas blank: Check <canvas> element and context
* VR session fails: Confirm browser supports WebXR/OpenXR
* Shader glitches: Verify WebGL2/WebGPU compatibility

Enable debug mode for detailed logs:
```javascript
khon.enableDebugMode(true);
```

---

## License
Khon Graphics is MIT licensed. Free to use, modify, and redistribute.
