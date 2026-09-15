import type { MetadataRoute } from "next";
import { getArticles, getIndustries, getServices } from "@/lib/cms";
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  const base=process.env.NEXT_PUBLIC_SERVER_URL||"https://alool.tech";
  const [industries,services,articles]=await Promise.all([getIndustries(),getServices(),getArticles()]);
  const routes=["","/work","/services","/industries","/about","/about/how-we-work","/insights","/contact","/privacy","/terms"];
  // Illustrative case pages are noindex until real project evidence is approved.
  return [...routes,...services.map(x=>`/services/${x.slug}`),...industries.map(x=>`/industries/${x.slug}`),...articles.map(x=>`/insights/${x.slug}`)].map(url=>({url:base+url,changeFrequency:"monthly" as const,priority:url===""?1:.7}));
}
