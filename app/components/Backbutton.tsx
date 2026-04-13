type BackButtonProps = {
  href: string;
  label?: string;
};

export default function BackButton({
  href,
  label = "Tilbage",
}: BackButtonProps) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        marginBottom: "22px",
        borderRadius: "999px",
        textDecoration: "none",
        color: "#e2e8f0",
        fontWeight: 600,
        fontSize: "15px",
        background: "rgba(15, 23, 42, 0.72)",
        border: "1px solid rgba(148, 163, 184, 0.22)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.background = "rgba(30, 41, 59, 0.82)";
        e.currentTarget.style.border = "1px solid rgba(147, 197, 253, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "rgba(15, 23, 42, 0.72)";
        e.currentTarget.style.border = "1px solid rgba(148, 163, 184, 0.22)";
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.08)",
          fontSize: "14px",
          lineHeight: 1,
        }}
      >
        ←
      </span>
      <span>{label}</span>
    </a>
  );
}