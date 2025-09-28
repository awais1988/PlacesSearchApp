import { useState, useEffect } from "react";
import * as Network from "expo-network";
import { useDispatch } from "react-redux";
import { setOffline } from "../redux/slices/uiSlice";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        const online =
          networkState.isConnected && networkState.isInternetReachable;
        setIsOnline(online);
        dispatch(setOffline(!online));
      } catch (error) {
        console.error("Network check error:", error);
        setIsOnline(false);
        dispatch(setOffline(true));
      }
    };

    checkNetworkStatus();

    const interval = setInterval(checkNetworkStatus, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return isOnline;
};
