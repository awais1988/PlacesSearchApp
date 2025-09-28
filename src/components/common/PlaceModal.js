import React from "react";
import { Modal, View, StyleSheet, Dimensions } from "react-native";
import { Card, Button, Text } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { useDispatch } from "react-redux";
import { hideModal } from "../../redux/slices/placesSlice";
import { COLORS } from "../../utils/constants";

const { width, height } = Dimensions.get("window");

const PlaceModal = ({ visible, place, onClose }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideModal());
    onClose?.();
  };

  if (!place) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <Card style={styles.modalCard}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineLarge" style={styles.placeName}>
              {place.name || place.description}
            </Text>
            <Text variant="bodyMedium" style={styles.placeAddress}>
              {place.address}
            </Text>

            {place.lat && place.lng && (
              <MapView
                style={styles.map}
                region={{
                  latitude: place.lat,
                  longitude: place.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: place.lat,
                    longitude: place.lng,
                  }}
                  title={place.name}
                  description={place.address}
                />
              </MapView>
            )}

            <Button
              mode="contained"
              onPress={handleClose}
              style={styles.closeButton}
              labelStyle={styles.buttonLabel}
            >
              Close
            </Button>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalCard: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.TEXT,
  },
  placeAddress: {
    fontSize: 14,
    color: COLORS.TEXTSECONDARY,
    marginBottom: 16,
    lineHeight: 20,
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: "#1976d2",
  },
  buttonLabel: {
    color: COLORS.WHITE,
    fontWeight: "bold",
  },
});

export default PlaceModal;
