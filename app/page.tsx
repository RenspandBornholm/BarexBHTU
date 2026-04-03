export default function Page() {
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
        paddingBottom: "40px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 44px)",
          fontWeight: "bold",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        Velkommen til medarbejderportalen
      </h1>

      <p
        style={{
          fontSize: "clamp(14px, 3vw, 18px)",
          color: "#cbd5e1",
          marginBottom: "50px",
          textAlign: "center",
        }}
      >
        Vælg hvor du vil gå videre
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "50px",
          alignItems: "center",
        }}
      >
        <a
          href="/bare"
          style={{
            width: "clamp(260px, 60vw, 360px)",
            height: "clamp(260px, 60vw, 360px)",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #123b1f, #0d2515)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "white",
            boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
            padding: "20px",
          }}
        >
          <img
            src="/bare-logo.png"
            alt="BARE Events"
            style={{
              maxWidth: "70%",
              maxHeight: "90px",
              objectFit: "contain",
              marginBottom: "20px",
              background: "white",
              padding: "12px",
              borderRadius: "20px",
            }}
          />
          <span style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "bold" }}>
            BARE Events
          </span>
        </a>

        <a
          href="/teltudlejning"
          style={{
            width: "clamp(260px, 60vw, 360px)",
            height: "clamp(260px, 60vw, 360px)",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #a38543, #7d6531)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "white",
            boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
            padding: "20px",
          }}
        >
          <img
            src="/teltudlejning-logo.png"
            alt="Bornholms Teltudlejning"
            style={{
              maxWidth: "75%",
              maxHeight: "100px",
              objectFit: "contain",
              marginBottom: "20px",
              background: "white",
              padding: "12px",
              borderRadius: "20px",
            }}
          />
          <span
            style={{
              fontSize: "clamp(18px, 3.5vw, 26px)",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Bornholms Teltudlejning
          </span>
        </a>
      </div>
    </div>
  );
}