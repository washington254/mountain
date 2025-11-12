# 🏔️ Mountain — Procedural 3D Scene in React Three Fiber

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mountain--sage.vercel.app-blue?style=for-the-badge)](https://mountain-sage.vercel.app/)
[![License](https://img.shields.io/github/license/washington254/mountain?style=for-the-badge)](LICENSE)
[![React Three Fiber](https://img.shields.io/badge/React--Three--Fiber-%2300D8FF?style=for-the-badge&logo=three.js&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)

A procedurally generated mountain scene created with **React Three Fiber**, **GLSL shaders**, and **postprocessing effects**.  
The environment includes:
- A **noise-based mountain** mesh with customizable height, crater angle, and roughness.
- A **moving grid** that creates a sense of motion and depth.
- **Volumetric clouds** powered by `@react-three/drei`.
- **Real-time controls** via Leva to tweak visual parameters interactively.

---

## 🎮 Live Demo
🌐 **[View it here → mountain-sage.vercel.app](https://mountain-sage.vercel.app/)**  

---

## 🧠 Features

### 🌄 Procedural Mountain
- Built entirely in GLSL using **Simplex noise** for terrain elevation.
- Custom crater shaping with adjustable tilt and cut height.
- Smooth opacity fade for mountain layers.

### 🌫️ Cloud System
- Uses `@react-three/drei`’s `<Cloud />` components.
- Individually tunable cloud positions, colors, speeds, and opacities.
- 10 preset clouds adjustable from Leva panels.

### ⚡ Moving Grid
- Custom shader-driven grid moving toward the camera.
- Creates a subtle parallax and futuristic vibe.
- Fades dynamically based on depth.

### 💡 Post Processing
- Realistic atmosphere with **fog**.
- Bloom and tone mapping via `@react-three/postprocessing`.

### 🎚️ Real-time Controls
- Fully adjustable parameters with **Leva**, including:
  - Cloud count, speed, opacity, and color
  - Fog near/far planes
  - Mountain height, crater depth, noise intensity, and angle

---

## 🧩 Tech Stack

| Library | Purpose |
|----------|----------|
| **React Three Fiber** | Core 3D rendering |
| **Three.js** | Underlying 3D engine |
| **@react-three/drei** | Cloud components and helpers |
| **Leva** | Real-time UI controls |
| **@react-three/postprocessing** | Bloom and tone mapping effects |
| **Vite** | Development and build tool |

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/washington254/mountain.git
cd mountain

🧭 Project Structure
mountain/
├── src/
│   ├── components/
│   │   ├── Grid.jsx        # Moving grid lines shader
│   │   └── Plane.jsx       # Procedural mountain shader
│   ├── App.jsx             # Scene setup and composition
│   ├── main.jsx            # Entry point
│   └── index.css           # Styling
├── public/
├── package.json
└── vite.config.js

🎨 Shader Highlights
Mountain Shader

Uses 3D simplex noise for organic elevation.

Crater created by a clipped tilted plane.

Adjustable uniforms:

uNoiseIntensity

uMountainHeight

uCraterHeight

uCraterAngle

Grid Shader

Depth-based fade effect.

Continuous forward motion to simulate perspective flow.

