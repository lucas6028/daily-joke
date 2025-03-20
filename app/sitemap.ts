import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://daily-joke.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://daily-joke.vercel.app/random",
      lastModified: new Date(),
    },
    {
      url: "https://daily-joke.vercel.app/categories",
      lastModified: new Date(),
    },
  ];
}
