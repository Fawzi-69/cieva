export function LogoMark({ size = 30 }) {
  const id = `sg${size}`;
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="rgba(139,124,255,.4)" strokeWidth="1" />
        <path d="M16 4l1.9 9.1L27 16l-9.1 2.9L16 28l-1.9-9.1L5 16l9.1-2.9L16 4z" fill={`url(#${id})`} />
        <circle cx="24.5" cy="8.5" r="1.3" fill="#C05CFF" />
        <circle cx="7" cy="22" r="1" fill="#4FD6FF" />
        <defs>
          <linearGradient id={id} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B7BFF" />
            <stop offset="1" stopColor="#4FA8FF" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

export default function Logo({ href = "#top", size = 30, nameSize = 18 }) {
  return (
    <a href={href} style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="Cieva — accueil">
      <LogoMark size={size} />
      <span style={{ font: `700 ${nameSize}px/1 'Space Grotesk',sans-serif`, color: "#F2F4FF" }}>Cieva</span>
    </a>
  );
}
