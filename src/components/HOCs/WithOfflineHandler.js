import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

import { COLORS } from "../../utils/constants";

const withOfflineHandler = (WrappedComponent) => {
  return (props) => {
    const { offline } = useSelector((state) => state.ui);
    useNetworkStatus();

    if (offline) {
      return (
        <View style={styles.offlineContainer}>
          <View style={styles.offlineContent}>
            <Text style={styles.offlineTitle}>Offline Mode</Text>
            <Text style={styles.offlineText}>
              You are currently offline. Some features may be limited.
            </Text>
            <Text style={styles.offlineSubtext}>
              Please check your internet connection.
            </Text>
          </View>
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    padding: 20,
  },
  offlineContent: {
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offlineTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.RED,
    marginBottom: 10,
  },
  offlineText: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.TEXTSECONDARY,
    marginBottom: 5,
  },
  offlineSubtext: {
    fontSize: 14,
    textAlign: "center",
    color: COLORS.TEXTSECONDARY,
  },
});

export default withOfflineHandler;
