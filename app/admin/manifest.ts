import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Admin Portal",
    short_name: "Admin",
    description: "Admin til BARE og BHTU medarbejderportal",
    start_url: "/admin/login",
    scope: "/admin",
    display: "standalone",
    background_color: "#08101c",
    theme_color: "#08101c",
    orientation: "portrait",
    icons: [
      {
        src: "/admin-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/admin-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/admin-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}