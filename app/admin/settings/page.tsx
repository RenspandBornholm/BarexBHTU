"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../AdminGuard";

export default function AdminSettingsPage() {
  const [bareLogo, setBareLogo] = useState<string | null>(null);
  const [bhtuLogo, setBhtuLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from("portal_settings")
      .select("*");

    if (!data) return;

    setBareLogo(data.find(d => d.key === "bare_logo")?.value || null);
    setBhtuLogo(data.find(d => d.key === "bhtu_logo")?.value || null);

    setLoading(false);
  }

  async function uploadLogo(file: File, key: string) {
    setSaving(key);

    const fileName = `${key}-${Date.now()}.png`;

    const { error } = await supabase.storage
      .from("logos")
      .upload(fileName, file);

    if (error) {
      alert("Upload fejl");
      setSaving(null);
      return;
    }

    const { data } = supabase.storage
      .from("logos")
      .getPublicUrl(fileName);

    await supabase
      .from("portal_settings")
      .update({ value: data.publicUrl })
      .eq("key", key);

    await loadSettings();
    setSaving(null);
  }

  if (loading) {
    return <div className="p-6 text-white">Loader...</div>;
  }

  return (
    <AdminGuard>
      <div className="p-6 text-white max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">⚙️ Logo indstillinger</h1>

        {/* BARE */}
        <div className="mb-10 bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl mb-4">BARE logo</h2>

          {bareLogo ? (
            <img src={bareLogo} className="h-16 mb-4" />
          ) : (
            <p className="text-white/50 mb-4">Ingen logo uploadet</p>
          )}

          <label className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl">
            {saving === "bare_logo" ? "Uploader..." : "Upload logo"}
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                e.target.files &&
                uploadLogo(e.target.files[0], "bare_logo")
              }
            />
          </label>
        </div>

        {/* BHTU */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl mb-4">BHTU logo</h2>

          {bhtuLogo ? (
            <img src={bhtuLogo} className="h-16 mb-4" />
          ) : (
            <p className="text-white/50 mb-4">Ingen logo uploadet</p>
          )}

          <label className="cursor-pointer inline-block bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-xl">
            {saving === "bhtu_logo" ? "Uploader..." : "Upload logo"}
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                e.target.files &&
                uploadLogo(e.target.files[0], "bhtu_logo")
              }
            />
          </label>
        </div>
      </div>
    </AdminGuard>
  );
}