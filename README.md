# TacticalBind: Advanced AntiMicroX Profile Architect
**TacticalBind** is a professional-grade, local-first editor designed to create complex controller profiles for **AntiMicroX**. It is specifically tailored for simulation games like *Arma 3*, *Star Citizen*, and *DCS World*, where complex input mapping (macros, layers, mode shifting) is essential.
This application runs entirely in your browser or as a local desktop app. No data is sent to the cloud.
---
## 📚 User Manual & Operation Guide
### 1. Getting Started
#### **The Interface**
- **Left Sidebar (Mission Control):** Manage your "Sets" (Modes/Layers), import keybinds, and export your final profile.
- **Center (Schematic):** An interactive Xbox Elite controller. Click any button to configure it.
- **Right Sidebar (Inspector):** The configuration panel where you assign actions, macros, and shifts to the selected button.
### 2. Importing Keybinds (Intel)
Instead of manually typing keys, you can import a list of actions from your game's config file or a text list.
1.  Click **"Import Keybinds"** in the left sidebar.
2.  Paste your list or upload a `.txt` file.
    *   **Format:** `Action Name = Key`
    *   *Example:*
        ```ini
        Reload = R
        Fire = Mouse1
        Jump = Space
        Toggle Camera = Right Ctrl
        ```
3.  Click **"Preview Parse"** to verify the data.
4.  Click **"Confirm Import"**.
5.  These actions now appear in the **"Actions"** library in the bottom right panel.
### 3. Mapping Your Controller
#### **Basic Mapping**
1.  Click a button on the Controller Schematic (e.g., `A`).
2.  The Inspector Panel opens on the right.
3.  **Drag and Drop** an action from the "Actions" library (bottom right) into the **"Tap"** slot.
    *   *Result:* Pressing `A` will trigger that action.
#### **Advanced Triggers**
Each button supports multiple behaviors simultaneously:
-   **Tap:** Triggers when pressed normally.
-   **Hold:** Triggers when held down for a short duration.
-   **Double Tap:** Triggers when double-clicked quickly.
-   **Release:** Triggers when the button is released.
### 4. Mode Shifting & Layers
This is the most powerful feature for complex games. You can change what every button does by switching "Sets".
#### **Creating a New Set**
1.  In the Left Sidebar, click **"New Set"**.
2.  Name it (e.g., "Vehicle Mode" or "Shift Layer").
3.  Select the new set to configure its buttons.
#### **Switching Sets (Two Methods)**
**Method A: Toggle (Tap to Switch)**
*Useful for changing modes permanently (e.g., entering a vehicle).*
1.  Select a button (e.g., `Back`).
2.  Go to the **"Tap"** tab in the Inspector.
3.  In the **"Switch Set (Toggle)"** dropdown, select your target set (e.g., "Vehicle Mode").
4.  *Result:* Pressing `Back` once switches the entire controller to Vehicle Mode. You must map a button in Vehicle Mode to switch back!
**Method B: Layer Shift (Hold to Shift)**
*Useful for temporary access (e.g., holding a paddle to access extra commands).*
1.  Select a button (e.g., `LB` or a Paddle `P1`).
2.  Go to the **"Hold"** tab in the Inspector.
3.  In the **"Layer Shift (Hold)"** dropdown, select your target set.
4.  *Result:* While holding `LB`, the controller uses the target set's mappings. Releasing it returns to the previous set immediately.
### 5. Creating Macros
Macros allow you to execute a sequence of events with a single press.
1.  In the Inspector (bottom right), click the **"Macros"** tab.
2.  Click **"Create New Macro"**.
3.  **Name** your macro (e.g., "Auto-Landing").
4.  **Add Steps**:
    *   **Key Press:** Simulates a keyboard key.
    *   **Delay:** Waits for X milliseconds (crucial for games that need time to register inputs).
    *   **Mouse:** Simulates clicks.
5.  Click **"Save Macro"**.
6.  **Drag and Drop** your new macro into any slot (Tap, Hold, etc.).
### 6. Exporting & Using in AntiMicroX
1.  When finished, click **"Export .amgp"** in the left sidebar.
2.  Save the file to your computer.
3.  Open the **AntiMicroX** application.
4.  Click **"Load"** and select your `.amgp` file.
5.  Your profile is now active!
---
## 🛠️ Troubleshooting
-   **"My Hold action triggers the Tap action too!"**
    *   This is normal behavior in some configurations. Ensure you don't have conflicting actions. AntiMicroX usually handles this by delaying the tap slightly to wait for a hold.
-   **"The XML looks wrong."**
    *   Use the **"View XML Code"** button to preview the output before downloading.
-   **"Sticks are drifting."**
    *   Click the **Settings (Gear Icon)** in the left sidebar and increase the **Deadzone** for the drifting stick (default is usually 0, try 4000-8000).
---
## ⚡ Tech Stack
Built with ❤️ using:
-   React 18 + TypeScript
-   Vite
-   Tailwind CSS + Shadcn UI
-   Zustand (State Management)
-   dnd-kit (Drag & Drop)
*TacticalBind is an open-source project. Contributions are welcome.*