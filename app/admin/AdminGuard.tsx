"use client";

import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AdminGuardProps = {
  children: ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProps) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/admin/login";
        return;
      }

      setAllowed(true);
      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at top, #13213b 0%, #0b1220 50%, #08101c 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Indlæser admin...
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}