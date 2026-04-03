export default function TeltudlejningPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b1220, #1b2433)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "60px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <a
        href="/"
        style={{
          position: "absolute",
          left: "20px",
          top: "20px",
          color: "#cbd5e1",
          textDecoration: "none",
        }}
      >
        ← Tilbage
      </a>

      <img
        src="/teltudlejning-logo.png"
        alt="BHTU"
        style={{
          maxWidth: "260px",
          marginBottom: "20px",
        }}
      />

      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        Bornholms Teltudlejning
      </h1>

      <p style={{ color: "#cbd5e1", marginBottom: "40px" }}>
        Vælg det område du vil åbne
      </p>

      <a
        href="/teltudlejning/kontakt"
        style={{
          padding: "25px 30px",
          borderRadius: "20px",
          background: "#a38543",
          color: "white",
          textDecoration: "none",
          fontSize: "22px",
          fontWeight: "bold",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        }}
      >
        Kontakt
      </a>
    </div>
  );
}