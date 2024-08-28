import { createSlice } from "@reduxjs/toolkit";
const initialState =
  "";

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
