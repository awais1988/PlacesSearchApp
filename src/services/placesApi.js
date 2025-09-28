import { placesApi } from "./apiClient";

export const fetchPlaceDetails = async (placeId) => {
  try {
    const response = await placesApi.getDetails(placeId);
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.result.geometry.location;
      return {
        lat,
        lng,
        name: response.data.result.name,
        address: response.data.result.formatted_address,
        types: response.data.result.types,
        businessStatus: response.data.result.business_status,
      };
    }
    throw new Error(
      response.data.error_message || "Failed to fetch place details"
    );
  } catch (error) {
    console.error("Place details error:", error);
    throw error;
  }
};

export const searchPlaces = async (query) => {
  try {
    const response = await placesApi.searchPlaces(query);
    if (response.data.status === "OK") {
      return response.data.predictions.map((pred) => ({
        id: pred.place_id,
        description: pred.description,
        types: pred.types,
        placeType: pred.types ? pred.types[0] : "unknown",
      }));
    }
    return [];
  } catch (error) {
    console.error("Search places error:", error);
    try {
      const fallbackResponse = await placesApi.autocomplete(query);
      if (fallbackResponse.data.status === "OK") {
        return fallbackResponse.data.predictions.map((pred) => ({
          id: pred.place_id,
          description: pred.description,
          types: pred.types,
          placeType: pred.types ? pred.types[0] : "unknown",
        }));
      }
      return [];
    } catch (fallbackError) {
      throw fallbackError;
    }
  }
};
