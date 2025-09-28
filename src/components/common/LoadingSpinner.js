import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const LoadingSpinner = ({ size = "large", color = "#1976d2", text = "" }) => {
  const { loading } = useSelector((state) => state.ui);

  if (!loading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1000,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default LoadingSpinner;
