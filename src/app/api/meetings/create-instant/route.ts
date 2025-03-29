import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { auth } from "@/auth";
import { createGoogleMeet } from "@/lib/google-calendar";

async function createGoogleMeeting(title: string, token: string) {
  // Current time and end time (30 minutes later)
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 30 * 60000);

  const event = {
    summary: title,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    conferenceData: {
      createRequest: {
        requestId: Date.now().toString(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  console.log(
    "Sending request to Google Calendar API with token:",
    token.substring(0, 10) + "..."
  );

  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google API error:", JSON.stringify(errorData));
      throw new Error(
        `Google Calendar API error: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log("Google Calendar API response:", JSON.stringify(data));
    return {
      id: data.id,
      link: data.hangoutLink || data.htmlLink,
      title: data.summary,
      dateTime: data.start.dateTime,
    };
  } catch (error) {
    console.error("Error in createGoogleMeeting:", error);
    throw error;
  }
}

export async function POST() {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        {
          error: "Not authenticated",
          shouldReauthenticate: true,
        },
        { status: 401 }
      );
    }

    // Create meeting for current time + 30 minutes
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 30 * 60000);

    const meetingData = await createGoogleMeet(session.accessToken as string, {
      summary: "Instant Meeting",
      description: "Meeting created via Meeting Scheduler",
      startTime,
      endTime,
    });

    return NextResponse.json(meetingData);
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting", details: error.message },
      { status: 500 }
    );
  }
}
