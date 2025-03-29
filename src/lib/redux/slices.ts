"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Meeting } from "@/lib/types"

interface AppState {
  meetings: Meeting[]
}

const initialState: AppState = {
  meetings: [],
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addMeeting: (state, action: PayloadAction<Meeting>) => {
      state.meetings.push(action.payload)
    },
  },
})

export const { addMeeting } = appSlice.actions
export default appSlice.reducer

