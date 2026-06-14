interface InlineAlertProps {
  tone: "success" | "error";
  message: string;
}

const TONE_CLASSES: Record<InlineAlertProps["tone"], string> = {
  success: "text-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)] border-[color-mix(in_srgb,var(--color-success)_30%,transparent)]",
  error: "text-[var(--color-accent)] bg-[var(--color-accent-soft)] border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)]",
};

export function InlineAlert({ tone, message }: InlineAlertProps) {
  return (
    <p className={`text-sm rounded-xl px-4 py-3 border ${TONE_CLASSES[tone]}`}>
      {message}
    </p>
  );
}
