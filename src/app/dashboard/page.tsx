"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InstantMeeting from "@/components/instant-meeting";
import ScheduledMeeting from "@/components/scheduled-meeting";
import { addMeeting } from "@/lib/redux/slices";
import type { RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { signIn } from "@/auth";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { meetings } = useSelector((state: RootState) => state.app);
  const [isCreating, setIsCreating] = useState(false);

  const { data: session } = useSession();
  console.log("hoi session from dashaord", session);
  if (!session) return redirect("/login");

  const handleCreateInstantMeeting = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/meetings/create-instant", {
        method: "POST",
      });

      const data = await response.json();

      if (response.status === 401 && data.shouldReauthenticate) {
        await signIn("google", {
          callbackUrl: "/dashboard",
          prompt: "consent",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.details || "Failed to create meeting");
      }

      dispatch(
        addMeeting({
          id: data.id,
          link: data.link,
          title: data.summary,
          dateTime: data.startTime,
          isInstant: true,
        })
      );
    } catch (error) {
      console.error("Failed to create meeting:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleScheduleMeeting = async (event) => {
    try {
      console.log("called scheduled meeting:::::::");
      const response = await fetch("/api/meetings/create-google-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token.access_token}`,
        },
        body: JSON.stringify(event),
      });
      bcbdbchd;

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const data = await response.json();
      dispatch(
        addMeeting({
          id: data.id,
          title: event.summary,
          dateTime: event.start.dateTime,
          link: data.link || "",
          isInstant: false,
        })
      );
      console.log("Event created:", data);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleCreateEvent = async () => {
    const event = {
      summary: "New Event",
      description: "Created from the Dashboard",
      start: {
        dateTime: new Date().toISOString(),
      },
      end: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
      },
      attendees: [{ email: session.session.user.email }],
    };

    try {
      const response = await fetch("/api/meetings/create-google-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token.access_token}`,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const data = await response.json();
      console.log("Event created:", data);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <div className="mb-6 text-center">
        <button onClick={() => signOut()}>Sign Out</button>
        <h1 className="text-2xl md:text-3xl font-bold">Meeting Scheduler</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Create and schedule your meetings
        </p>
        <button
          onClick={handleCreateEvent}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Create Google Calendar Event
        </button>
      </div>

      <Tabs defaultValue="instant" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="instant">Instant Meeting</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Meeting</TabsTrigger>
        </TabsList>
        <TabsContent value="instant">
          <InstantMeeting
            onCreateMeeting={handleCreateInstantMeeting}
            meetings={meetings.filter((m) => m.isInstant)}
          />
        </TabsContent>
        <TabsContent value="scheduled">
          <ScheduledMeeting
            onScheduleMeeting={handleScheduleMeeting}
            meetings={meetings.filter((m) => !m.isInstant)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// export default function Dashboard() {
//   return (
//     <AuthWrapper>
//       <DashboardContent />
//     </AuthWrapper>
//   );
// }
