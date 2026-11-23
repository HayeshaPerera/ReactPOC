# ReactPOC

A simple React Native proof-of-concept app built with **Expo**, featuring tab navigation, a functional task manager, and a clean modern UI.

## ✨ Features

- **Home Screen** — Live clock, greeting, inspirational quotes, and quick-action cards
- **Tasks Screen** — Full CRUD task manager with categories, progress tracking, and filters
- **Profile Screen** — User profile with preferences, toggles, and account menu
- **Tab Navigation** — Smooth bottom tab navigation with icons

## 🛠 Tech Stack

- [React Native](https://reactnative.dev/) 0.88
- [Expo](https://expo.dev/) SDK 58
- [React Navigation](https://reactnavigation.org/) (Bottom Tabs)
- [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- [Expo Go](https://expo.dev/go) app on your phone (iOS/Android)

### Installation

```bash
# Clone the repo
git clone https://github.com/HayeshaPerera/ReactPOC.git
cd ReactPOC

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

After `npm start`, you can:

- **📱 On your phone:** Scan the QR code with Expo Go (Android) or the Camera app (iOS)
- **🌐 Web:** Press `w` to open in a web browser
- **🤖 Android:** Press `a` to open in Android emulator
- **🍎 iOS:** Press `i` to open in iOS simulator (macOS only)

## 📁 Project Structure

```
ReactPOC/
├── App.js                    # Root component with navigation
├── src/
│   └── screens/
│       ├── HomeScreen.js     # Dashboard with clock & quotes
│       ├── TasksScreen.js    # Task manager with CRUD
│       └── ProfileScreen.js  # User profile & settings
├── assets/                   # App icons and images
├── app.json                  # Expo configuration
└── package.json              # Dependencies
```

## 📄 License

This project is licensed under the MIT License.
