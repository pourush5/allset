# AllSet ✈️ — Pre-Journey Tree Checklist Mobile App

**AllSet** is a pre-journey mobile application specifically designed to organize travel packing and departure preparations as an **interactive hierarchical tree**.

Instead of a flat, disorganized checklist, items are structured logically by container or category (e.g. *Main Luggage / Bag* ➔ *Tech Pouch* ➔ *Laptop, Toothbrush, Wallet*). Before traveling, users can tick off nodes directly on an interactive visual tree diagram or in an outline checklist view.

---

## 🌟 Key Features

1. **Tree-Structured To-Dos & Packing Lists**:
   - Organize items by container (e.g., *Main Luggage / Bag*, *Cabin Backpack*, *Coat Pockets*, *Home Departure Checks*).
   - Add children nodes to any container: inside **Bag**, add **Wallet**, **Toothbrush**, **Laptop**, or even sub-categories like *Tech Pouch* or *Clothing*.
   - Supports arbitrary nesting depth (Parents, Children, Sub-children).

2. **Interactive Visual Tree Diagram**:
   - Dynamic SVG Tidy Tree layout engine with smooth Bezier curve branch connectors.
   - Dual orientation support: switch seamlessly between **Horizontal Tree (Left-to-Right)** and **Vertical Tree (Top-Down)**.
   - Fluid touch gestures: drag-to-pan, pinch-to-zoom, and zoom controls.
   - Visual branch indicators: connectors glow green when sub-branches are completed.

3. **Pre-Journey Ticking Experience**:
   - One-tap checkmark directly on any node card.
   - Cascading completion: ticking a parent packs all its children; ticking all children automatically marks the parent 100% completed.
   - Subtree progress badge (e.g., `2/3 (67%)`).
   - Filter chips: switch between **All Items**, **Unpacked Only (Focus Mode)**, and **Packed**.

4. **Outline Checklist View**:
   - Complementary hierarchical checklist outline view with tree branch lines (`├──`, `└──`) and accordion collapsing for rapid one-handed packing.

5. **Audio, Haptic & Celebration Feedback**:
   - Native haptic feedback (`expo-haptics`) on physical mobile devices.
   - Ascending chord chime when a container/bag is completely packed.
   - Victory fanfare and confetti burst when the whole trip reaches 100% completion!

6. **Presets & Offline Storage**:
   - Includes ready-to-use travel templates:
     - **Trip to Tokyo (Flight & Hotel)** — includes Bag with Laptop, Toothbrush, Wallet, Clothes, plus Cabin Tech, Travel Documents, and Home Departure Checks.
     - **Weekend Getaway (Road Trip)**
     - **Start Blank (Clean Canvas)**
   - Persistent storage (`@react-native-async-storage/async-storage` & `localStorage`).

---

## 📱 How to Run on Mobile

### Option 1: Native React Native Mobile App (Expo Go)
Run the native React Native app directly on your physical iPhone or Android device:

```bash
npm run expo
```

1. Install **Expo Go** on your phone:
   - [App Store for iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Open your terminal where `npm run expo` is running.
3. Scan the terminal's QR code:
   - **On iPhone**: Open the built-in Camera app and tap **"Open in Expo Go"**.
   - **On Android**: Open the Expo Go app and tap **"Scan QR code"**.
4. The app runs natively on your device with native gestures and physical haptics!

---

### Option 2: Mobile-First Web PWA
Run the mobile web / PWA version:

```bash
npm run dev
```

To automatically find your local LAN IP address and get a scannable QR code for your mobile browser:
```bash
npm run mobile
```

1. Open your phone's browser to `http://<your-ip>:5173`.
2. Tap **"Add to Home Screen"** in Safari (iOS) or **"Install App"** in Chrome (Android) to install it as an edge-to-edge standalone app!

---

## 🏗️ Project Architecture

```text
allset/
├── mobile/                        # 📱 Native React Native (Expo) App
│   ├── App.tsx                    # React Native Root Component
│   ├── app.json                   # Expo Mobile Configuration
│   ├── index.js                   # Expo Entry Point
│   ├── package.json               # Mobile Dependencies
│   └── src/
│       ├── components/
│       │   ├── VisualTree.tsx     # Native SVG Tree Diagram (Bezier lines & Cards)
│       │   ├── OutlineTree.tsx    # Native ScrollView Checklist Outline
│       │   ├── Header.tsx         # Mobile Header & Progress Bar
│       │   ├── NodeModal.tsx      # Add & Edit Node Modal
│       │   ├── PresetsModal.tsx   # Trip Templates Modal
│       │   ├── CelebrationModal.tsx # 100% Completion Celebration
│       │   └── categoryIcons.tsx  # Lucide React Native Category Icons
│       └── utils/
│           ├── treeUtils.ts       # Pure TypeScript Tree Layout & Cascading Logic
│           ├── presets.ts         # AsyncStorage Persistence & Default Trips
│           └── haptics.ts         # Native Vibration Feedback (expo-haptics)
│
├── src/                           # 🌐 Mobile-First Web PWA (Vite + React)
│   ├── App.tsx                    # Web Root Component
│   ├── components/                # Web Tree & Outline Components
│   └── utils/                     # Web Tree Utils & Web Audio Synthesizer
│
├── scripts/
│   └── mobile-url.cjs             # Network IP Auto-Detector & Terminal QR Generator
└── package.json                   # Root Workspace Scripts
```

---

## 🛠️ Scripts Reference

| Command | Description |
| :--- | :--- |
| `npm run expo` | Start React Native Expo server with terminal QR code |
| `npm run expo:android` | Launch on Android emulator or connected device |
| `npm run expo:ios` | Launch on iOS simulator |
| `npm run dev` | Start Vite development server for Web PWA |
| `npm run mobile` | Print LAN IP and display terminal QR code for phone browser |
| `npm run build` | Compile and type-check web production bundle |
| `npm run lint` | Lint codebase with Oxlint (0 errors, 0 warnings) |

---

## 📄 License
MIT
