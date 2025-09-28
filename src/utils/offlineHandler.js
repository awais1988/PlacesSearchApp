import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveHistory = async (history) => {
  try {
    await AsyncStorage.setItem("placeHistory", JSON.stringify(history));
    console.log("History saved successfully");
  } catch (error) {
    console.error("Save history error:", error);
    throw error;
  }
};

export const loadHistory = async () => {
  try {
    const history = await AsyncStorage.getItem("placeHistory");
    const parsedHistory = history ? JSON.parse(history) : [];

    if (Array.isArray(parsedHistory)) {
      return parsedHistory.filter(
        (item) =>
          item &&
          item.id &&
          (item.name || item.description) &&
          item.lat &&
          item.lng
      );
    }

    return [];
  } catch (error) {
    console.error("Load history error:", error);
    return [];
  }
};

export const clearSavedHistory = async () => {
  try {
    await AsyncStorage.removeItem("placeHistory");
    console.log("History cleared successfully");
  } catch (error) {
    console.error("Clear history error:", error);
    throw error;
  }
};
