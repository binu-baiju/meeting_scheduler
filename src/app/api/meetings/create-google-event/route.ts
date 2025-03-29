import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const event = await req.json();

  console.log("event:", event);

  const token = req.headers.get("Authorization")?.split(" ")[1];
  console.log("Authorization token:", token);

  // const calendarApiUrl =
  //   "https://www.googleapis.com/calendar/v3/calendars/primary/events";
  const calendarApiUrl =
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1";

  // Add conferenceData to the event object
  const eventWithConferenceData = {
    ...event,
    conferenceData: {
      createRequest: {
        requestId: Date.now().toString(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  try {
    const response = await fetch(calendarApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventWithConferenceData), // Use the modified event object
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: 500 });
    }

    const data = await response.json();
    console.log("Event created with data:", data); // Log the entire response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
