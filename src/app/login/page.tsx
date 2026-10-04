import { signIn } from "@/lib/auth";

export default function LoginPage() {
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
            Enter your email and we&apos;ll send you a sign-in link — no password needed.
          </p>
          <form
            action={async (formData) => {
              "use server";
              const email = formData.get("email") as string;
              await signIn("nodemailer", { email, redirectTo: "/course" });
            }}
            className="mt-5 space-y-3"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-md border border-paper-line bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brass focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-ink px-3.5 py-2.5 text-sm font-medium text-cream-text transition-colors hover:bg-ink-light"
            >
              Send sign-in link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
