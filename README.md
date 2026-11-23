# ReactPOC

A modern, simple, and fully functional React Native proof-of-concept (POC) application built with **Expo**, featuring local database persistence (`AsyncStorage`), full dark mode theming, shared real-time state, `.env` environment configuration, and tab navigation.

---

## ✨ Features

- **🔐 Strict Authentication & Validation** — Real email format verification, duplicate account prevention, password length enforcement (min 6 chars), password confirmation, and strict credential verification with inline alerts.
- **📱 Tab Navigation** — Seamless bottom tab navigation (`Home`, `Tasks`, `Profile`) with active badges and theme-reactive styling.
- **💾 Local Database Storage (AsyncStorage)** — Tasks and User Profile data persist automatically offline on the device without requiring an external server.
- **🌓 Dynamic Dark Mode & Theming** — Global theme context that switches every screen, card, modal, and bottom tab bar between light and dark modes with a single toggle.
- **📊 Real-time Shared State** — Task statistics (Completed, Pending, Starred, Percentage) on the Home Screen automatically update in real time as you modify tasks in the Tasks Screen.
- **⚙️ Environment Configuration (`.env`)** — Configured using Expo's native `EXPO_PUBLIC_*` variable support, with an in-app viewer.
- **👤 Editable Profile** — In-app modal to update name, role, email, and bio, persisted to local storage with reset options.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) 0.88 with [Expo](https://expo.dev/) SDK 58
- **Navigation**: [@react-navigation/bottom-tabs](https://reactnavigation.org/)
- **Local Persistence / Storage**: [@react-native-async-storage/async-storage](https://docs.expo.dev/versions/latest/sdk/async-storage/)
- **Icons**: [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons)
- **Environment**: Expo native `.env` (`EXPO_PUBLIC_*`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or bun
- [Expo Go](https://expo.dev/go) app installed on your Android or iOS phone

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/HayeshaPerera/ReactPOC.git
cd ReactPOC

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npm start
```

### Running the App

After starting the server, choose how you want to run it:

- **📱 On your phone with Expo Go**: Scan the QR code displayed in the terminal with:
  - **Android**: Expo Go app
  - **iOS**: Default Camera app
- **🌐 In Web Browser**: Press <kbd>w</kbd> in your terminal.
- **🤖 In Android Emulator**: Press <kbd>a</kbd> (requires Android Studio).
- **🍎 In iOS Simulator**: Press <kbd>i</kbd> (macOS only, requires Xcode).
- **⚡ Remote Tunnel**: Run `npx expo start --tunnel` if your phone is on a different Wi-Fi network.

---

## 📁 Project Structure

```
ReactPOC/
├── .env                      # Active environment variables
├── .env.example              # Environment variable template
├── App.js                    # Root component with Theme, User & Task providers
├── src/
│   ├── config/
│   │   └── env.js            # Environment config helper
│   ├── context/
│   │   ├── ThemeContext.js   # Global Dark/Light mode provider
│   │   ├── TaskContext.js    # Task CRUD + AsyncStorage persistence
│   │   └── UserContext.js    # Profile management + AsyncStorage persistence
│   └── screens/
│       ├── HomeScreen.js     # Live clock, real-time stats & quote rotator
│       ├── TasksScreen.js    # Full task CRUD with categories & star favorites
│       └── ProfileScreen.js  # User profile, theme toggle & edit modal
├── assets/                   # App icons and splash screens
├── app.json                  # Expo app configuration
└── package.json              # Project dependencies
```

---

## 📄 License

MIT License.
