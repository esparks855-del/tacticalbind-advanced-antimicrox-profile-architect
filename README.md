# TacticalBind: Advanced AntiMicroX Profile Architect

[aureliabutton]

TacticalBind is a high-performance, client-side React application designed to architect complex controller profiles for AntiMicroX. While specifically tailored for complex simulations like Arma 3, it is adaptable for any game requiring sophisticated input mapping.

It functions as a specialized IDE for input mapping, allowing users to import action lists, visualize an Xbox Elite controller interactively, and assign sophisticated behaviors like Macros, Shift Layers, and Mode Switching. The application operates entirely in the browser (local execution) without backend dependencies, ensuring privacy and speed.

## 🚀 Key Features

-   **Mission Control Interface**: A military-grade, high-contrast UI designed for clarity and efficiency.
-   **Interactive Controller Schematic**: Visual mapping for Xbox Elite controllers, including paddles.
-   **Advanced Input Logic**: Support for Short Tap, Long Press, Double Tap, Release triggers, and Mode Switching.
-   **Macro Engine**: Create complex sequences of actions with precise timing delays.
-   **Layer Management**: robust support for Shift Layers and multiple Modes (e.g., Infantry, Vehicle, Chopper).
-   **Smart Import**: Parse raw `Action=Key` text files into a draggable Action Library.
-   **Native Export**: Generates valid `.amgp` (XML) files ready for immediate use in AntiMicroX.
-   **Local-First Architecture**: All processing happens in your browser. No data is sent to external servers.

## 🛠️ Technology Stack

-   **Core**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS v3, Shadcn UI, Lucide React
-   **State Management**: Zustand
-   **Animation**: Framer Motion
-   **Utilities**: `xml-js` (Parsing/Exporting), `file-saver`
-   **Infrastructure**: Cloudflare Workers (for static serving)

## ⚡ Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   Bun (v1.0 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/tactical-bind.git
    cd tactical-bind
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

3.  Start the development server:
    ```bash
    bun run dev
    ```

The application will be available at `http://localhost:3000`.

## 📖 Usage Guide

1.  **Initialization**: Upon loading, the application presents a default "Set 1" configuration.
2.  **Import Intel**: Use the "Import" tab to upload or paste your keybinding list (format: `ActionName = Key`).
3.  **Visual Mapping**: Click any button on the controller schematic to open the Inspector Panel.
4.  **Configuration**:
    -   Drag actions from the library to specific slots (Tap, Hold, Double Tap).
    -   Configure Macros or Mode Switches in the advanced settings.
5.  **Export**: Click "Export Profile" to download the XML file. Load this file directly into AntiMicroX.

## 📦 Deployment

This project is configured to deploy seamlessly to Cloudflare Workers.

[aureliabutton]

### Manual Deployment

To deploy manually using Wrangler:

1.  Build the project:
    ```bash
    bun run build
    ```

2.  Deploy to Cloudflare:
    ```bash
    bun run deploy
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.