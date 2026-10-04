export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-xl bg-paper-raised p-7 text-center shadow-xl shadow-black/20">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-moss-light text-moss">
          <svg viewBox="0 0 16 16" className="h-5 w-5" fill="none">
            <path
              d="M2 4.5l6 4.5 6-4.5M2.5 3.5h11a.5.5 0 01.5.5v8a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V4a.5.5 0 01.5-.5z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h1 className="mt-4 font-display text-xl text-text">Check your email</h1>
        <p className="mt-2 text-sm text-text-muted">
          We sent you a sign-in link. Open it on this device to continue.
        </p>
      </div>
    </div>
  );
}
