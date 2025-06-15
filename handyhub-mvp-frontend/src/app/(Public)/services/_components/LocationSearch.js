"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGoogleMapAPIKey } from "@/config/envConfig";
import { cn } from "@/lib/utils";
import { useLoadScript } from "@react-google-maps/api";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { MapPinIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function LocationSearch({
  setPropAddress,
  setLocationSearch,
  defaultValue = "",
  searchInputClassName = "",
  label = "",
}) {
  const searchInputRef = useRef();
  const [address, setAddress] = useState(defaultValue || "");

  // Check if map is loaded correctly based upon the given API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: getGoogleMapAPIKey(),
    libraries: ["places"],
  });

  useEffect(() => {
    if (!address) {
      setLocationSearch({
        type: "Points",
        coordinates: [0, 0],
      });
    }
  }, [address]);

  if (!isLoaded) {
    return;
  }

  const handlePlacesChanged = () => {
    const [place] = searchInputRef.current.getPlaces();

    if (place) {
      setAddress(place.formatted_address);

      if (setPropAddress) {
        setPropAddress(place.formatted_address);
      }

      setLocationSearch({
        type: "Points",
        coordinates: [
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ],
      });
    }
  };

  return (
    <section className="relative w-full">
      <StandaloneSearchBox
        onLoad={(ref) => (searchInputRef.current = ref)}
        onPlacesChanged={handlePlacesChanged}
      >
        <>
          {label && <Label className="mb-2 block">{label}</Label>}

          <div className="relative">
            <MapPinIcon
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                address ? "text-map-marker" : "text-dark-gray",
              )}
              size={18}
            />

            <Input
              className={cn(
                "w-full rounded-3xl border border-primary-black px-10 py-6 shadow-sm outline-none !ring-0 !ring-offset-0",
                searchInputClassName,
              )}
              placeholder="Search by Location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </>
      </StandaloneSearchBox>
    </section>
  );
}
