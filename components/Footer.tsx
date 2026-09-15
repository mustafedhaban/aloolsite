"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, services } from "@/lib/content";
export function Footer({navigation=nav,serviceLinks=services,heading="Let’s make the system work.",companyName="Alool Technologies"}:{navigation?:{label:string;href:string}[];serviceLinks?:{title:string;slug:string}[];heading?:string;companyName?:string}) {
  const path=usePathname();
  return <>
    {path!=='/' && path!=='/contact' && <section className="contact-band" data-theme="dark" aria-labelledby="contact-band-title"><div className="wrap band-grid"><div><p className="kicker">Start with the real problem</p><h2 id="contact-band-title">{heading}</h2></div><Link className="button" href="/contact">Discuss your project ↗</Link></div></section>}
    <footer className="site-footer" data-theme="dark"><div className="wrap footer-grid"><Link href="/" className="footer-brand">ALOOL</Link><nav className="footer-col" aria-label="Footer services"><strong>Services</strong>{serviceLinks.map(s=><Link key={s.slug} href={`/services/${s.slug}`}>{s.title}</Link>)}</nav><nav className="footer-col" aria-label="Footer company"><strong>Company</strong>{navigation.map(n=><Link key={n.href} href={n.href}>{n.label}</Link>)}<Link href="/about/how-we-work">How we work</Link></nav><nav className="footer-col" aria-label="Footer contact"><strong>Contact</strong><Link href="/contact">Discuss your project</Link><a href="#main">Back to top ↑</a></nav></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} {companyName}</span><span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span></div></footer>
  </>;
}
