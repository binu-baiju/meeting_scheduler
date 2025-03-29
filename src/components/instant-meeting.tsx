"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Meeting } from "@/lib/types"
import MeetingCard from "@/components/meeting-card"

interface InstantMeetingProps {
  onCreateMeeting: () => void
  meetings: Meeting[]
}

export default function InstantMeeting({ onCreateMeeting, meetings }: InstantMeetingProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg md:text-xl">Create Instant Meeting</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Generate a Google Meet link for an immediate meeting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onCreateMeeting} className="w-full md:w-auto" size="lg">
            Create Instant Meeting
          </Button>
        </CardContent>
      </Card>

      {meetings.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-md md:text-lg font-medium">Your Instant Meetings</h3>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

