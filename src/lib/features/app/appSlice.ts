import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Meeting {
  id: string;
  link: string;
  title: string;
  dateTime: string;
  isInstant: boolean;
}

interface AppState {
  meetings: Meeting[];
}

const initialState: AppState = {
  meetings: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addMeeting: (state, action: PayloadAction<Meeting>) => {
      state.meetings.push(action.payload);
    },
  },
});

export const { addMeeting } = appSlice.actions;
export default appSlice.reducer;
