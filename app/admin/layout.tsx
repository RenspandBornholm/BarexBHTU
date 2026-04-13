import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal",
  icons: {
    icon: "/admin-icon.png",
    apple: "/admin-icon.png",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}