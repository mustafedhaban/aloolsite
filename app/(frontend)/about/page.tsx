import { getPageCopy, getPageMetadata } from "@/lib/cms";
export const dynamic="force-dynamic";
export async function generateMetadata(){return getPageMetadata("/about");}
import Link from "next/link";
import { PageHero } from "@/components/Blocks";
import { Weave } from "@/components/Weave";

export default async function About(){
  const copy=await getPageCopy("/about");return <>
  <PageHero trail="About" title={copy.text1} intro={copy.text2}/>
  <section className="section"><div className="wrap prose-grid"><aside><p className="kicker">{copy.text3}</p></aside><div className="prose"><h2>{copy.text4}</h2><p>{copy.text5}</p><p>{copy.text6}</p><h2>{copy.text7}</h2><p>{copy.text8}</p><Link className="text-link" href="/services">{copy.text9}</Link></div></div></section>
  <section className="about-section" data-theme="dark"><div className="wrap"><div className="about-grid"><h2>{copy.text10}</h2><div className="about-copy"><p>{copy.text11}<em>{copy.text12}</em>{copy.text13}</p><p className="muted">{copy.text14}</p></div></div><Weave/></div></section>
  <section className="section"><div className="wrap prose-grid"><div><p className="kicker">{copy.text15}</p><h2>{copy.text16}</h2></div><div className="prose"><h2>{copy.text17}</h2><p>{copy.text18}</p><h2>{copy.text19}</h2><p>{copy.text20}</p><h2>{copy.text21}</h2><p>{copy.text22}</p><Link className="text-link" href="/about/how-we-work">{copy.text23}</Link></div></div></section>
  <section className="section origin"><div className="wrap prose-grid"><div><p className="kicker">{copy.text24}</p><h2>{copy.text25}</h2></div><div className="prose"><p className="prose-intro">{copy.text26}</p><p>{copy.text27}</p><p>{copy.text28}</p></div></div></section>
</>;}
