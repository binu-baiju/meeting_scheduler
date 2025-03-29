import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function createInstantMeeting(title: string, token: string) {
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
    throw new Error("Failed to create meeting");
  }

  const data = await response.json();
  return {
    id: data.id,
    link: data.hangoutLink || data.htmlLink,
    title: data.summary,
    dateTime: data.start.dateTime,
  };
}

export async function getUserToken(req: NextRequest) {
  const token = await getToken({ req });
  return token?.access_token;
}
