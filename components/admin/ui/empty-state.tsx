interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      {icon && (
        <div className="w-10 h-10 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center text-[var(--color-ink-3)] mb-3">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-[var(--color-ink)]">{title}</p>
      {description && (
        <p className="text-xs text-[var(--color-ink-3)] mt-1 max-w-xs">{description}</p>
      )}
    </div>
  );
}
