"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

export default function ForplejningPage() {
  const [data, setData] = useState<ForplejningData>(defaultData);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from("bare_forplejning")
        .select("*")
        .eq("section_key", "default")
        .single();

      if (error || !data) {
        setData(defaultData);
        return;
      }

      setData({
        morgenmad: data.morgenmad || defaultData.morgenmad,
        frokost: data.frokost || defaultData.frokost,
        aftensmad: data.aftensmad || defaultData.aftensmad,
        menu: data.menu || defaultData.menu,
        udlaeg: data.udlaeg || defaultData.udlaeg,
        madpakke: data.madpakke || defaultData.madpakke,
      });
    }

    loadData();
  }, []);

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
    maxWidth: "620px",
    margin: "0 auto",
  } as const;

  const cardStyle = {
    background:
      "linear-gradient(135deg, rgba(12,27,51,0.96), rgba(8,17,31,0.98))",
    border: "1px solid rgba(96,165,250,0.35)",
    borderRadius: "24px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
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
            marginBottom: "10px",
          }}
        >
          Forplejning
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "30px",
          }}
        >
          Alt info om mad og pauser
        </p>

        <div style={cardStyle}>
          <h2>Spisetider</h2>
          <p>Morgenmad: {data.morgenmad}</p>
          <p>Frokost: {data.frokost}</p>
          <p>Aftensmad: {data.aftensmad}</p>
        </div>

        <div style={cardStyle}>
          <h2>Menu</h2>
          <p>{data.menu}</p>
        </div>

        <div style={cardStyle}>
          <h2>Private køb / udlæg</h2>
          <p>{data.udlaeg}</p>
        </div>

        <div style={cardStyle}>
          <h2>Bestil madpakke</h2>
          <p>{data.madpakke}</p>
        </div>
      </div>
    </div>
  );
}