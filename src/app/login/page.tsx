import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInButton from "./SignInButton";

export default async function Login() {
  const sessions = await auth();
  // console.log("session from login", sessions);
  console.log("gemma from login");

  return (
    <SignInButton />
    // <form
    //   action={async () => {
    //     "use server";
    //     console.log("login intialized");
    //     const result = await signIn("google");
    //     console.log("RESULT:", result);
    //     if (result) {
    //       console.log("Sign in successful:", result);
    //     } else {
    //       console.error("Sign in error:", result);
    //     }
    //   }}
    // >
    //   <div className="flex min-h-screen items-center justify-center bg-gray-50">
    //     <Card className="w-full max-w-md">
    //       <CardHeader className="text-center">
    //         <CardTitle className="text-2xl">Meeting Scheduler</CardTitle>
    //         <CardDescription>
    //           Sign in to create and schedule meetings
    //         </CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <Button className="w-full" type="submit">
    //           Signin with Googl
    //         </Button>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </form>
  );
}
