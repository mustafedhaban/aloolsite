import { getPageCopy, getPageMetadata } from "@/lib/cms";
export const dynamic="force-dynamic";
export async function generateMetadata(){return getPageMetadata("/services");}
import Link from "next/link";
import { PageHero, ServiceList } from "@/components/Blocks";

export default async function Services(){
  const copy=await getPageCopy("/services");return <>
<PageHero trail="Services" title={copy.text1} intro={copy.text2}/>
<section className="section brand-section"><div className="wrap"><ServiceList/></div></section>
<section className="section"><div className="wrap prose-grid"><div><p className="kicker">{copy.text3}</p><h2>{copy.text4}</h2></div><div className="prose"><p className="prose-intro">{copy.text5}</p><p>{copy.text6}</p><p>{copy.text7}</p><p>{copy.text8}</p><Link href="/about/how-we-work" className="text-link">{copy.text9}</Link></div></div></section>
</>;}
