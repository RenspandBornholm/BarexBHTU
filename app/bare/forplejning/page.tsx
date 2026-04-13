"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ForplejningItem = {
  id: number;
  title: string;
  body: string;
  sort_order: number;
};

export default function ForplejningPage() {
  const [items, setItems] = useState<ForplejningItem[]>([]);

  useEffect(() => {
    async function loadItems() {
      const { data, error } = await supabase
        .from("portal_forplejning_items")
        .select("*")
        .eq("section_key", "bare")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setItems(data);
      }
    }

    loadItems();
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
    maxWidth: "700px",
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

  const titleStyle = {
    margin: "0 0 10px 0",
    fontSize: "26px",
    fontWeight: "bold",
  } as const;

  const textStyle = {
    margin: 0,
    color: "#dbe4f0",
    fontSize: "16px",
    lineHeight: 1.6,
    whiteSpace: "pre-line" as const,
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

        {items.map((item) => (
          <div key={item.id} style={cardStyle}>
            <h2 style={titleStyle}>{item.title}</h2>
            <p style={textStyle}>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}