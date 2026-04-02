[🇹🇷 Click here for Turkish](README.tr.md)

# adim-adim-ispat-oyunu

This repository contains an **interactive, browser-based educational game** titled **“Adım Adım İspat Oyunu”** (Step-by-Step Proof Game).  
It is implemented as a **single-page web application** where learners **build a proof by ordering given steps** using **drag & drop** or **double-click** interactions.

---

## Features

### 1. Stage-based Proof Activities
- Multiple stages are defined in `main.js` under the `stages` array
- Each stage provides:
  - A **theorem image** (prompt)
  - A **proof method hint** (subtitle)
  - A set of **shuffled step images**
  - A **correct step order** to validate the user’s solution

### 2. Interactions (Desktop + Mobile)
- **Drag & drop** steps into the drop area
- **Double-click** a step to place it into the drop area
- Click a placed step in the drop area to remove it and return it back to the step pool
- Touch support via **jQuery UI Touch Punch**

### 3. Timer & Flow Control
- Countdown timer (default **300 seconds / 5 minutes** per stage)
- When time runs out:
  - User is warned
  - Submit button is disabled

### 4. Feedback & Sounds
- Sound effects for:
  - Click
  - Success
  - Fail
  - Celebration (claps)
- Visual correctness indicators are appended after submission

### 5. Intro & Hint Dialog
- Intro screen modal before starting the activity
- A custom “Hint” dialog appears at start with usage tips (especially for mobile landscape mode)

---

## Project Structure

- `index.html` — main page and UI layout
- `style.css` — styling for steps, drop area, intro modal, and hint dialog
- `main.js` — game logic (stages, timer, drag/drop, validation, reset flow)
- `images/` — theorem and step images, background images, icons
- `mp3/` — sound files used by the activity
- `fonts/` — custom font used by the UI

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

> Note: Opening `index.html` directly can work, but using a local server is safer for asset loading (images/audio).

---

## 🛠️ Technologies Used
- HTML / CSS / JavaScript
- jQuery
- Bootstrap 4
- Bootstrap Icons
- jQuery UI + jQuery UI Touch Punch (mobile touch drag support)

---

## 📌 Notes
- Stage content is image-based. Ensure the `images/` folder structure matches the paths in `main.js`.
- Audio requires user interaction in many browsers; sounds are triggered after clicks to avoid autoplay restrictions.
- If you extend the game with more stages, update:
  - `stages[].steps`
  - `stages[].correctOrder`

---
## 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.
