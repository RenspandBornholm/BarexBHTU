import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Admin til BARE og BHTU medarbejderportal",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Admin Portal",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/admin-icon.png",
    apple: "/admin-icon.png",
    shortcut: "/admin-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#08101c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}