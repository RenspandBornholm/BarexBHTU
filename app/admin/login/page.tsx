"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Forkert login");
      return;
    }

    window.location.replace("/admin");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #13213b 0%, #0b1220 50%, #08101c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background:
            "linear-gradient(135deg, rgba(12,27,51,0.96), rgba(8,17,31,0.98))",
          border: "1px solid rgba(96,165,250,0.30)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-block",
            marginBottom: "18px",
            color: "#cbd5e1",
            textDecoration: "none",
          }}
        >
          ← Tilbage
        </a>

        <h1
          style={{
            margin: "0 0 10px 0",
            fontSize: "34px",
            textAlign: "center",
          }}
        >
          Admin login
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            margin: "0 0 24px 0",
          }}
        >
          Log ind for at redigere indhold
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{ display: "block", marginBottom: "8px", color: "#dbe4f0" }}
          >
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mail@eksempel.dk"
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "18px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "#0f172a",
              color: "white",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{ display: "block", marginBottom: "8px", color: "#dbe4f0" }}
          >
            Adgangskode
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "24px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "#0f172a",
              color: "white",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "14px",
              border: "none",
              background: "#ffffff",
              color: "#0b1220",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logger ind..." : "Log ind"}
          </button>
        </form>
      </div>
    </div>
  );
}