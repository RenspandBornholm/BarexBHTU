"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/admin/login";
        return;
      }

      setEmail(session.user.email || "");
      setLoading(false);
    }

    checkUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  const pageStyle = {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #13213b 0%, #0b1220 50%, #08101c 100%)",
    color: "white",
    fontFamily: "Arial, sans-serif",
    padding: "40px 18px 70px",
  } as const;

  const wrapperStyle = {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto",
  } as const;

  const cardStyle = {
    display: "block",
    textDecoration: "none",
    background: "linear-gradient(135deg, rgba(12,27,51,0.96), rgba(8,17,31,0.98))",
    border: "1px solid rgba(96,165,250,0.30)",
    borderRadius: "22px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
    color: "white",
  } as const;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at top, #13213b 0%, #0b1220 50%, #08101c 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Indlæser admin...
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <a
            href="/"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
            }}
          >
            ← Tilbage til portal
          </a>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "transparent",
              color: "#dbe4f0",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Log ud
          </button>
        </div>

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(30px, 6vw, 44px)",
            margin: "0 0 10px 0",
          }}
        >
          Admin
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            margin: "0 0 10px 0",
            fontSize: "16px",
          }}
        >
          Herfra kan indholdet i medarbejderportalen redigeres
        </p>

        <p
          style={{
            textAlign: "center",
            color: "#93c5fd",
            margin: "0 0 30px 0",
            fontSize: "14px",
          }}
        >
          Logget ind som: {email}
        </p>

        <a href="/admin/teknikkort" style={cardStyle}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "26px" }}>Teknikkort</h2>
          <p style={{ margin: 0, color: "#dbe4f0" }}>
            Upload eller udskift teknikkort
          </p>
        </a>

        <a href="/admin/kontakter" style={cardStyle}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "26px" }}>Kontakter</h2>
          <p style={{ margin: 0, color: "#dbe4f0" }}>
            Ret kontaktpersoner, telefonnumre og e-mail
          </p>
        </a>

        <a href="/admin/faq" style={cardStyle}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "26px" }}>FAQ</h2>
          <p style={{ margin: 0, color: "#dbe4f0" }}>
            Tilføj, redigér eller slet spørgsmål og svar
          </p>
        </a>

        <a href="/admin/forplejning" style={cardStyle}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "26px" }}>Forplejning</h2>
          <p style={{ margin: 0, color: "#dbe4f0" }}>
            Ret spisetider, menu og information
          </p>
        </a>

        <a href="/admin/personale" style={cardStyle}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "26px" }}>Personale</h2>
          <p style={{ margin: 0, color: "#dbe4f0" }}>
            Ret arbejdstøj, mødetid og praktisk info
          </p>
        </a>

        <a href="/admin/settings" style={cardStyle}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "26px" }}>Logoer</h2>
          <p style={{ margin: 0, color: "#dbe4f0" }}>
            Upload og skift logo for BARE og BHTU
          </p>
        </a>
      </div>
    </div>
  );
}