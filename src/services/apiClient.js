import axios from "axios";
import Constants from "expo-constants";
import { API_CONFIG } from "../utils/constants";

const API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey;

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data.status !== "OK" &&
      response.data.status !== "ZERO_RESULTS"
    ) {
      throw new Error(response.data.error_message || "API request failed");
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const placesApi = {
  autocomplete: (input) =>
    apiClient.get(
      `/autocomplete/json?input=${input}&key=${API_KEY}&language=en`
    ),
  searchEstablishments: (input, location = null, radius = 50000) => {
    let url = `/autocomplete/json?input=${input}&key=${API_KEY}&language=en&types=establishment`;

    if (location) {
      url += `&location=${location.lat},${location.lng}&radius=${radius}`;
    }
    return apiClient.get(url);
  },

  searchAddresses: (input, location = null, radius = 50000) => {
    let url = `/autocomplete/json?input=${input}&key=${API_KEY}&language=en&types=address`;

    if (location) {
      url += `&location=${location.lat},${location.lng}&radius=${radius}`;
    }
    return apiClient.get(url);
  },

  searchPlaces: async (input, location = null) => {
    try {
      const establishmentResponse = await placesApi.searchEstablishments(
        input,
        location
      );
      if (establishmentResponse.data.predictions.length > 0) {
        return establishmentResponse;
      }
      const addressResponse = await placesApi.searchAddresses(input, location);
      return addressResponse;
    } catch (error) {
      throw error;
    }
  },

  getDetails: (placeId) =>
    apiClient.get(
      `/details/json?place_id=${placeId}&key=${API_KEY}&fields=geometry,name,formatted_address,types,business_status`
    ),
};

export default apiClient;
