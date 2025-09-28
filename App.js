import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import TabNavigator from "./src/screens/TabNavigator";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { loadHistory } from "./src/utils/offlineHandler";
import { loadHistoryFromStorage } from "./src/redux/slices/placesSlice";

const AppInitializer = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedHistory = await loadHistory();
        store.dispatch(loadHistoryFromStorage(savedHistory));
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, []);

  return <TabNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider>
          <AppInitializer />
          <StatusBar style="auto" />
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
