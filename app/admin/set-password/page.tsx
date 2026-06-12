import { SetPasswordForm } from "@/components/admin/set-password-form";

export const metadata = { title: "Set your password" };

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-ink)] text-[var(--color-bg)] font-bold text-lg mb-4">
            G
          </div>
          <h1 className="font-serif text-3xl tracking-tight text-[var(--color-ink)]">
            Set your password
          </h1>
          <p className="text-sm text-[var(--color-ink-3)] mt-1">
            Choose a password to access the Gagan Mobile Care dashboard
          </p>
        </div>

        <SetPasswordForm />
      </div>
    </div>
  );
}
