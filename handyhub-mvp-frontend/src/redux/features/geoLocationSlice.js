import { createSlice } from "@reduxjs/toolkit";

const geoLocationSlice = createSlice({
  name: "geoLocation",
  initialState: {
    type: "Point",
    coordinates: null,
  },
  reducers: {
    setLocation: (state, action) => {
      state.coordinates = action.payload.coordinates;
    },
  },
});

// selectors
export const selectLocation = (state) => state.geoLocation;

export const { setLocation } = geoLocationSlice.actions;

export default geoLocationSlice.reducer;
