"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../AdminGuard";

export default function AdminSettingsPage() {
  const [bareLogo, setBareLogo] = useState<string>("");
  const [bhtuLogo, setBhtuLogo] = useState<string>("");

  const [bareFile, setBareFile] = useState<File | null>(null);
  const [bhtuFile, setBhtuFile] = useState<File | null>(null);

  const [barePreview, setBarePreview] = useState<string>("");
  const [bhtuPreview, setBhtuPreview] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data, error } = await supabase
      .from("portal_settings")
      .select("key, value")
      .in("key", ["bare_logo", "bhtu_logo"]);

    if (!error && data) {
      const bare = data.find((item) => item.key === "bare_logo")?.value || "";
      const bhtu = data.find((item) => item.key === "bhtu_logo")?.value || "";

      setBareLogo(bare);
      setBhtuLogo(bhtu);
    }

    setLoading(false);
  }

  function handleBareFileChange(file: File | null) {
    if (!file) return;
    setBareFile(file);
    setBarePreview(URL.createObjectURL(file));
    setSuccessMessage("");
  }

  function handleBhtuFileChange(file: File | null) {
    if (!file) return;
    setBhtuFile(file);
    setBhtuPreview(URL.createObjectURL(file));
    setSuccessMessage("");
  }

  async function uploadSingleLogo(file: File, key: "bare_logo" | "bhtu_logo") {
    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `${key}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("logos").getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("portal_settings")
      .update({ value: publicUrl })
      .eq("key", key);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return publicUrl;
  }

  async function handleSave() {
    if (!bareFile && !bhtuFile) {
      alert("Du har ikke valgt noget nyt logo endnu.");
      return;
    }

    try {
      setSaving(true);
      setSuccessMessage("");

      let newBareLogo = bareLogo;
      let newBhtuLogo = bhtuLogo;

      if (bareFile) {
        newBareLogo = await uploadSingleLogo(bareFile, "bare_logo");
      }

      if (bhtuFile) {
        newBhtuLogo = await uploadSingleLogo(bhtuFile, "bhtu_logo");
      }

      setBareLogo(newBareLogo);
      setBhtuLogo(newBhtuLogo);

      setBareFile(null);
      setBhtuFile(null);
      setBarePreview("");
      setBhtuPreview("");

      setSuccessMessage("Gemt ✅");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ukendt fejl ved upload";
      alert("Upload fejl: " + message);
    } finally {
      setSaving(false);
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
    maxWidth: "760px",
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
    color: "white",
  } as const;

  const buttonStyle = {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  } as const;

  const saveButtonStyle = {
    display: "inline-block",
    padding: "14px 22px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: saving ? "#334155" : "#16a34a",
    color: "white",
    fontWeight: "bold",
    cursor: saving ? "default" : "pointer",
    fontSize: "16px",
    boxShadow: "0 12px 24px rgba(0,0,0,0.22)",
  } as const;

  if (loading) {
    return (
      <AdminGuard>
        <div
          style={{
            minHeight: "100vh",
            background:
              "radial-gradient(circle at top, #13213b 0%, #0b1220 50%, #08101c 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Indlæser logo indstillinger...
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div style={pageStyle}>
        <div style={wrapperStyle}>
          <a
            href="/admin"
            style={{
              display: "inline-block",
              marginBottom: "22px",
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "15px",
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
            ⚙️ Logo indstillinger
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#cbd5e1",
              margin: "0 0 30px 0",
              fontSize: "16px",
            }}
          >
            Her kan du ændre logoerne for BARE og BHTU
          </p>

          {successMessage ? (
            <div
              style={{
                marginBottom: "20px",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "rgba(22,163,74,0.14)",
                border: "1px solid rgba(22,163,74,0.35)",
                color: "#bbf7d0",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {successMessage}
            </div>
          ) : null}

          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 18px 0", fontSize: "28px" }}>
              BARE logo
            </h2>

            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: "18px",
                padding: "18px",
                marginBottom: "16px",
                minHeight: "140px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {barePreview || bareLogo ? (
                <img
                  src={barePreview || bareLogo}
                  alt="BARE logo"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100px",
                    objectFit: "contain",
                    background: "white",
                    padding: "12px",
                    borderRadius: "16px",
                  }}
                />
              ) : (
                <span style={{ color: "#94a3b8" }}>Ingen logo uploadet</span>
              )}
            </div>

            <label style={buttonStyle}>
              Vælg logo
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) =>
                  handleBareFileChange(e.target.files?.[0] || null)
                }
              />
            </label>
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 18px 0", fontSize: "28px" }}>
              BHTU logo
            </h2>

            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: "18px",
                padding: "18px",
                marginBottom: "16px",
                minHeight: "140px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {bhtuPreview || bhtuLogo ? (
                <img
                  src={bhtuPreview || bhtuLogo}
                  alt="BHTU logo"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100px",
                    objectFit: "contain",
                    background: "white",
                    padding: "12px",
                    borderRadius: "16px",
                  }}
                />
              ) : (
                <span style={{ color: "#94a3b8" }}>Ingen logo uploadet</span>
              )}
            </div>

            <label
              style={{
                ...buttonStyle,
                background: "#d97706",
              }}
            >
              Vælg logo
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) =>
                  handleBhtuFileChange(e.target.files?.[0] || null)
                }
              />
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "26px",
            }}
          >
            <button
              onClick={handleSave}
              disabled={saving}
              style={saveButtonStyle}
            >
              {saving ? "Gemmer..." : "Gem ændringer"}
            </button>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}