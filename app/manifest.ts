import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Daily Joke | 讓每天都從歡笑開始",
    short_name: "Daily Joke",
    description:
      "您的生活增添一抹笑容！我們每天提供最新、最有趣的笑話，涵蓋科技、美食、雙關語等多種類型。每日更新，讓您的一天從微笑開始。",
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
    ],
    screenshots: [
      {
        src: "/desktop_screenshot.png",
        sizes: "1852x922",
        type: "image/png",
      },
      {
        src: "/mobile_screenshot.png",
        sizes: "1017x2048",
        type: "image/png",
      },
    ],
  };
}
