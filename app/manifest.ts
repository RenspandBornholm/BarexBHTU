import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MedarbejderPortal",
    short_name: "Portal",
    description: "BARE og BHTU medarbejderportal",
    start_url: "/",
    display: "standalone",
    background_color: "#08101c",
    theme_color: "#08101c",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}