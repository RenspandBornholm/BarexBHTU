"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BackButton from "../../components/BackButton";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
};

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadFaq() {
      const { data, error } = await supabase
        .from("portal_faq_items")
        .select("*")
        .eq("section_key", "bare")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setItems(data);
      }
    }

    loadFaq();
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
    maxWidth: "760px",
    margin: "0 auto",
  } as const;

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <BackButton href="/bare" />
        <h1
          style={{
            textAlign: "center",
            fontSize: "clamp(30px, 6vw, 44px)",
            margin: "0 0 10px 0",
          }}
        >
          FAQ
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            margin: "0 0 34px 0",
            fontSize: "16px",
            lineHeight: 1.5,
          }}
        >
          Ofte stillede spørgsmål og svar
        </p>

        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.id}
              style={{
                background:
                  "linear-gradient(135deg, rgba(12,27,51,0.96), rgba(8,17,31,0.98))",
                border: "1px solid rgba(96,165,250,0.30)",
                borderRadius: "22px",
                marginBottom: "16px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  textAlign: "left",
                  padding: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    lineHeight: 1.3,
                  }}
                >
                  {item.question}
                </span>

                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#93c5fd",
                    minWidth: "24px",
                    textAlign: "center",
                  }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: "0 20px 20px 20px",
                    color: "#dbe4f0",
                    fontSize: "16px",
                    lineHeight: 1.6,
                  }}
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}