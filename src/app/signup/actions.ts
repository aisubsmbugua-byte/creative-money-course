"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

export async function signUp(formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim() || null;
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const password = formData.get("password") as string | null;
  const confirmPassword = formData.get("confirmPassword") as string | null;

  if (!email || !password || !confirmPassword) {
    redirect("/signup?error=MissingFields");
  }
  if (password.length < 8) {
    redirect("/signup?error=PasswordTooShort");
  }
  if (password !== confirmPassword) {
    redirect("/signup?error=PasswordMismatch");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=EmailTaken");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, name, passwordHash } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/course" });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=CredentialsSignin");
    }
    throw error;
  }
}
