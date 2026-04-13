"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../AdminGuard";
import BackButton from "@/components/BackButton";

type TeknikkortRow = {
  id: number;
  card_key: string;
  title: string;
  image_url: string | null;
  pdf_url: string | null;
  sort_order: number;
};

type SaveState = {
  [key: string]: boolean;
};

export default function AdminTeknikkortPage() {
  const [cards, setCards] = useState<TeknikkortRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SaveState>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});
  const [pdfFiles, setPdfFiles] = useState<Record<string, File | null>>({});

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    setLoading(true);

    const { data, error } = await supabase
      .from("bare_teknikkort")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setCards(data);
    }

    setLoading(false);
  }

  function updateCard(
    id: number,
    field: keyof TeknikkortRow,
    value: string | number | null
  ) {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  }

  async function uploadFile(file: File, path: string) {
    const { error } = await supabase.storage
      .from("teknikkort")
      .upload(path, file, {
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("teknikkort").getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  }

  async function handleSave(card: TeknikkortRow) {
    try {
      setSaving((prev) => ({ ...prev, [card.card_key]: true }));

      let newImageUrl = card.image_url;
      let newPdfUrl = card.pdf_url;

      const imageFile = imageFiles[card.card_key];
      const pdfFile = pdfFiles[card.card_key];

      if (imageFile) {
        const ext = imageFile.name.split(".").pop()?.toLowerCase() || "png";
        const imagePath = `${card.card_key}-image.${ext}`;
        newImageUrl = await uploadFile(imageFile, imagePath);
      }

      if (pdfFile) {
        const ext = pdfFile.name.split(".").pop()?.toLowerCase() || "pdf";
        const pdfPath = `${card.card_key}-file.${ext}`;
        newPdfUrl = await uploadFile(pdfFile, pdfPath);
      }

      const { error } = await supabase
        .from("bare_teknikkort")
        .update({
          title: card.title,
          image_url: newImageUrl,
          pdf_url: newPdfUrl,
          sort_order: card.sort_order,
        })
        .eq("id", card.id);

      if (error) {
        throw error;
      }

      setImageFiles((prev) => ({ ...prev, [card.card_key]: null }));
      setPdfFiles((prev) => ({ ...prev, [card.card_key]: null }));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);

      loadCards();
    } catch (err: any) {
      console.error("Upload fejl:", err);
      alert(`Upload fejlede: ${err?.message || err || "Ukendt fejl"}`);
    } finally {
      setSaving((prev) => ({ ...prev, [card.card_key]: false }));
    }
  }

  async function addNewCard() {
    const nextOrder =
      cards.length > 0 ? Math.max(...cards.map((c) => c.sort_order)) + 1 : 1;

    const cardKey = `kort-${Date.now()}`;

    const { error } = await supabase.from("bare_teknikkort").insert({
      card_key: cardKey,
      title: "Nyt kort",
      image_url: null,
      pdf_url: null,
      sort_order: nextOrder,
    });

    if (error) {
      alert("Kunne ikke oprette nyt kort.");
      return;
    }

    loadCards();
  }

  async function deleteCard(card: TeknikkortRow) {
    const confirmed = window.confirm(
      `Er du sikker på at du vil slette "${card.title}"?`
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("bare_teknikkort")
      .delete()
      .eq("id", card.id);

    if (error) {
      alert("Kunne ikke slette kortet.");
      return;
    }

    loadCards();
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
    maxWidth: "900px",
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
    marginBottom: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    boxSizing: "border-box" as const,
  };

  return (
    <AdminGuard>
      <div style={pageStyle}>
        <div style={wrapperStyle}>
          <BackButton href="/admin" label="Tilbage til admin" />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(30px, 6vw, 44px)",
                  margin: "0 0 10px 0",
                }}
              >
                Admin · Teknikkort
              </h1>

              <p
                style={{
                  color: "#cbd5e1",
                  margin: 0,
                  fontSize: "16px",
                }}
              >
                Tilføj, ret, slet og upload kort uden ny deploy
              </p>
            </div>

            <button
              type="button"
              onClick={addNewCard}
              style={{
                padding: "12px 16px",
                borderRadius: "14px",
                border: "none",
                background: "#ffffff",
                color: "#0b1220",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              + Tilføj kort
            </button>
          </div>

          {loading ? (
            <p>Indlæser...</p>
          ) : (
            cards.map((card) => (
              <div key={card.id} style={cardStyle}>
                <label style={labelStyle}>Titel</label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => updateCard(card.id, "title", e.target.value)}
                  style={inputStyle}
                />

                <label style={labelStyle}>Rækkefølge</label>
                <input
                  type="number"
                  value={card.sort_order}
                  onChange={(e) =>
                    updateCard(card.id, "sort_order", Number(e.target.value))
                  }
                  style={inputStyle}
                />

                <div style={{ marginBottom: "14px", color: "#cbd5e1" }}>
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.title}
                      style={{
                        width: "100%",
                        maxHeight: "260px",
                        objectFit: "cover",
                        borderRadius: "14px",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "14px",
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.08)",
                        marginBottom: "10px",
                      }}
                    >
                      Intet billede uploadet endnu.
                    </div>
                  )}

                  <div style={{ marginBottom: "8px" }}>
                    {card.pdf_url ? "PDF uploadet." : "Ingen PDF uploadet endnu."}
                  </div>
                </div>

                <label style={labelStyle}>Nyt billede</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFiles((prev) => ({
                      ...prev,
                      [card.card_key]: e.target.files?.[0] || null,
                    }))
                  }
                  style={inputStyle}
                />

                <label style={labelStyle}>Ny PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setPdfFiles((prev) => ({
                      ...prev,
                      [card.card_key]: e.target.files?.[0] || null,
                    }))
                  }
                  style={inputStyle}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSave(card)}
                    disabled={saving[card.card_key]}
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
                      opacity: saving[card.card_key] ? 0.7 : 1,
                    }}
                  >
                    {saving[card.card_key] ? "Gemmer..." : "Gem kort"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCard(card)}
                    style={{
                      flex: 1,
                      minWidth: "220px",
                      padding: "16px",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "transparent",
                      color: "#fca5a5",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Slet kort
                  </button>
                </div>
              </div>
            ))
          )}
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