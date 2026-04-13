"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../AdminGuard";

type ForplejningItem = {
  id: number;
  section_key: string;
  title: string;
  body: string;
  sort_order: number;
};

export default function AdminForplejningPage() {
  const [items, setItems] = useState<ForplejningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);

    const { data, error } = await supabase
      .from("portal_forplejning_items")
      .select("*")
      .eq("section_key", "bare")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setItems(data);
    }

    setLoading(false);
  }

  function updateItem(
    id: number,
    field: keyof ForplejningItem,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  async function addNewItem() {
    const nextOrder =
      items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1;

    const { error } = await supabase.from("portal_forplejning_items").insert({
      section_key: "bare",
      title: "Nyt punkt",
      body: "Skriv tekst her...",
      sort_order: nextOrder,
    });

    if (error) {
      alert("Kunne ikke oprette nyt punkt.");
      return;
    }

    loadItems();
  }

  async function deleteItem(id: number) {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette dette punkt?"
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("portal_forplejning_items")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Kunne ikke slette punktet.");
      return;
    }

    loadItems();
  }

  async function handleSave() {
    for (const item of items) {
      const { error } = await supabase
        .from("portal_forplejning_items")
        .update({
          title: item.title,
          body: item.body,
          sort_order: item.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      if (error) {
        alert("Der skete en fejl ved gem.");
        return;
      }
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1800);
    loadItems();
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

  const textareaStyle = {
    ...inputStyle,
    minHeight: "140px",
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
                Admin · Forplejning
              </h1>

              <p
                style={{
                  color: "#cbd5e1",
                  margin: 0,
                  fontSize: "16px",
                }}
              >
                Tilføj, ret og slet forplejningspunkter uden ny deploy
              </p>
            </div>

            <button
              type="button"
              onClick={addNewItem}
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
              + Tilføj punkt
            </button>
          </div>

          {loading ? (
            <p>Indlæser...</p>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} style={cardStyle}>
                  <label style={labelStyle}>Titel</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      updateItem(item.id, "title", e.target.value)
                    }
                    style={inputStyle}
                  />

                  <label style={labelStyle}>Tekst</label>
                  <textarea
                    value={item.body}
                    onChange={(e) =>
                      updateItem(item.id, "body", e.target.value)
                    }
                    style={textareaStyle}
                  />

                  <label style={labelStyle}>Rækkefølge</label>
                  <input
                    type="number"
                    value={item.sort_order}
                    onChange={(e) =>
                      updateItem(item.id, "sort_order", Number(e.target.value))
                    }
                    style={inputStyle}
                  />

                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "transparent",
                      color: "#fca5a5",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Slet punkt
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleSave}
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
                  boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                }}
              >
                Gem ændringer
              </button>
            </>
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