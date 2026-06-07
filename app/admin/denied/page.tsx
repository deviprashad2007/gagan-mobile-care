import { signOut } from "@/lib/actions/sign-out";

export default function DeniedPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white border border-[var(--color-line)] rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-[var(--color-ink)] mb-2">Access denied</h1>
        <p className="text-sm text-[var(--color-ink-3)] mb-6">
          Your account has not been approved for admin access. Contact Gagan to request access.
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full py-2.5 bg-[var(--color-ink)] text-white text-sm font-medium rounded-xl"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
