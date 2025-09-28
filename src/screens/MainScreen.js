import React, { useCallback, useState } from "react";
import { View, FlatList, StyleSheet, Keyboard } from "react-native";
import { TextInput, Card, List, Text } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import {
  setResults,
  selectPlace,
  addToHistory,
  setSearchQuery,
} from "../redux/slices/placesSlice";
import { setLoading, setError, clearError } from "../redux/slices/uiSlice";
import { fetchPlaceDetails } from "../services/placesApi";
import { saveHistory } from "../utils/offlineHandler";
import withOfflineHandler from "../components/HOCs/WithOfflineHandler";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { COLORS } from "../utils/constants";

const MainScreen = ({ offline }) => {
  const dispatch = useDispatch();
  const { results, selectedPlace, history, searchQuery } = useSelector(
    (state) => state.places
  );
  const { loading, error } = useSelector((state) => state.ui);
  const [localQuery, setLocalQuery] = useState("");

  const handleSearch = (query) => {
    setLocalQuery(query);
    dispatch(setSearchQuery(query));
  };

  const clearSearch = () => {
    setLocalQuery("");
    dispatch(setSearchQuery(""));
    dispatch(setResults([]));
    dispatch(clearError());
  };

  const handleSelectPlace = useCallback(
    async (place) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        Keyboard.dismiss();

        const placeDetails = await fetchPlaceDetails(place.id);

        const selectedPlace = {
          id: place.id,
          description: place.description,
          name: placeDetails.name || place.description,
          address: placeDetails.address,
          lat: placeDetails.lat,
          lng: placeDetails.lng,
          types: place.types,
          placeType: place.placeType,
        };

        dispatch(selectPlace(selectedPlace));
        dispatch(addToHistory(selectedPlace));

        const updatedHistory = [
          selectedPlace,
          ...history.filter((item) => item.id !== selectedPlace.id),
        ].slice(0, 20);
        await saveHistory(updatedHistory);

        dispatch(setResults([]));
        clearSearch();
      } catch (error) {
        dispatch(setError("Failed to fetch place details: " + error.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, history, clearSearch]
  );

  const getPlaceIcon = (placeType) => {
    switch (placeType) {
      case "establishment":
        return "store";
      case "geocode":
        return "map-marker";
      case "address":
        return "home";
      default:
        return "map-marker";
    }
  };

  const renderSuggestionItem = ({ item }) => (
    <List.Item
      title={item.description}
      description={item.types?.join(", ")}
      onPress={() => handleSelectPlace(item)}
      style={styles.suggestionItem}
      left={(props) => (
        <List.Icon {...props} icon={getPlaceIcon(item.placeType)} />
      )}
    />
  );

  return (
    <View style={styles.container}>
      <LoadingSpinner text="Searching..." />

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.title}>
            Search Places
          </Text>

          <TextInput
            mode="outlined"
            placeholder="Search for places"
            value={localQuery}
            onChangeText={handleSearch}
            disabled={offline || loading}
            style={styles.textInput}
            left={<TextInput.Icon icon="magnify" />}
            right={
              localQuery ? (
                <TextInput.Icon icon="close" onPress={clearSearch} />
              ) : null
            }
          />

          {results.length > 0 && (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={renderSuggestionItem}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
            />
          )}

          {searchQuery &&
            searchQuery.length >= 2 &&
            results.length === 0 &&
            !loading &&
            !error && (
              <List.Item
                title="No results found"
                description="Try different search terms"
                left={(props) => (
                  <List.Icon {...props} icon="information" color="#666" />
                )}
              />
            )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title
          title={selectedPlace ? "Selected Location" : "Search for a place"}
          subtitle={
            selectedPlace ? selectedPlace.address : "Results will appear here"
          }
          titleStyle={styles.mapTitle}
        />
        <Card.Content>
          <MapView
            style={styles.map}
            region={{
              latitude: selectedPlace?.lat || 37.7749,
              longitude: selectedPlace?.lng || -122.4194,
              latitudeDelta: selectedPlace ? 0.02 : 0.5,
              longitudeDelta: selectedPlace ? 0.02 : 0.5,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {selectedPlace && (
              <Marker
                coordinate={{
                  latitude: selectedPlace.lat,
                  longitude: selectedPlace.lng,
                }}
                title={selectedPlace.name}
                description={selectedPlace.address}
              />
            )}
          </MapView>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.PRIMARY,
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.TEXT,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  textInput: {
    marginVertical: 8,
  },
  suggestionsList: {
    maxHeight: 200,
    marginTop: 8,
  },
  suggestionItem: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  map: {
    height: 300,
    borderRadius: 8,
  },
});

export default withOfflineHandler(MainScreen);
