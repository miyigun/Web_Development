[🇹🇷 Click here for Turkish](README.tr.md)

# planlayici

This repository contains a **browser-based task / productivity application** titled  
**“Görev Uygulaması”**.

The project is a **single-page (SPA-like)** front-end built with **HTML/CSS/JavaScript** and uses:
- **Bootstrap 5** for UI components
- **jQuery + jQuery UI** for interactions
- **Font Awesome** for icons

The app includes:
- **Login / Register** screens
- A main task dashboard with **levels, TP, and gold** (gamification)
- Sidebar navigation for **Tasks, Categories, Market, Calendar, Goals, Habit Tracker, Settings**
- Multiple **sound effects** for interactions and feedback

---

## Features

### 1. Authentication UI (Login / Register)
- Login and registration screens are defined in `public/index.html`:
  - `#loginScreen` (login/register container)
  - `#registerFields` and `#loginFields` are toggled dynamically
- Submit button starts disabled (`#submitButton`) and is enabled by app logic in `public/main.js`.

### 2. Gamified Header / User Stats
Top bar shows:
- Profile picture (`#profilePicture`)
- Username display
- Level (`#level`)
- TP and Gold counters (shown in the header)

### 3. Task Dashboard + Navigation
Main layout includes:
- Left sidebar buttons:
  - Hero, Tasks, Categories, Market, Calendar
- Right sidebar buttons:
  - Goals, Habit Tracker, Settings
- Main content area:
  - `#tasksContainer` where tasks/content are injected dynamically

### 4. Sound Feedback
Preloaded audio elements in `public/index.html`:
- `mp3/click.mp3`
- `mp3/menu_option.mp3`
- `mp3/claps.mp3`
- `mp3/success.mp3`
- `mp3/fail.mp3`
- `mp3/magic.mp3`
- `mp3/login.mp3`
- `mp3/login_denied.mp3`
- `mp3/delete.mp3`
- `mp3/buy.mp3`

> Note: Most browsers require a user interaction before audio can play.

### 5. UI Styling + Responsive Rules
- Styling is handled in `public/styles.css`
- Includes layout for:
  - login container
  - sticky task bar
  - scrollable task list
  - left/right sidebars
  - dialogs/modals
  - responsive adjustments for smaller screens

### 6. Deployment (Netlify)
- `netlify.toml` and `public/_redirects` are included for deployment/routing configuration.

---

## Project Structure

- `public/index.html` — application shell (screens, layout, CDN includes, audio tags)
- `public/main.js` — main application logic (dynamic rendering, event handling)
- `public/styles.css` — UI styling
- `public/images/` — images used by the UI (e.g., profile image)
- `public/icons/` — favicon and icon assets
- `public/mp3/` — audio assets
- `database.db` — local database file used by the app (project-specific)
- `netlify.toml` / `public/_redirects` — deployment configuration
- `package.json` / `package-lock.json` — project metadata and dependencies

---

## Getting Started

### Run locally
1. Clone the repository:
   ```bash
   git clone https://github.com/miyigun/plan.git
   ```

2. Enter the folder:
   ```bash
   cd plan
   ```

3. Start a local server (recommended):
   ```bash
   python -m http.server 8000
   ```

4. Open in your browser:
   - `http://localhost:8000/public/`

> Tip: Using a local server is recommended for reliable loading of assets (images/audio) and correct routing behavior.

---

## Technologies Used
- HTML / CSS / JavaScript
- Bootstrap 5 (CDN)
- jQuery + jQuery UI
- Font Awesome

---

## Notes
- The UI is **dynamic**: `#tasksContainer` and other areas are filled by `public/main.js`.
- If you deploy under a subpath, confirm asset paths in `public/index.html` (e.g., `/images/...` vs `images/...`).
- `database.db` is included in the repo; if you intend to use it in production, consider how it’s accessed/updated in your hosting environment.

---

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.