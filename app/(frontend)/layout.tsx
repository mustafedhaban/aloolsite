import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { getServices, getSiteSettings, isDraftPreview } from "@/lib/cms";
import { Header } from "@/components/Header"; import { Footer } from "@/components/Footer"; import { Reveal } from "@/components/Reveal"; import "../globals.css"; import "../interior.css";
// DESIGN.md: Space Grotesk carries the display hierarchy, Inter carries body and UI.
const body=Inter({subsets:["latin"],display:"swap",variable:"--font-body"});
// Both are variable fonts, so the authored weights (520, 540, 560, 580, 650) resolve exactly.
const display=Space_Grotesk({subsets:["latin"],display:"swap",variable:"--font-display"});
export const dynamic = 'force-dynamic';
export async function generateMetadata():Promise<Metadata>{
  const [settings,preview]=await Promise.all([getSiteSettings(),isDraftPreview()]);
  return {metadataBase:new URL(process.env.NEXT_PUBLIC_SERVER_URL||"https://alool.tech"),title:{default:`${settings.companyName} | Connected digital systems`,template:`%s | ${settings.companyName}`},description:settings.description||undefined,openGraph:{title:settings.companyName,description:settings.description||undefined,type:"website"},robots:{index:!preview,follow:!preview}};
}
const jsonLd={"@context":"https://schema.org","@type":"Organization",name:"Alool Technologies",url:"https://alool.tech",description:"A technology company designing connected digital systems around how organizations work."};
export default async function RootLayout({children}:{children:React.ReactNode}){
  const [settings,services,preview]=await Promise.all([getSiteSettings(),getServices(),isDraftPreview()]);
  const navigation=settings.navigation?.map(n=>({label:n.label,href:n.href}));
  // A full document navigation is required to clear the preview cookie.
  // eslint-disable-next-line @next/next/no-html-link-for-pages
  return <html lang="en" className={`${body.variable} ${display.variable}`}><body><Reveal/><Header navigation={navigation}/><main id="main">{children}</main><Footer navigation={navigation} serviceLinks={services.map(s=>({title:s.title,slug:s.slug}))} heading={settings.footerHeading||undefined} companyName={settings.companyName}/>{preview&&<aside className="preview-banner">Draft preview — only visible to signed-in staff.<a href="/api/preview/exit">Exit preview</a></aside>}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/></body></html>}
