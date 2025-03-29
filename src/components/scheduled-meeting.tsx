"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Meeting } from "@/lib/types";
import MeetingCard from "@/components/meeting-card";
import { useSession } from "next-auth/react";
import { z } from "zod";

interface ScheduledMeetingProps {
  onScheduleMeeting: (meeting: Meeting) => void;
  meetings: Meeting[];
}

// Define the Zod schema for the event
const eventSchema = z.object({
  summary: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start: z.object({
    dateTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Start time must be a valid date",
    }),
  }),
  end: z.object({
    dateTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "End time must be a valid date",
    }),
  }),
  attendees: z
    .array(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .optional(),
});

export default function ScheduledMeeting({
  onScheduleMeeting,
  meetings,
}: ScheduledMeetingProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});

  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: new Date(startTime).toISOString(),
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
      },
      attendees: [{ email: session.session.user.email }],
    };

    await onScheduleMeeting(event);
    // Reset form fields
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg md:text-xl">
            Schedule a Meeting
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Set a date and time for your future meeting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm">
                Meeting Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Weekly Team Sync"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">
                Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for the meeting"
                className="h-20 border p-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="datetime" className="text-sm">
                Date and Time
              </Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endtime" className="text-sm">
                End Time
              </Label>
              <Input
                id="endtime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Schedule Meeting
            </Button>
          </form>
        </CardContent>
      </Card>

      {meetings.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-md md:text-lg font-medium">
            Your Scheduled Meetings
          </h3>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
