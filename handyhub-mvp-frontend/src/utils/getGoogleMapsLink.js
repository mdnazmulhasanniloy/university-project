import { errorToast } from "./customToast";

export default function getGoogleMapsLink(lat, lng) {
  if (!lat || !lng) {
    return errorToast("Invalid coordinates");
  }

  return `https://www.google.com/maps/place/${lat},${lng}`;
}
