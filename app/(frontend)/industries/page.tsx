import { getPageCopy, getPageMetadata } from "@/lib/cms";
export const dynamic="force-dynamic";
export async function generateMetadata(){return getPageMetadata("/industries");}
import Link from "next/link";
import { PageHero } from "@/components/Blocks";
import { getIndustries } from "@/lib/cms";

export default async function Industries(){
  const copy=await getPageCopy("/industries");
  const industries=await getIndustries();return <>
<PageHero trail="Industries" title={copy.text1} intro={copy.text2}/>
<section className="section"><div className="wrap industry-index">{industries.map((x,i)=><Link key={x.slug} href={`/industries/${x.slug}`}><span className="index">0{i+1}</span><h2>{x.title}</h2><p>{x.intro}</p><span className="arrow" aria-hidden="true">↗</span></Link>)}</div></section>
<section className="section"><div className="wrap prose-grid"><div><p className="kicker">{copy.text3}</p><h2>{copy.text4}</h2></div><div className="prose"><p>{copy.text5}</p><p>{copy.text6}</p><Link className="text-link" href="/services">{copy.text7}</Link></div></div></section>
</>;}
