import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import {
  List,
  Button,
  IconButton,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  showModal,
  clearHistory,
  removeFromHistory,
  loadHistoryFromStorage,
  selectPlace,
  hideModal,
} from "../redux/slices/placesSlice";
import { setError } from "../redux/slices/uiSlice";
import PlaceModal from "../components/common/PlaceModal";
import { loadHistory, saveHistory } from "../utils/offlineHandler";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../utils/constants";

const HistoryScreen = () => {
  const dispatch = useDispatch();
  const { history, modalVisible, selectedPlace } = useSelector(
    (state) => state.places
  );
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        setLoadingHistory(true);
        const savedHistory = await loadHistory();
        dispatch(loadHistoryFromStorage(savedHistory));
      } catch (error) {
        console.error("Error loading history:", error);
        dispatch(setError("Failed to load history"));
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistoryData();
  }, [dispatch]);

  const handlePlacePress = (place) => {
    dispatch(selectPlace(place));
    dispatch(showModal(place));
  };

  const handleRemoveItem = async (placeId, placeName) => {
    Alert.alert(
      "Remove from History",
      `Are you sure you want to remove "${placeName}" from history?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            dispatch(removeFromHistory(placeId));

            const updatedHistory = history.filter(
              (item) => item.id !== placeId
            );
            await saveHistory(updatedHistory);
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    if (history.length === 0) return;

    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all search history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            dispatch(clearHistory());
            await saveHistory([]);
          },
        },
      ]
    );
  };

  const renderHistoryItem = ({ item }) => (
    <List.Item
      title={item.name || item.description || "Unknown Place"}
      description={item.address || "No address available"}
      descriptionNumberOfLines={2}
      onPress={() => handlePlacePress(item)}
      style={styles.historyItem}
      left={(props) => <List.Icon {...props} icon="history" color="#1976d2" />}
      right={(props) => (
        <IconButton
          icon="delete-outline"
          size={20}
          onPress={() =>
            handleRemoveItem(item.id, item.name || item.description)
          }
          style={styles.deleteButton}
        />
      )}
    />
  );

  if (loadingHistory) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading history...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <View style={styles.historyList}>
        <View style={styles.header}>
          <View>
            <Text variant="titleLarge">Search History</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {history.length} {history.length === 1 ? "item" : "items"}
            </Text>
          </View>
          {history.length > 0 && (
            <Button
              mode="outlined"
              onPress={handleClearHistory}
              style={styles.clearButton}
              icon="delete-sweep"
            >
              Clear All
            </Button>
          )}
        </View>

        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderHistoryItem}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                No search history yet.
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtext}>
                Your searched places will appear here.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
        <PlaceModal
          visible={modalVisible}
          place={selectedPlace}
          onClose={() => dispatch(hideModal())}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  subtitle: {
    color: COLORS.TEXTSECONDARY,
    fontSize: 14,
    marginTop: 2,
  },
  clearButton: {
    height: 40,
  },
  historyList: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.PRIMARY,
  },
  historyItem: {
    backgroundColor: COLORS.WHITE,
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    elevation: 1,
    color: COLORS.BLACK,
  },
  deleteButton: {
    margin: 0,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.TEXTSECONDARY,
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: "center",
    color: COLORS.TEXTSECONDARY,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.TEXTSECONDARY,
  },
});

export default HistoryScreen;
