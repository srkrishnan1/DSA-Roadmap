import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteModal: false,
  signInModal: false,
  signOutModal: false,
  codeSnippedModal: false,
  videoModal: false,
  problemModal: false,
  codeId: 1,
};
export const IsModalOpenSlice = createSlice({
  name: "IsVideoModalOpen",
  initialState,
  reducers: {
    setModal: {
      reducer(state, action) {
        state[action.payload.name] = action.payload.value;
      },
      prepare(name, value) {
        return {
          payload: {
            name,
            value,
          },
        };
      },
    },
  },
});
export const IsModalIsOpen = (state) => state.IsVideoModalOpen;
export const { setModal } = IsModalOpenSlice.actions;
export default IsModalOpenSlice.reducer;
