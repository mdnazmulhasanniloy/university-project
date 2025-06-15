"use client";
import { getGoogleMapAPIKey } from "@/config/envConfig";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";
import CustomLoader from "../CustomLoader/CustomLoader";
import { useSetGeoLocation } from "@/hooks/useSetGeoLocation";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { MapPinHouse } from "lucide-react";

const GoogleMapContainer = ({
  // radius,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  address,
  setAddress,
  className,
}) => {
  const [map, setMap] = useState(null);
  const searchInputRef = useRef();
  const setGeoLocationToStore = useSetGeoLocation();

  // Check if map is loaded correctly based upon the given API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: getGoogleMapAPIKey(),
    libraries: ["places"],
  });

  // Center the map marker initially based on the given coordinates
  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude],
  );

  // Function to change the coordinates of the map marker
  const changeCoordinates = (coord) => {
    const { latLng } = coord;
    const lat = latLng?.lat();
    const lng = latLng?.lng();

    setLatitude(lat);
    setLongitude(lng);
  };

  // Pan marker to changed coordinates
  useEffect(() => {
    map?.panTo({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  const handlePlacesChanged = () => {
    // searchInputRef.current.getPlaces() -----> the getPlaces() method comes from
    // google-places-autocomplete api. So, the searchInputRef is connected to a component
    // in our case(<StandaloneSearchBox/>) which bts integrates google-places-autocomplete
    const [place] = searchInputRef.current.getPlaces();

    if (place) {
      setAddress(place.formatted_address);
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
  };

  // Function to get user's current location
  const handleLocateMe = async () => {
    const location = await setGeoLocationToStore();

    if (location) {
      setLongitude(location?.coordinates[0]);
      setLatitude(location?.coordinates[1]);

      setAddressFromCoord(location?.coordinates[1], location?.coordinates[0]);
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setLatitude(lat);
    setLongitude(lng);

    setAddressFromCoord(lat, lng);
    // const geocoder = new google.maps.Geocoder();

    // geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    //   if (status === "OK" && results[0]) {
    //     setAddress(results[0].formatted_address); // Set address from geocoder result
    //   } else {
    //     console.error("Geocoder failed due to: " + status);
    //   }
    // });
  };

  const setAddressFromCoord = (lat, lng) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address); // Set address from geocoder result
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  return (
    <div className="h-96 w-full">
      {!isLoaded ? (
        <CustomLoader />
      ) : (
        <GoogleMap
          mapContainerClassName={cn(
            "w-full h-full border-slate-200 border rounded-lg hover:shadow-lg transition-all duration-300 ease-in-out relative",
            className,
          )}
          center={center}
          zoom={10}
          onLoad={(map) => setMap(map)}
          onClick={handleMapClick}
        >
          <StandaloneSearchBox
            onLoad={(ref) => (searchInputRef.current = ref)}
            onPlacesChanged={handlePlacesChanged}
          >
            <div className="relative left-48 top-2.5 max-w-[300px]">
              <input
                type="text"
                placeholder="Search your address"
                value={address}
                className="form-control w-full border border-gray-400 bg-white px-3 py-2 pl-8 text-black"
                onChange={(e) => setAddress(e.target.value)}
              />

              <Search
                size={18}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </StandaloneSearchBox>

          <button
            type="button"
            onClick={handleLocateMe}
            className="border-red flex-center absolute right-2 top-1/3 z-50 aspect-square size-10 rounded-none border-none bg-white text-gray-600 shadow"
            title="Locate my location"
          >
            <MapPinHouse size={23} />
          </button>

          <Marker
            position={{ lat: latitude, lng: longitude }}
            draggable
            onDragEnd={changeCoordinates}
            animation={google.maps.Animation.DROP}
          />
        </GoogleMap>
      )}
    </div>
  );
};

export default GoogleMapContainer;
