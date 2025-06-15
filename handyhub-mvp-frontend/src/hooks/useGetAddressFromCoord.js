import { getGoogleMapAPIKey } from "@/config/envConfig";
import { useLoadScript } from "@react-google-maps/api";

export default function useGetAddressFromCoord() {
  // Check if map is loaded correctly based on the given API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: getGoogleMapAPIKey(),
    libraries: ["places"],
  });

  const getAddress = async (lat, lng) => {
    if (!isLoaded) {
      console.error("Google Maps API is not loaded");
      return null;
    }

    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].formatted_address); // Return the formatted address
        } else {
          reject(`Geocoder failed due to: ${status}`);
        }
      });
    });
  };

  return { getAddress };
}
