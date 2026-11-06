# AllSet ✈️ — Pre-Journey Tree Checklist Mobile App

**AllSet** is a pre-journey mobile application specifically designed to organize travel packing and departure preparations as an **interactive hierarchical tree**.

---

## 🌟 Key Features

1. **Tree-Structured To-Dos & Packing Lists**:
   - Organize items by container (e.g., *Main Luggage / Bag*, *Cabin Backpack*, *Coat Pockets*, *Home Departure Checks*).
   - Add children nodes to any container: inside **Bag**, add **Wallet**, **Toothbrush**, **Laptop**, or even sub-categories like *Tech Pouch* or *Clothing*.
   - Supports arbitrary nesting depth (Parents, Children, Sub-children).

2. **Interactive Visual Tree Diagram (Canvas View)**:
   - Dynamic SVG & Tidy Tree layout engine with smooth Bezier curve branch connectors.
   - Dual orientation support: switch seamlessly between **Horizontal Tree (Left-to-Right)** and **Vertical Tree (Top-Down)**.
   - Mobile touch gestures: smooth drag-to-pan, pinch-to-zoom, and zoom controls.
   - Visual branch indicators: connectors glow green when sub-branches are completed.

3. **Pre-Journey Ticking Experience**:
   - One-tap checkmark directly on any node card.
   - Cascading completion: ticking a parent packs all its children; ticking all children automatically marks the parent 100% completed.
   - Subtree progress badge (e.g., `2/3 (67%)`).
   - Filter chips: switch between **All Items**, **Unpacked Only (Focus Mode)**, and **Packed**.

4. **Outline Checklist View**:
   - Complementary hierarchical checklist outline view with tree branch lines (`├──`, `└──`) and accordion collapsing for rapid one-handed packing.

5. **Audio & Celebration Feedback**:
   - Built-in Web Audio API synthesizer for crisp check/uncheck pops.
   - Ascending chord chime when a container/bag is completely packed.
   - Victory fanfare and confetti burst when the whole trip reaches 100% completion!

6. **Presets & Customization**:
   - Includes ready-to-use travel templates:
     - **Trip to Tokyo (Flight & Hotel)** — includes Bag with Laptop, Toothbrush, Wallet, Clothes, plus Cabin Tech, Travel Documents, and Home Departure Checks.
     - **Weekend Getaway (Road Trip)**
     - **Start Blank (Clean Canvas)**
   - Add custom bags, containers, items, or delete with confirmation.
   - Automatic local storage persistence.

---

## 🚀 Running the App

The dev server is running at:
- **Local**: [http://localhost:5173](http://localhost:5173)
- **Mobile on LAN**: Open `http://<your-local-ip>:5173` on your smartphone browser.

### Scripts
- `npm run dev`: Start Vite development server
- `npm run build`: Type-check with TypeScript and build production bundle
- `npm run lint`: Lint code with Oxlint
- `npm run preview`: Preview production build
