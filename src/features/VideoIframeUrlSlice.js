import { createSlice } from "@reduxjs/toolkit";
const initialState =
  "https://www.youtube.com/embed/DhOqlEOXlxM?si=yoM-WnVPrSqJOhnn";

export const VideoIframeURLSlice = createSlice({
  name: "IFrameURL",
  initialState,
  reducers: {
    setURL: {
      reducer(state, action) {
        return action.payload;
      },
    },
  },
});

export const selectVideoURL = (state) => state.IFrameURL;
export const { setURL } = VideoIframeURLSlice.actions;
export default VideoIframeURLSlice.reducer;
