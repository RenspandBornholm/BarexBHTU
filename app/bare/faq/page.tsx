"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type FaqItem = {
  question: string;
  answer: string;
};

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

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([
    { question: defaultData.q1, answer: defaultData.a1 },
    { question: defaultData.q2, answer: defaultData.a2 },
    { question: defaultData.q3, answer: defaultData.a3 },
    { question: defaultData.q4, answer: defaultData.a4 },
    { question: defaultData.q5, answer: defaultData.a5 },
    { question: defaultData.q6, answer: defaultData.a6 },
  ]);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from("bare_faq")
        .select("*")
        .eq("section_key", "default")
        .single();

      if (error || !data) return;

      setFaqs([
        { question: data.q1 || defaultData.q1, answer: data.a1 || defaultData.a1 },
        { question: data.q2 || defaultData.q2, answer: data.a2 || defaultData.a2 },
        { question: data.q3 || defaultData.q3, answer: data.a3 || defaultData.a3 },
        { question: data.q4 || defaultData.q4, answer: data.a4 || defaultData.a4 },
        { question: data.q5 || defaultData.q5, answer: data.a5 || defaultData.a5 },
        { question: data.q6 || defaultData.q6, answer: data.a6 || defaultData.a6 },
      ]);
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
    maxWidth: "760px",
    margin: "0 auto",
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

        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.question + index}
              style={{
                background: "linear-gradient(135deg, rgba(12,27,51,0.96), rgba(8,17,31,0.98))",
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
                  {faq.question}
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
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}