"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Contact = {
  id: number;
  group_name: string;
  name: string;
  role_text: string;
  phone: string;
  email: string;
  sort_order: number;
};

export default function TeltudlejningKontaktPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    async function loadContacts() {
      const { data, error } = await supabase
        .from("portal_contacts")
        .select("*")
        .eq("section_key", "bhtu")
        .order("group_name", { ascending: true })
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setContacts(data);
      }
    }

    loadContacts();
  }, []);

  const grouped = contacts.reduce<Record<string, Contact[]>>((acc, contact) => {
    if (!acc[contact.group_name]) acc[contact.group_name] = [];
    acc[contact.group_name].push(contact);
    return acc;
  }, {});

  const pageStyle = {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #13213b 0%, #0b1220 50%, #08101c 100%)",
    color: "white",
    fontFamily: "Arial, sans-serif",
    padding: "40px 18px 70px",
  } as const;

  const wrapperStyle = {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  } as const;

  const sectionStyle = {
    marginBottom: "34px",
  } as const;

  const sectionTitleStyle = {
    fontSize: "30px",
    fontWeight: "bold",
    margin: "0 0 16px 0",
  } as const;

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
  } as const;

  const cardStyle = {
    background: "linear-gradient(135deg, #2d2413, #1a1409)",
    border: "1px solid rgba(212,175,55,0.35)",
    borderRadius: "18px",
    padding: "16px 16px 14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
  } as const;

  const badgeStyle = {
    display: "inline-block",
    fontSize: "11px",
    color: "#e7c76a",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "8px",
  } as const;

  const nameStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    color: "white",
  } as const;

  const roleStyle = {
    fontSize: "14px",
    color: "#f3e8c8",
    margin: "0 0 10px 0",
    lineHeight: 1.45,
  } as const;

  const contactLinkStyle = {
    display: "block",
    color: "#f3e8c8",
    textDecoration: "none",
    fontSize: "15px",
    lineHeight: 1.6,
    wordBreak: "break-word" as const,
  } as const;

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <a
          href="/teltudlejning"
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
          Kontakt
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            margin: "0 0 34px 0",
            fontSize: "16px",
          }}
        >
          Vigtige kontaktpersoner hos Bornholms Teltudlejning
        </p>

        {Object.entries(grouped).map(([groupName, groupContacts]) => (
          <div key={groupName} style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{groupName}</h2>

            <div style={gridStyle}>
              {groupContacts.map((contact) => (
                <div key={contact.id} style={cardStyle}>
                  <div style={badgeStyle}>{groupName}</div>
                  <h3 style={nameStyle}>{contact.name}</h3>

                  {contact.role_text ? (
                    <p style={roleStyle}>{contact.role_text}</p>
                  ) : null}

                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`} style={contactLinkStyle}>
                      📞 {contact.phone}
                    </a>
                  ) : null}

                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} style={contactLinkStyle}>
                      ✉️ {contact.email}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}