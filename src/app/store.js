import { configureStore } from "@reduxjs/toolkit";
import ProblemsDataSlice from "../features/Data/ProblemsDataSlice";
import VideoIframeURLSlice from "../features/VideoIframeUrlSlice";
import IsModalIsOpen from "../features/Data/IsModalOpenSlice.js";
import CourseListSlice from "../features/Courses/CoursesList.js";

export const store = configureStore({
  reducer: {
    ProblemsData: ProblemsDataSlice,
    IFrameURL: VideoIframeURLSlice,
    IsVideoModalOpen: IsModalIsOpen,
    CourseList: CourseListSlice,
  },
});
