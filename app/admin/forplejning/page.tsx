"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../AdminGuard";

type ForplejningData = {
  morgenmad: string;
  frokost: string;
  aftensmad: string;
  menu: string;
  udlaeg: string;
  madpakke: string;
};

const defaultData: ForplejningData = {
  morgenmad: "07:00 - 09:00",
  frokost: "12:00 - 13:00",
  aftensmad: "18:00 - 20:00",
  menu: "Menu vil blive opdateret løbende.",
  udlaeg: "Hvis du laver udlæg, så gem kvittering og aflever til ansvarlig.",
  madpakke: "Madpakker bestilles dagen før inden kl. 18:00.",
};

export default function AdminForplejningPage() {
  const [morgenmad, setMorgenmad] = useState(defaultData.morgenmad);
  const [frokost, setFrokost] = useState(defaultData.frokost);
  const [aftensmad, setAftensmad] = useState(defaultData.aftensmad);
  const [menu, setMenu] = useState(defaultData.menu);
  const [udlaeg, setUdlaeg] = useState(defaultData.udlaeg);
  const [madpakke, setMadpakke] = useState(defaultData.madpakke);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from("bare_forplejning")
        .select("*")
        .eq("section_key", "default")
        .single();

      if (error || !data) return;

      setMorgenmad(data.morgenmad || defaultData.morgenmad);
      setFrokost(data.frokost || defaultData.frokost);
      setAftensmad(data.aftensmad || defaultData.aftensmad);
      setMenu(data.menu || defaultData.menu);
      setUdlaeg(data.udlaeg || defaultData.udlaeg);
      setMadpakke(data.madpakke || defaultData.madpakke);
    }

    loadData();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("bare_forplejning").upsert(
      {
        section_key: "default",
        morgenmad,
        frokost,
        aftensmad,
        menu,
        udlaeg,
        madpakke,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section_key" }
    );

    if (error) {
      alert("Der skete en fejl ved gem.");
      return;
    }

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1800);
  }

  async function handleReset() {
    setMorgenmad(defaultData.morgenmad);
    setFrokost(defaultData.frokost);
    setAftensmad(defaultData.aftensmad);
    setMenu(defaultData.menu);
    setUdlaeg(defaultData.udlaeg);
    setMadpakke(defaultData.madpakke);
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

  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    boxSizing: "border-box" as const,
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "110px",
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
          Admin · Forplejning
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            margin: "0 0 30px 0",
            fontSize: "16px",
          }}
        >
          Ret spisetider og info til medarbejderportalen
        </p>

        <form onSubmit={handleSave}>
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Spisetider</h2>

            <label style={labelStyle}>Morgenmad</label>
            <input
              type="text"
              value={morgenmad}
              onChange={(e) => setMorgenmad(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Frokost</label>
            <input
              type="text"
              value={frokost}
              onChange={(e) => setFrokost(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Aftensmad</label>
            <input
              type="text"
              value={aftensmad}
              onChange={(e) => setAftensmad(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Menu</h2>
            <label style={labelStyle}>Tekst</label>
            <textarea
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
              style={textareaStyle}
            />
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "18px" }}>
              Private køb / udlæg
            </h2>
            <label style={labelStyle}>Tekst</label>
            <textarea
              value={udlaeg}
              onChange={(e) => setUdlaeg(e.target.value)}
              style={textareaStyle}
            />
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "18px" }}>Madpakker</h2>
            <label style={labelStyle}>Tekst</label>
            <textarea
              value={madpakke}
              onChange={(e) => setMadpakke(e.target.value)}
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
    </div>
    </AdminGuard>
  );
}