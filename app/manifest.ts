import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Daily Joke",
    short_name: "Daily-Joke",
    description: "Joke of the Day. Start your day with a laugh!",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait",
    scope: "/",
    categories: ["entertainment", "humor", "lifestyle"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-svg.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/desktop_screenshot.png",
        sizes: "1852x922",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/mobile_screenshot.png",
        sizes: "1017x2048",
        type: "image/png",
        form_factor: "narrow",
      }
    ],
  };
}
