"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../AdminGuard";

type FaqData = {
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
  q4: string;
  a4: string;
  q5: string;
  a5: string;
  q6: string;
  a6: string;
};

const defaultData: FaqData = {
  q1: "Hvornår skal jeg møde?",
  a1: "Mødetid aftales for hvert event. Mød gerne 10-15 minutter før, så du er klar til start og kan få overblik.",
  q2: "Hvad gør jeg, hvis jeg bliver forsinket?",
  a2: "Kontakt en ansvarlig så hurtigt som muligt, hvis du bliver forsinket eller er forhindret i at møde.",
  q3: "Hvor finder jeg teknikkort?",
  a3: "Teknikkort ligger under menupunktet Teknikkort, hvor de kan åbnes direkte på telefonen eller downloades som PDF.",
  q4: "Hvordan bestiller jeg madpakke?",
  a4: "Madpakker bestilles dagen før inden kl. 18:00. Mere info står under menupunktet Forplejning.",
  q5: "Hvem kontakter jeg, hvis jeg er i tvivl om noget?",
  a5: "Gå ind under Kontakt og find den relevante person. Her står telefonnummer og e-mail samlet ét sted.",
  q6: "Hvad gør jeg med private udlæg?",
  a6: "Gem altid kvittering og aflever den til ansvarlig person efter aftale.",
};

export default function AdminFaqPage() {
  const [data, setData] = useState<FaqData>(defaultData);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: row, error } = await supabase
        .from("bare_faq")
        .select("*")
        .eq("section_key", "default")
        .single();

      if (error || !row) return;

      setData({
        q1: row.q1 || defaultData.q1,
        a1: row.a1 || defaultData.a1,
        q2: row.q2 || defaultData.q2,
        a2: row.a2 || defaultData.a2,
        q3: row.q3 || defaultData.q3,
        a3: row.a3 || defaultData.a3,
        q4: row.q4 || defaultData.q4,
        a4: row.a4 || defaultData.a4,
        q5: row.q5 || defaultData.q5,
        a5: row.a5 || defaultData.a5,
        q6: row.q6 || defaultData.q6,
        a6: row.a6 || defaultData.a6,
      });
    }

    loadData();
  }, []);

  function updateField<K extends keyof FaqData>(key: K, value: FaqData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("bare_faq").upsert(
      {
        section_key: "default",
        ...data,
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
    setData(defaultData);
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
    maxWidth: "820px",
    margin: "0 auto",
  } as const;

  const cardStyle = {
    background: "linear-gradient(135deg, rgba(12,27,51,0.96), rgba(8,17,31,0.98))",
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
          Admin · FAQ
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            margin: "0 0 30px 0",
            fontSize: "16px",
          }}
        >
          Ret spørgsmål og svar til medarbejderportalen
        </p>

        <form onSubmit={handleSave}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: "18px" }}>
                Spørgsmål {num}
              </h2>

              <label style={labelStyle}>Spørgsmål</label>
              <input
                type="text"
                value={data[`q${num}` as keyof FaqData] as string}
                onChange={(e) =>
                  updateField(`q${num}` as keyof FaqData, e.target.value)
                }
                style={inputStyle}
              />

              <label style={labelStyle}>Svar</label>
              <textarea
                value={data[`a${num}` as keyof FaqData] as string}
                onChange={(e) =>
                  updateField(`a${num}` as keyof FaqData, e.target.value)
                }
                style={textareaStyle}
              />
            </div>
          ))}

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