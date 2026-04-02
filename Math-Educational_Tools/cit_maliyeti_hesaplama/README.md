[🇹🇷 Click here for Turkish](README.tr.md)

# cit-maliyeti-hesaplama

This repository contains an **interactive, browser-based educational activity** titled  
**“Çit Maliyeti Hesaplama”**.

The app helps learners compute the **total fencing cost** for a **square-shaped land** using:
- land area in **decare (dönüm)** (*1 dönüm = 1000 m²*)
- fencing cost per meter (₺/m)

It provides:
- a **step-by-step solution** rendered with **MathJax**
- a **canvas-based land model** with a fence visualization
- a **“How to solve?”** modal explanation
- a custom **hint (overlay) dialog** and **click sound feedback**

---

## Features

### 1. Input-driven Cost Calculation
- User enters:
  - `Arsa miktarı (Dönüm)` → `#acreAmount`
  - `Metre başına çit maliyeti (₺)` → `#fenceCost`
- The **Calculate** button (`#calculateButton`) is enabled only when both inputs are filled.

### 2. Math Model (Square Land Assumption)
- Land is assumed to be square.
- Calculations in `main.js`:
  - Side length: `√(acreAmount * 1000)`
  - Perimeter: `4 * √(acreAmount * 1000)`
  - Total cost: `perimeter * fenceCost`

### 3. Step-by-step Solution (MathJax)
- Solution steps are displayed in `#solutionSteps` (`step1..step4`)
- Steps appear with a **fade-in animation**
- Mathematical expressions are typeset using **MathJax**

### 4. Visual Model on Canvas
- A canvas (`#fenceCanvas`) displays a random land image:
  - `images/model1.jpeg` … `images/model4.jpeg`
- The canvas fades out/in during image changes.
- A fence border is drawn using `ctx.strokeRect(...)`.
- Land info text is written under the canvas via `#acreInfo`.

### 5. “How to solve?” Modal (Bootstrap)
- Clicking **“Nasıl Çözülür?”** opens a Bootstrap modal (`#solutionModal`)
- The modal contains the general method and formulas (MathJax enabled)

### 6. Hint Dialog (Overlay) + Sound
- On page load, a custom hint dialog is displayed via `ipucuDiyalogAc(...)`
- Overlay styling is defined in `style.css`:
  - `.dialog-ipucu-overlay`, `.dialog-ipucu-box`, `.close-ipucu-button`
- Clicking “Tamam” plays `mp3/click.mp3` and closes the overlay.

---

## Project Structure

- `index.html` — main UI (form, canvas, modal, audio include)
- `style.css` — layout + canvas styling + hint overlay styling
- `main.js` — logic (validation, calculation, drawing, MathJax typeset, animations, sound)
- `images/`
  - `model1.jpeg`, `model2.jpeg`, `model3.jpeg`, `model4.jpeg`
  - `key.png` (hint icon)
- `mp3/`
  - `click.mp3`
- `fonts/`
  - `Helveticasinav.ttf`
- `icons/`
  - `favicon.ico`

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

> Tip: Using a local server prevents asset loading issues (images, fonts, audio).

---

## Technologies Used
- HTML / CSS / JavaScript
- Bootstrap 4 (CDN)
- jQuery
- MathJax 3

---

## Notes
- Right-click is disabled in `index.html` (`oncontextmenu="return false;"`). Remove if needed during debugging.
- Input limits are enforced:
  - `#acreAmount`: max 5 digits
  - `#fenceCost`: max 9 digits
- The displayed numbers use comma formatting in the UI (`,`), while internal computations use standard JS numbers.

---

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.