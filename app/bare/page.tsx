export default function BarePage() {
  const pageStyle = {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #13213b 0%, #0b1220 45%, #08101c 100%)",
    color: "white",
    fontFamily: "Arial, sans-serif",
    padding: "44px 18px 70px",
  } as const;

  const wrapperStyle = {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
  } as const;

  const baseCard = {
    display: "block",
    width: "100%",
    textDecoration: "none",
    borderRadius: "26px",
    padding: "24px",
    marginBottom: "22px",
    background: "linear-gradient(135deg, rgba(12,27,51,0.96), rgba(8,17,31,0.98))",
    border: "1px solid rgba(96,165,250,0.35)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.32)",
  } as const;

  const cardTitle = {
    margin: 0,
    fontSize: "28px",
    fontWeight: "bold",
    color: "white",
    letterSpacing: "-0.02em",
  } as const;

  const cardText = {
    margin: "8px 0 0",
    color: "#dbe4f0",
    fontSize: "16px",
    lineHeight: 1.5,
  } as const;

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "28px",
            color: "#cbd5e1",
            textDecoration: "none",
            fontSize: "15px",
          }}
        >
          ← Tilbage til forsiden
        </a>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "210px",
              height: "210px",
              borderRadius: "999px",
              background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.06) 45%, rgba(34,197,94,0) 72%)",
              filter: "blur(10px)",
              top: "-28px",
            }}
          />
          <div
            style={{
              position: "relative",
              background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(241,245,249,0.96))",
              padding: "16px 24px",
              borderRadius: "24px",
              boxShadow: "0 20px 45px rgba(0,0,0,0.30)",
              border: "1px solid rgba(255,255,255,0.65)",
            }}
          >
            <img
              src="/bare-logo.png"
              alt="BARE logo"
              style={{
                display: "block",
                width: "100%",
                maxWidth: "240px",
                maxHeight: "84px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            fontWeight: "bold",
            textAlign: "center",
            margin: "0 0 10px 0",
            letterSpacing: "-0.03em",
          }}
        >
          BARE Events
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            margin: "0 0 34px 0",
            fontSize: "17px",
          }}
        >
          Vælg det område du vil åbne
        </p>

        <a href="/bare/forplejning" style={baseCard}>
          <h2 style={cardTitle}>Forplejning</h2>
          <p style={cardText}>
            Spisetider, menu, private køb/udlæg og madpakker
          </p>
        </a>

        <a href="/bare/teknikkort" style={baseCard}>
          <h2 style={cardTitle}>Teknikkort</h2>
          <p style={cardText}>
            Teknik kort og parkeringsoversigt
          </p>
        </a>

        <a href="/bare/personale" style={baseCard}>
          <h2 style={cardTitle}>Personale</h2>
          <p style={cardText}>
            Arbejdstøj, mødetid og medarbejderinfo
          </p>
        </a>

        <a href="/bare/kontakt" style={baseCard}>
          <h2 style={cardTitle}>Kontakt</h2>
          <p style={cardText}>
            Navn, telefon og e-mail
          </p>
        </a>

        <a href="/bare/faq" style={baseCard}>
          <h2 style={cardTitle}>FAQ</h2>
          <p style={cardText}>
            Ofte stillede spørgsmål
          </p>
        </a>
      </div>
    </div>
  );
}