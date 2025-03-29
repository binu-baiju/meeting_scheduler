"use server";

import { auth, signIn } from "@/auth";

export async function handleSignIn() {
  const sessions = await auth();
  console.log(sessions);
  await signIn("google");
}
