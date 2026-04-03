"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../AdminGuard";

type PersonaleData = {
  arbejdstoej: string;
  moedetid: string;
  praktisk_info: string;
};

const defaultData: PersonaleData = {
  arbejdstoej:
    "Mød op i aftalt arbejdstøj og sørg for, at tøjet er rent og præsentabelt. Hvis der er udleveret særligt eventtøj, skal dette bruges under vagten.",
  moedetid:
    "Mødetid aftales for hvert event. Mød gerne 10-15 minutter før, så der er tid til at få overblik og være klar til start.",
  praktisk_info:
    "Hold øje med beskeder fra ansvarlige, og kontakt en leder med det samme hvis du bliver forsinket eller er forhindret. Sørg altid for at have telefon på dig under vagten.",
};

export default function AdminPersonalePage() {
  const [arbejdstoej, setArbejdstoej] = useState(defaultData.arbejdstoej);
  const [moedetid, setMoedetid] = useState(defaultData.moedetid);
  const [praktiskInfo, setPraktiskInfo] = useState(defaultData.praktisk_info);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from("bare_personale")
        .select("*")
        .eq("section_key", "default")
        .single();

      if (error || !data) return;

      setArbejdstoej(data.arbejdstoej || defaultData.arbejdstoej);
      setMoedetid(data.moedetid || defaultData.moedetid);
      setPraktiskInfo(data.praktisk_info || defaultData.praktisk_info);
    }

    loadData();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("bare_personale").upsert(
      {
        section_key: "default",
        arbejdstoej,
        moedetid,
        praktisk_info: praktiskInfo,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section_key" }
    );

    if (error) {
      alert("Der skete en fejl ved gem.");
      return;
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1800);
  }

  function handleReset() {
    setArbejdstoej(defaultData.arbejdstoej);
    setMoedetid(defaultData.moedetid);
    setPraktiskInfo(defaultData.praktisk_info);
  }

  const pageStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #13213b 0%, #0b1220 50%, #08101c 100%)",
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
    background:
      "linear-gradient(135deg, rgba(12,27,51,0.96), rgba(8,17,31,0.98))",
    border: "1px solid rgba(96,165,250,0.30)",
    borderRadius: "22px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
  } as const;

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#dbe4f0",
    fontWeight: "bold",
    fontSize: "15px",
  } as const;

  const textareaStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    boxSizing: "border-box" as const,
    minHeight: "140px",
    resize: "vertical" as const,
  };

  return (
    <AdminGuard>
      <div style={pageStyle}>
        <div style={wrapperStyle}>
          <a
            href="/admin"
            style={{
              display: "inline-block",
              marginBottom: "20px",
              color: "#cbd5e1",
              textDecoration: "none",
            }}
          >
            ← Tilbage til admin
          </a>

          <h1
            style={{
              textAlign: "center",
              fontSize: "clamp(30px, 6vw, 44px)",
              margin: "0 0 10px 0",
            }}
          >
            Admin · Personale
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#cbd5e1",
              margin: "0 0 30px 0",
              fontSize: "16px",
            }}
          >
            Ret info om arbejdstøj, mødetid og praktisk info
          </p>

          <form onSubmit={handleSave}>
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Arbejdstøj</h2>
              <label style={labelStyle}>Tekst</label>
              <textarea
                value={arbejdstoej}
                onChange={(e) => setArbejdstoej(e.target.value)}
                style={textareaStyle}
              />
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Mødetid</h2>
              <label style={labelStyle}>Tekst</label>
              <textarea
                value={moedetid}
                onChange={(e) => setMoedetid(e.target.value)}
                style={textareaStyle}
              />
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Praktisk info</h2>
              <label style={labelStyle}>Tekst</label>
              <textarea
                value={praktiskInfo}
                onChange={(e) => setPraktiskInfo(e.target.value)}
                style={textareaStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                style={{
                  flex: 1,
                  minWidth: "220px",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "none",
                  background: "#ffffff",
                  color: "#0b1220",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                }}
              >
                Gem ændringer
              </button>

              <button
                type="button"
                onClick={handleReset}
                style={{
                  flex: 1,
                  minWidth: "220px",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "transparent",
                  color: "#dbe4f0",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Nulstil felter
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0b1220, #1b2433)",
              padding: "30px",
              borderRadius: "24px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              minWidth: "260px",
            }}
          >
            <img
              src="/bare-logo.png"
              alt="BARE"
              style={{
                width: "140px",
                marginBottom: "18px",
              }}
            />

            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              ✔️
            </div>

            <div
              style={{
                fontSize: "18px",
                color: "#dbe4f0",
                fontWeight: "bold",
              }}
            >
              Gemt!
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}