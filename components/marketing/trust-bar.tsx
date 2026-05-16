const trustItems = [
  {
    title: "6-month warranty",
    description: "On all parts and labour",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Genuine parts",
    description: "OEM-grade, never refurbished",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: "Same-day fix",
    description: "Most repairs in 90 minutes",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "No advance",
    description: "Pay only when satisfied",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    title: "Pan-India post",
    description: "Free return courier",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Locked price",
    description: "Quote on call, never higher",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          stroke="none"
          fontWeight="600"
        >
          ₹
        </text>
      </svg>
    ),
  },
] as const;

export function TrustBar() {
  return (
    <section
      id="trust"
      className="py-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-3 lg:grid-cols-6 border border-[var(--color-line)] rounded-2xl overflow-hidden">
        {trustItems.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 p-4 md:p-5 border-r border-b border-[var(--color-line)] last:border-r-0 bg-white text-[var(--color-ink)]"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-soft)] flex items-center justify-center flex-shrink-0 text-[var(--color-ink)]">
              {item.icon}
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight">
                {item.title}
              </p>
              <p className="text-[11px] text-[var(--color-ink-3)] mt-0.5 leading-tight">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
