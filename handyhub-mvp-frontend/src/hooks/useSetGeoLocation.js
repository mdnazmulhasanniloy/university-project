import { useDispatch } from "react-redux";
import { setLocation } from "@/redux/features/geoLocationSlice";
import useGetAddressFromCoord from "./useGetAddressFromCoord";

/**
 * Custom hook to get user's geo-location.
 * If permitted, use it, otherwise fallback to a dummy location (0, 0).
 * Dispatches location to Redux.
 * @returns {Function} A function to call to get the location.
 */
export const useSetGeoLocation = () => {
  const dispatch = useDispatch();

  const setGeoLocationToStore = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              type: "Point",
              coordinates: [
                position.coords.longitude,
                position.coords.latitude,
              ],
            };

            dispatch(setLocation(location));
            resolve(location);
          },
          (error) => {
            const location = {
              type: "Point",
              coordinates: [0, 0], // Default to 0,0 if geolocation is not available
            };

            dispatch(setLocation(location));
            resolve(location);
          },
        );
      } else {
        const location = {
          type: "Point",
          coordinates: [0, 0], // Default to "" if geolocation is not available
        };
        dispatch(setLocation(location));
        resolve(location);
      }
    });
  };

  return setGeoLocationToStore;
};
