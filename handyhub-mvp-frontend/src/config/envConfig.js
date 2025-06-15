export const getBackendBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASEURL;
};

export const getGoogleMapAPIKey = () => {
  return process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
};

export const getBackendImageUrl = () => {
  return process.env.NEXT_PUBLIC_IMAGE_URL;
};

export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};

export const getSocketUrl = () => {
  return process.env.NEXT_PUBLIC_SOCKET_ENDPOINT;
};
