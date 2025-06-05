# ✨ AI Image Generator Frontend

A modern frontend interface for generating and comparing AI-generated images using various models. Built with React, TypeScript, and a responsive UI.

> **Note:** Requires a backend API for full functionality.

---

## 🚀 Features

* **Text-to-Image Generation** — Input a prompt to generate images.
* **Model Comparison** — Generate results from multiple AI models side by side.
* **Dynamic Model Fetching** — Retrieves model metadata from a backend API.
* **Prompt Suggestions** — Randomized creative prompt ideas.
* **Image Size Options** — Supports standard sizes (e.g., 512x512, 1024x1024).
* **Image Zoom & Preview** — High-quality preview with zoom support.
* **Download & Share** — Save or share generated images.
* **Generation Metrics** — Displays image generation time per model.
* **Responsive Design** — Optimized for all screen sizes.

---

## 🛠️ Tech Stack

* **Framework:** React 19 + Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS, Shadcn/UI, CSS Variables
* **Routing:** TanStack Router
* **UI Components:** Radix UI, Lucide Icons
* **State/Data:** Custom hooks
* **Package Manager:** PNPM

---

## ⚙️ Setup

### Prerequisites

* Node.js (v18+)
* PNPM
* Backend API (default: `http://localhost:8000`)

### Installation

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
pnpm install
```

### Configuration

Update the backend API URL in `src/lib/config.ts`:

```ts
export const API_URL = 'http://localhost:8000'; // Or your deployed backend
```

### Development

```bash
pnpm dev
# Open http://localhost:3000
```

---

## 🐳 Docker

### Build Image

```bash
docker build -t ai-image-gen-frontend .
```

### Run Container

```bash
docker run -p 8080:80 -e API_URL="http://your-backend:8000" ai-image-gen-frontend
```

---

## 🌐 Backend API Requirements

This frontend expects a backend API with the following endpoints:

* `GET /v1/models` — Returns available model configurations.
* `POST /v1/images/generations` — Accepts:

  ```json
  {
    "model": "model_id",
    "prompt": "your prompt",
    "size": "1024x1024"
  }
  ```

  Responds with:

  ```json
  {
    "data": [
      { "b64_json": "base64_encoded_image" }
    ]
  }
  ```

---

## 📂 Directory Overview

```
src/
├── components/       # UI components (e.g., ImageDisplay, Header)
├── hooks/            # Custom hooks (e.g., use-image-generation)
├── lib/              # Utilities, configs (e.g., config.ts)
├── routes/           # TanStack Router-based pages
├── main.tsx          # Entry point
└── styles.css        # Global styles
```

---

## 📦 Scripts

* `pnpm dev` — Start development server
* `pnpm build` — Build for production
* `pnpm serve` — Serve production build
* `pnpm test` — Run tests (if configured)
