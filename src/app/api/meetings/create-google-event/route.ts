import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const event = await req.json();

  console.log("event:", event);

  const token = req.headers.get("Authorization")?.split(" ")[1];
  console.log("Authorization token:", token);

  const calendarApiUrl =
    "https://www.googleapis.com/calendar/v3/calendars/primary/events";

  try {
    const response = await fetch(calendarApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          req.headers.get("Authorization")?.split(" ")[1]
        }`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
