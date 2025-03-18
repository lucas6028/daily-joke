import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private/"],
      },
      {
        userAgent: "Googlebot",
        disallow: ["/admin/", "/tmp/"],
        allow: ["/images/", "/css/", "/js/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/images/"],
      },
      {
        userAgent: "Bingbot",
        disallow: ["/admin/", "/tmp/"],
        allow: ["/images/", "/css/", "/js/"],
      },
      {
        userAgent: "DuckDuckBot",
        disallow: ["/admin/", "/tmp/"],
        allow: ["/images/", "/css/", "/js/"],
      },
      {
        userAgent: "Baiduspider",
        disallow: "/",
      },
      {
        userAgent: "OAI-SearchBot",
        disallow: ["/admin/", "/tmp/"],
        allow: ["/images/", "/css/", "/js/"],
      },
      {
        userAgent: "ChatGPT-User",
        disallow: ["/admin/", "/tmp/"],
        allow: ["/images/", "/css/", "/js/"],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/admin/", "/tmp/"],
        allow: ["/images/", "/css/", "/js/"],
      },
    ],
    sitemap: "https://daily-joke.vercel.app/sitemap.xml",
  };
}
