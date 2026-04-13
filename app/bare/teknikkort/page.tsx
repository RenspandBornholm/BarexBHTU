"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BackButton from "@/components/BackButton";

type Card = {
  id: number;
  card_key: string;
  title: string;
  image_url: string | null;
  pdf_url: string | null;
  sort_order: number;
};

export default function TeknikkortPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    async function loadCards() {
      const { data, error } = await supabase
        .from("bare_teknikkort")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setCards(data);
      }
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

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#0f172a",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
  } as const;

  function getPdfUrl(card: Card) {
  if (card.pdf_url) return card.pdf_url;

  if (card.card_key === "teknikkort-1") return "/teknikkort/teknikkort-1.pdf";
  if (card.card_key === "teknikkort-2") return "/teknikkort/teknikkort-2.pdf";
  if (card.card_key === "teknikkort-3") return "/teknikkort/teknikkort-3.pdf";

  return null;
}

return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <BackButton href="/bare" />

        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Teknikkort
        </h1>

        {cards.map((card) => (
          <div key={card.id} style={cardStyle}>
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
                <img
                  src={card.image_url}
                  alt={card.title}
                  style={{ width: "100%", display: "block" }}
                />
              ) : (
                <div style={{ padding: "20px", color: "#cbd5e1" }}>
                  Intet kort uploadet endnu.
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button style={buttonStyle} onClick={() => openModal(card)}>
                Åbn kort
              </button>

              {getPdfUrl(card) ? (
  <a style={buttonStyle} href={getPdfUrl(card)!} download>
    Download PDF
  </a>
) : null}
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
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              background: "#0b1220",
              borderRadius: "18px",
              padding: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "12px",
                flexWrap: "wrap",
              }}
            >
              <button style={buttonStyle} onClick={zoomOut}>
                −
              </button>
              <button style={buttonStyle} onClick={zoomIn}>
                +
              </button>
              <button style={buttonStyle} onClick={closeModal}>
                Luk
              </button>
            </div>

            <div
              style={{
                overflow: "auto",
                maxHeight: "80vh",
                borderRadius: "12px",
              }}
            >
              <img
                src={activeCard.image_url}
                alt={activeCard.title}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}