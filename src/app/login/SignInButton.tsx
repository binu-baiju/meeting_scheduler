"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  const handleSignIn = async () => {
    const result = await signIn("google", { redirect: false }); // Prevent automatic redirect
    console.log("Sign-in result:", result);

    if (result?.error) {
      // Handle sign-in error
      console.error("Sign-in error:", result.error);
    } else {
      // Sign-in successful
      console.log("Sign-in successful:", result);
      // You can add additional logic here, like redirecting the user
    }
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
}
