"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Card = {
  card_key: string;
  title: string;
  image_url: string | null;
  pdf_url: string | null;
};

const fallbackCards: Card[] = [
  {
    card_key: "teknikkort-1",
    title: "Teknikkort 1",
    image_url: "/teknikkort/teknikkort-1.png",
    pdf_url: "/teknikkort/teknikkort-1.pdf",
  },
  {
    card_key: "teknikkort-2",
    title: "Teknikkort 2",
    image_url: "/teknikkort/teknikkort-2.png",
    pdf_url: "/teknikkort/teknikkort-2.pdf",
  },
  {
    card_key: "teknikkort-3",
    title: "Teknikkort 3",
    image_url: "/teknikkort/teknikkort-3.png",
    pdf_url: "/teknikkort/teknikkort-3.pdf",
  },
  {
    card_key: "parkeringskort",
    title: "Parkeringskort",
    image_url: null,
    pdf_url: null,
  },
];

export default function TeknikkortPage() {
  const [cards, setCards] = useState<Card[]>(fallbackCards);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    async function loadCards() {
      const { data } = await supabase
        .from("bare_teknikkort")
        .select("*")
        .order("card_key", { ascending: true });

      if (!data || data.length === 0) return;

      const merged = fallbackCards.map((fallback) => {
        const db = data.find((d) => d.card_key === fallback.card_key);

        return {
          ...fallback,
          image_url: db?.image_url || fallback.image_url,
          pdf_url: db?.pdf_url || fallback.pdf_url,
        };
      });

      setCards(merged);
    }

    loadCards();
  }, []);

  function openModal(card: Card) {
    if (!card.image_url) return;
    setActiveCard(card);
    setZoom(1);
  }

  function closeModal() {
    setActiveCard(null);
  }

  function zoomIn() {
    setZoom((z) => Math.min(z + 0.25, 4));
  }

  function zoomOut() {
    setZoom((z) => Math.max(z - 0.25, 1));
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
    maxWidth: "760px",
    margin: "0 auto",
  } as const;

  const cardStyle = {
    background:
      "linear-gradient(135deg, rgba(12,27,51,0.96), rgba(8,17,31,0.98))",
    border: "1px solid rgba(96,165,250,0.30)",
    borderRadius: "24px",
    padding: "18px",
    marginBottom: "22px",
  } as const;

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <a href="/bare" style={{ color: "#cbd5e1" }}>
          ← Tilbage
        </a>

        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Teknikkort
        </h1>

        {cards.map((card) => (
          <div key={card.card_key} style={cardStyle}>
            <h2>{card.title}</h2>

            <div
              style={{
                background: "#0f172a",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "12px",
              }}
            >
              {card.image_url ? (
                <img src={card.image_url} style={{ width: "100%" }} />
              ) : (
                <div style={{ padding: "20px", color: "#cbd5e1" }}>
                  {card.card_key === "parkeringskort"
                    ? "Her kommer parkeringskortet."
                    : "Intet kort uploadet endnu."}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={() => openModal(card)}>Åbn kort</button>

              {card.pdf_url && (
                <a href={card.pdf_url} download>
                  Download PDF
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeCard && activeCard.image_url && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 999,
            padding: "10px",
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <button onClick={zoomOut}>-</button>
            <button onClick={zoomIn}>+</button>
            <button onClick={closeModal}>Luk</button>

            <div style={{ overflow: "auto" }}>
              <img
                src={activeCard.image_url}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}