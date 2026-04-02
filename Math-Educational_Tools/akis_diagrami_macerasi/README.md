[🇹🇷 Click here for Turkish](README.tr.md)

# akis-diyagrami-macerasi

This repository contains an **interactive, browser-based educational activity** titled  
**“Akış Diyagramı Macerası: Algoritmalar Dünyasına Yolculuk”**.

The project is implemented as a **single-page web application (SPA-like)** that renders its UI **dynamically via JavaScript** (`main.js`).  
It includes **sound effects**, **modal/dialog overlays**, a **matrix-style canvas background**, and optional **SCORM integration** via wrapper/adaptor scripts.

---

## Features

### 1. Single Page + Dynamic UI
- The page layout is defined in `index.html`
- The main content and button area are **filled dynamically** into:
  - `#container`
  - `#buttons`
- Core behavior and flow are handled in `main.js`

### 2. Educational Interaction + Game-like Flow
- Activity flow is controlled by JavaScript (stages/screens/steps depending on your `main.js`)
- Provides a guided experience with dialogs/overlays (hint, results, finish confirmation, etc.)

### 3. Dialog / Overlay System
Custom overlay components styled in `style.css`, including (naming based on CSS classes):
- Hint dialog (`.dialog-ipucu-*`)
- Result dialog (`.dialog-sonuc-*`)
- Finish/exit confirmation (`.dialog-etkinlik-sonlandir-*`)
- Animation/info dialog (`.dialog-animasyon-*`)
- Organization / wide dialog (`.dialog-org-*`)
- Quiz overlay (`.quiz-overlay`, `.quiz-box`, option & navigation styling)

### 4. Audio Feedback
Preloaded audio elements in `index.html`:
- `mp3/click.mp3`
- `mp3/menu_option.mp3`
- `mp3/claps.mp3`
- `mp3/success.mp3`
- `mp3/fail.mp3`
- `mp3/place.mp3`

> Note: Most browsers require a user interaction before audio can play.

### 5. Responsive Layout (Mobile / Tablet / Desktop)
`style.css` contains breakpoints:
- Mobile: `@media (max-width: 768px)`
- Small mobile: `@media (max-width: 480px)`
- Tablet: `@media (min-width: 768px) and (max-width: 1300px)`
- Desktop: `@media (min-width: 1300px)`

### 6. SCORM-ready (Optional)
The page includes:
- `SCORM_API_wrapper.js`
- `quiz-adaptor.js`

These enable integration with a SCORM-compatible LMS (depending on how your adaptor is implemented).

---

## Project Structure

- `index.html` — main page shell (canvas + dynamic containers + script/style includes)
- `style.css` — all UI styling (layout, overlays, responsive rules, drag/drop visuals if used)
- `main.js` — activity logic (dynamic DOM creation, event handling, game flow)
- `SCORM_API_wrapper.js` — SCORM API helper (optional LMS integration)
- `quiz-adaptor.js` — quiz / SCORM adaptor layer
- `mp3/` — sound effects
- `fonts/` — custom font(s) used by the UI
- `icons/` — favicon / touch icon assets
- (optional) `images/` — if `main.js` uses images/diagrams/steps

---

## Getting Started

### Run locally
1. Clone the repository:
   ```bash
   git clone https://github.com/miyigun/egik_prizma.git
   ```

2. Enter the folder:
   ```bash
   cd egik_prizma
   ```

3. Start a local server (recommended):
   ```bash
   python -m http.server 8000
   ```

4. Open in your browser:
   - `http://localhost:8000`

> Tip: Opening `index.html` directly may work, but a local server is safer for loading assets (audio, fonts, images) reliably.

---

## Technologies Used
- HTML / CSS / JavaScript
- Bootstrap 5 (CSS + bundle JS)
- jQuery

---

## Notes
- The UI is intentionally **dynamic**; `index.html` contains placeholders that are populated by `main.js`.
- `body` disables the context menu (`oncontextmenu="return false;"`) — if you need right-click support for debugging, remove that attribute.
- `style.css` uses a custom font via `@font-face`; ensure the font file exists under `fonts/`.

---

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.