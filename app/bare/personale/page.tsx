"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

export default function PersonalePage() {
  const [data, setData] = useState<PersonaleData>(defaultData);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from("bare_personale")
        .select("*")
        .eq("section_key", "default")
        .single();

      if (error || !data) return;

      setData({
        arbejdstoej: data.arbejdstoej || defaultData.arbejdstoej,
        moedetid: data.moedetid || defaultData.moedetid,
        praktisk_info: data.praktisk_info || defaultData.praktisk_info,
      });
    }

    loadData();
  }, []);

  const pageStyle = {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #13213b 0%, #0b1220 50%, #08101c 100%)",
    color: "white",
    fontFamily: "Arial, sans-serif",
    padding: "40px 18px 70px",
  } as const;

  const wrapperStyle = {
    width: "100%",
    maxWidth: "700px",
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

  const cardTitleStyle = {
    margin: "0 0 10px 0",
    fontSize: "26px",
    fontWeight: "bold",
  } as const;

  const textStyle = {
    margin: 0,
    color: "#dbe4f0",
    fontSize: "16px",
    lineHeight: 1.6,
  } as const;

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <a
          href="/bare"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#cbd5e1",
            textDecoration: "none",
          }}
        >
          ← Tilbage
        </a>

        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(30px, 6vw, 44px)",
            margin: "0 0 10px 0",
          }}
        >
          Personale
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            margin: "0 0 34px 0",
            fontSize: "16px",
          }}
        >
          Praktisk info til medarbejdere
        </p>

        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Arbejdstøj</h2>
          <p style={textStyle}>{data.arbejdstoej}</p>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Mødetid</h2>
          <p style={textStyle}>{data.moedetid}</p>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Praktisk info</h2>
          <p style={textStyle}>{data.praktisk_info}</p>
        </div>
      </div>
    </div>
  );
}