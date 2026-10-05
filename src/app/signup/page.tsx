import Link from "next/link";
import { signUp } from "@/app/signup/actions";

const ERRORS: Record<string, string> = {
  MissingFields: "Fill in every field to continue.",
  PasswordTooShort: "Password needs to be at least 8 characters.",
  PasswordMismatch: "Those passwords don't match.",
  EmailTaken: "An account with that email already exists — log in instead.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-cream-text-muted">
            The course
          </p>
          <h1 className="mt-2 font-display text-3xl text-cream-text">
            Creative Money
          </h1>
        </div>

        <div className="rounded-xl bg-paper-raised p-7 shadow-xl shadow-black/20">
          <p className="text-sm text-text-muted">
            Create your account to start the course.
          </p>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {ERRORS[error] ?? "Something went wrong. Try again."}
            </p>
          )}

          <form action={signUp} className="mt-5 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Name (optional)"
              className="w-full rounded-md border border-paper-line bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brass focus:outline-none"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-md border border-paper-line bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brass focus:outline-none"
            />
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="Password (min. 8 characters)"
              className="w-full rounded-md border border-paper-line bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brass focus:outline-none"
            />
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={8}
              placeholder="Confirm password"
              className="w-full rounded-md border border-paper-line bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brass focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-ink px-3.5 py-2.5 text-sm font-medium text-cream-text transition-colors hover:bg-ink-light"
            >
              Create account
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-text underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
