"use client"

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Meeting } from "@/lib/types"

interface MeetingsState {
  meetings: Meeting[]
}

const initialState: MeetingsState = {
  meetings: [],
}

export const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    addMeeting: (state, action: PayloadAction<Meeting>) => {
      state.meetings.push(action.payload)
    },
  },
})

export const { addMeeting } = meetingsSlice.actions
export default meetingsSlice.reducer

