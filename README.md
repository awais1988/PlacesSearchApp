# Places Search App

A React Native mobile application built with Expo that allows users to search for places using Google Places Autocomplete API, view them on a map, and maintain search history.

# 🚀 Features

- **Google Places Autocomplete** - Search for places, addresses, and businesses
- **Interactive Maps** - View selected locations on an interactive map
- **Search History** - Automatically save and manage search history
- **Offline Support** - Graceful offline mode handling
- **Redux State Management** - Centralized state management with Redux Toolkit
- **Redux-Observable** - Async operations handled with RxJS epics
- **Modern Architecture** - Clean, scalable codebase with best practices

# 🚀 Features

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit + Redux-Observable
- **Navigation**: React Navigation (Bottom Tabs)
- **UI Components**: React Native Paper
- **Maps**: React Native Maps
- **Async Storage**: @react-native-async-storage/async-storage
- **Networking**: Axios + RxJS

# 📋 Prerequisites

- **Node.js**: Version 22.x
- **npm**: Version 10.x or higher
- **Expo CLI**: Latest version
- **Google Places API Key**

# 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/awais1988/PlacesSearchApp.git
   cd PlacesSearchApp
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

   > **Note**: If you face any issue during installation, try `npm install --legacy-peer-deps`

3. Environment Setup:

> ⚠️ **Note**: The app.json in this repository does not contain the Google API key for security reasons. The version with the API key has been shared separately with HR. Please use that file when running the project locally.

4. Configuration steps Google Places API Key:

- Get your API key from ([Google Cloud Console](https://console.cloud.google.com/welcome?project=endless-science-166713))

- Enable the following APIs:

  - Places API
  - Maps JavaScript API

- Replace YOUR_GOOGLE_PLACES_API_KEY_HERE with your actual API key

# 🏃‍♂️ Running the App

1. Start the development server:

```bash
   npx expo start
```

2. Run on iOS:

```bash
   npx expo run:ios
```

3. Run on Android:

```bash
   npx expo run:android
```

4. Use Expo Go:

- Scan the QR code with Expo Go app on your phone

# 📱 App Structure

```
src/
├── components/              # Reusable UI components
│   ├── common/             # Common components used across the app
│   │   ├── LoadingSpinner.js
│   │   └── PlaceModal.js
│   └── HOCs/               # Higher-Order Components
│       └── WithOfflineHandler.js
│
├── hooks/                  # Custom React hooks
│   └── useNetworkStatus.js
│
├── redux/                  # Redux related files
│   ├── slices/             # Redux slices
│   │   ├── placesSlice.js  # Places related state
│   │   └── uiSlice.js      # UI related state
│   ├── epics/              # Redux-Observable epics
│   │   └── searchEpic.js   # Search functionality logic
│   └── store.js            # Redux store configuration
│
├── screens/                # Screen components
│   ├── MainScreen.js       # Main search screen
│   ├── HistoryScreen.js    # Search history screen
│   └── TabNavigator.js     # Bottom tab navigation
│
├── services/               # API and service layer
│   ├── placesApi.js        # Google Places API integration
│   └── apiClient.js        # Axios client configuration
│
└── utils/                  # Utility functions
    ├── offlineHandler.js   # Offline data handling
    └── constants.js        # App-wide constants

└── App.js
```

# 🎯 Key Implementation Details

## State Management

- **Redux Toolkit** for state slices
- **Redux-Observable** for side effects and async operations
- **Normalized state structure**

## Architecture Patterns

- **HOC Pattern**: `WithOfflineHandler` for network status
- **Custom Hooks**: `useNetworkStatus` for connectivity monitoring
- **Epic Pattern**: RxJS-based async operation handling
- **Container-Presenter Pattern**: Separation of logic and UI

## Performance Optimizations

- **Debounced Search**: 400ms debounce on search input
- **Efficient Re-renders**: React.memo and useCallback where appropriate
- **Optimized Lists**: FlatList with proper key extraction

# ⚠️ Known Limitations & Assumptions

## Limitations

- **Google API Quotas**: Free tier has daily request limits
- **Offline Search**: Search functionality requires internet connection
- **Map Features**: Limited to basic map interactions

## Assumptions

- **API Availability**: Google Places API is accessible and properly configured
- **Network State**: Network status detection works reliably
- **Storage**: AsyncStorage has sufficient space for history data

# 🐛 Troubleshooting

## Common Issues

1. **API Key Errors**

- Verify API key is correct in app.json
- Ensure Places API is enabled in Google Cloud Console
- Check API key restrictions and quotas

2. **Build Issues with --legacy-peer-deps**

- This flag is needed due to specific dependency requirements in Expo
- Some packages may have peer dependency conflicts

3. **Network Request Failures**

- Check internet connectivity
- Review console for specific error messages

4. **Map Not Loading**

- Ensure maps API is enabled in Google Cloud Console
- Verify network connectivity

## ❓ Need Help?

📧 Email: awaisahmed88@gmail.com  
📱 WhatsApp: [0092 3347519288]
