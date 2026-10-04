import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Creative Money
          </h1>
          <p className="text-sm text-neutral-500">
            Enter your email to get a sign-in link.
          </p>
        </div>
        <form
          action={async (formData) => {
            "use server";
            const email = formData.get("email") as string;
            await signIn("nodemailer", { email, redirectTo: "/course" });
          }}
          className="space-y-3"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Send sign-in link
          </button>
        </form>
      </div>
    </div>
  );
}
