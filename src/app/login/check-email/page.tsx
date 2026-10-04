export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-sm space-y-2 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">
          Check your email
        </h1>
        <p className="text-sm text-neutral-500">
          We sent you a sign-in link. Open it on this device to continue.
        </p>
      </div>
    </div>
  );
}
