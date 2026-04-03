"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../AdminGuard";

type TeknikkortRow = {
  id: number;
  card_key: string;
  title: string;
  image_url: string | null;
  pdf_url: string | null;
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
      .order("card_key", { ascending: true });

    if (!error && data) {
      setCards(data);
    }

    setLoading(false);
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
          image_url: newImageUrl,
          pdf_url: newPdfUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("card_key", card.card_key);

      if (error) {
        alert("Der skete en fejl ved gem.");
        setSaving((prev) => ({ ...prev, [card.card_key]: false }));
        return;
      }

      setImageFiles((prev) => ({ ...prev, [card.card_key]: null }));
      setPdfFiles((prev) => ({ ...prev, [card.card_key]: null }));

      await loadCards();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
    } catch (err: any) {
  console.error("Upload fejl:", err);
  alert(`Upload fejlede: ${err?.message || err || "Ukendt fejl"}`);
} finally {
      setSaving((prev) => ({ ...prev, [card.card_key]: false }));
    }
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
    padding: "12px",
    marginBottom: "18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#0f172a",
    color: "white",
    fontSize: "15px",
    boxSizing: "border-box" as const,
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
          Admin · Teknikkort
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            margin: "0 0 30px 0",
            fontSize: "16px",
          }}
        >
          Upload nye teknikkort og PDF-filer
        </p>

        {loading ? (
          <p>Indlæser...</p>
        ) : (
          cards.map((card) => (
            <div key={card.card_key} style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>{card.title}</h2>

              {card.image_url ? (
                <div
                  style={{
                    marginBottom: "16px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <img
                    src={card.image_url}
                    alt={card.title}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>
              ) : (
                <p style={{ color: "#cbd5e1" }}>Intet billede uploadet endnu.</p>
              )}

              <div style={{ marginBottom: "12px", color: "#cbd5e1" }}>
                {card.pdf_url ? "PDF er uploadet." : "Ingen PDF uploadet endnu."}
              </div>

              <label style={labelStyle}>Nyt billede</label>
              <input
                type="file"
                accept="image/*"
                style={inputStyle}
                onChange={(e) =>
                  setImageFiles((prev) => ({
                    ...prev,
                    [card.card_key]: e.target.files?.[0] || null,
                  }))
                }
              />

              <label style={labelStyle}>Ny PDF</label>
              <input
                type="file"
                accept="application/pdf"
                style={inputStyle}
                onChange={(e) =>
                  setPdfFiles((prev) => ({
                    ...prev,
                    [card.card_key]: e.target.files?.[0] || null,
                  }))
                }
              />

              <button
                type="button"
                onClick={() => handleSave(card)}
                disabled={saving[card.card_key]}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "none",
                  background: "#ffffff",
                  color: "#0b1220",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                  opacity: saving[card.card_key] ? 0.7 : 1,
                }}
              >
                {saving[card.card_key] ? "Gemmer..." : "Gem teknikkort"}
              </button>
            </div>
          ))
        )}
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