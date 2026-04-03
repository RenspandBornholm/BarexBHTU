"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "../AdminGuard";

type Contact = {
  id: number;
  section_key: string;
  group_name: string;
  name: string;
  role_text: string;
  phone: string;
  email: string;
  sort_order: number;
};

export default function AdminKontakterPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("portal_contacts")
      .select("*")
      .order("group_name", { ascending: true })
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setContacts(data);
    }

    setLoading(false);
  }

  function updateContact(
    id: number,
    field: keyof Contact,
    value: string | number
  ) {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  }

  async function handleSave() {
    for (const contact of contacts) {
      const { error } = await supabase
        .from("portal_contacts")
        .update({
          section_key: contact.section_key,
          group_name: contact.group_name,
          name: contact.name,
          role_text: contact.role_text,
          phone: contact.phone,
          email: contact.email,
          sort_order: contact.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", contact.id);

      if (error) {
        alert("Der skete en fejl ved gem.");
        return;
      }
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1800);
    loadContacts();
  }

  async function addNewContact(sectionKey: "bare" | "bhtu") {
    const defaultGroupName = sectionKey === "bare" ? "BARE Events" : "BHTU";

    const { error } = await supabase.from("portal_contacts").insert({
      section_key: sectionKey,
      group_name: defaultGroupName,
      name: "Ny kontakt",
      role_text: "",
      phone: "",
      email: "",
      sort_order: 999,
    });

    if (error) {
      alert("Kunne ikke oprette ny kontakt.");
      return;
    }

    loadContacts();
  }

  async function deleteContact(id: number) {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette kontakten?"
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("portal_contacts")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Kunne ikke slette kontakten.");
      return;
    }

    loadContacts();
  }

  const bareContacts = contacts.filter((c) => c.section_key === "bare");
  const bhtuContacts = contacts.filter((c) => c.section_key === "bhtu");

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

  const sectionTitleStyle = {
    margin: "0 0 14px 0",
    fontSize: "28px",
  } as const;

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
            Admin · Kontakter
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#cbd5e1",
              margin: "0 0 30px 0",
              fontSize: "16px",
            }}
          >
            Ret kontaktpersoner for BARE Events, BHTU og nye firmaer
          </p>

          {loading ? (
            <p>Indlæser...</p>
          ) : (
            <>
              <div style={{ marginBottom: "26px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
                  <h2 style={sectionTitleStyle}>BARE / andre firmaer</h2>
                  <button
                    type="button"
                    onClick={() => addNewContact("bare")}
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
                    + Tilføj kontakt
                  </button>
                </div>

                {bareContacts.map((contact) => (
                  <div key={contact.id} style={cardStyle}>
                    <label style={labelStyle}>Firma / gruppe</label>
                    <input
                      type="text"
                      value={contact.group_name}
                      onChange={(e) =>
                        updateContact(contact.id, "group_name", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>Navn</label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) =>
                        updateContact(contact.id, "name", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>Rolle / tekst</label>
                    <input
                      type="text"
                      value={contact.role_text || ""}
                      onChange={(e) =>
                        updateContact(contact.id, "role_text", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>Telefon</label>
                    <input
                      type="text"
                      value={contact.phone || ""}
                      onChange={(e) =>
                        updateContact(contact.id, "phone", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>E-mail</label>
                    <input
                      type="text"
                      value={contact.email || ""}
                      onChange={(e) =>
                        updateContact(contact.id, "email", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>Rækkefølge</label>
                    <input
                      type="number"
                      value={contact.sort_order}
                      onChange={(e) =>
                        updateContact(
                          contact.id,
                          "sort_order",
                          Number(e.target.value)
                        )
                      }
                      style={inputStyle}
                    />

                    <button
                      type="button"
                      onClick={() => deleteContact(contact.id)}
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
                      Slet kontakt
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "26px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
                  <h2 style={sectionTitleStyle}>BHTU</h2>
                  <button
                    type="button"
                    onClick={() => addNewContact("bhtu")}
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
                    + Tilføj kontakt
                  </button>
                </div>

                {bhtuContacts.map((contact) => (
                  <div key={contact.id} style={cardStyle}>
                    <label style={labelStyle}>Firma / gruppe</label>
                    <input
                      type="text"
                      value={contact.group_name}
                      onChange={(e) =>
                        updateContact(contact.id, "group_name", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>Navn</label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) =>
                        updateContact(contact.id, "name", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>Rolle / tekst</label>
                    <input
                      type="text"
                      value={contact.role_text || ""}
                      onChange={(e) =>
                        updateContact(contact.id, "role_text", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>Telefon</label>
                    <input
                      type="text"
                      value={contact.phone || ""}
                      onChange={(e) =>
                        updateContact(contact.id, "phone", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>E-mail</label>
                    <input
                      type="text"
                      value={contact.email || ""}
                      onChange={(e) =>
                        updateContact(contact.id, "email", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <label style={labelStyle}>Rækkefølge</label>
                    <input
                      type="number"
                      value={contact.sort_order}
                      onChange={(e) =>
                        updateContact(
                          contact.id,
                          "sort_order",
                          Number(e.target.value)
                        )
                      }
                      style={inputStyle}
                    />

                    <button
                      type="button"
                      onClick={() => deleteContact(contact.id)}
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
                      Slet kontakt
                    </button>
                  </div>
                ))}
              </div>

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