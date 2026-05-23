# TaskFlow 📝

> **Day 1 of the 30-Day Web Development Challenge**
>
> A clean, distraction-free, and high-performance minimalist productivity workspace. Inspired by the neat classic layout of tools like early Notion and GitHub.

---

## ✨ Features

- **Distraction-Free Workspace**: Soft light theme (`#f9fafb`) with crisp white card boundaries, sharp borders (`1px solid #e5e7eb`), and high-legibility system sans-serif typography.
- **Dynamic Progress Analytics**: A linear progress bar fills dynamically using smooth CSS transitions as tasks are checked off, alongside total, pending, and completed task counters.
- **In-Place Editing Engine**: Double-click or tap the edit icon to transform a task description into an inline input field instantly. Saves on blur or `Enter` and reverts/cancels on `Escape`.
- **Buttery-Smooth Animations**:
  - **Fluid Task Capturing**: Captured tasks slide up elegantly into position (`@starting-style`).
  - **Animated Collapsing**: Deleted tasks undergo vertical height and padding collapses before node removal from DOM.
  - **Strike-Through Transitions**: Beautiful checklist completion transitions drawing custom strikethroughs.
- **100% Offline Capability (PWA)**: Uses a background Service Worker (`sw.js`) to cache core files, allowing the app to load instantly and run fully offline without any network connectivity.
- **Permanent Browser Sync**: Autoadapts and syncs to browser `LocalStorage` so you never lose your workspace priorities.
- **Mobile-First UX Adjustments**:
  - **No iOS Viewport Auto-Zoom**: Enforces inputs to strictly `16px` on mobile scales, blocking automatic Safari screen zooms.
  - **Inertial momentum list scrolling** (`-webkit-overflow-scrolling: touch`).
  - **Accessible Tap Targets**: All buttons, action icons, and custom checkbox boundaries satisfy WCAG mobile tap target sizes.
  - **Micro active scale downs** (`transform: scale(0.95)`) on click inputs for immediate physical tactile feedback.
- **Time Widget & Quotes**: Real-time 12-hour AM/PM clock with a dynamic calendar date display, and a random footer quote picker to keep you inspired.

---

## 📁 Project Structure

```
DAY 1 --TODO LIST WEBAPP/
├── index.html   # Accessible HTML5 semantic structure & inline SVGs
├── styles.css   # Variables, layout positioning, transitions & media queries
├── app.js       # Capturing forms, state machines, storage sync & events
├── sw.js        # Offline static asset caching & fetch interceptor
└── README.md    # Documentation
```

---

## 🚀 How to Run

### 1. Direct Open (Local Filesystem)
You can double-click **`index.html`** in your file manager to open and use the application immediately. 

> [!NOTE]
> Modern web browsers restrict Service Workers on the `file://` protocol due to security standards. The app will work fully, but offline caching features (Service Worker) will be deactivated.

### 2. Local HTTP Server (Recommended)
To enable the **Service Worker Cache** and experience full offline capabilities, host the files on a local server.

Using **Node.js** (`npx`):
```bash
# Run inside the project directory
npx http-server
```

Using **Python**:
```bash
# Run inside the project directory
python3 -m http.server 8080
```

Once running, open `http://localhost:8080` in your web browser. The service worker will automatically register and cache all assets. You can then toggle your network connection offline and continue using the app!
