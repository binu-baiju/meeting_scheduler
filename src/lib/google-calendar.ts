interface MeetingOptions {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
}

export async function createGoogleMeet(
  accessToken: string,
  options: MeetingOptions
) {
  const event = {
    summary: options.summary,
    description: options.description,
    start: {
      dateTime: options.startTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: options.endTime.toISOString(),
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
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create meeting: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    link: data.hangoutLink,
    startTime: data.start.dateTime,
    endTime: data.end.dateTime,
    summary: data.summary,
  };
}
