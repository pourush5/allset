# AllSet ✈️ — Pre-Journey Tree Checklist Mobile App

**AllSet** is a pre-journey mobile application specifically designed to organize travel packing and departure preparations as an **interactive hierarchical tree**.

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

## 📱 Running on Mobile

### Option 1: React Native (Expo Go)
Run the native React Native app directly on your iPhone or Android device:

```bash
npm run expo
```
1. Install **Expo Go** on your phone from the [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779) or [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent).
2. Scan the QR code displayed in your terminal with your phone camera (iOS) or the Expo Go app (Android).
3. The app will launch natively on your phone with live reload and physical haptics!

### Option 2: Mobile Web PWA
Run the mobile web / PWA version:
```bash
npm run dev
```
To find the IP and QR code for your phone browser:
```bash
npm run mobile
```

---

## 🛠️ Scripts Reference

- `npm run expo`: Start React Native development server with Expo Go QR code
- `npm run expo:android`: Open in Android emulator / connected device
- `npm run expo:ios`: Open in iOS simulator
- `npm run dev`: Start Vite web app dev server
- `npm run mobile`: Print mobile LAN URL and scan QR code for web PWA
- `npm run build`: Type-check and build web bundle
- `npm run lint`: Lint code with Oxlint
