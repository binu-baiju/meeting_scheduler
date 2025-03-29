"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Meeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: Meeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(meeting.link);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-md md:text-lg">{meeting.title}</CardTitle>
        <CardDescription className="text-xs">
          {meeting.isInstant
            ? "Instant Meeting"
            : `Scheduled for ${formatDate(meeting.dateTime)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex items-center justify-between">
          <p className="text-xs md:text-sm font-medium truncate max-w-[60%]">
            {meeting.link}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={copyLink}
            className="text-xs h-8"
          >
            Copy Link
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          variant="outline"
          className="w-full text-xs md:text-sm h-8"
          onClick={() => window.open(meeting.link, "_blank")}
        >
          Join Meeting
        </Button>
      </CardFooter>
    </Card>
  );
}
