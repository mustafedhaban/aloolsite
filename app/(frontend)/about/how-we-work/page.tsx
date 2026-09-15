import { getPageCopy, getPageMetadata } from "@/lib/cms";
export const dynamic="force-dynamic";
export async function generateMetadata(){return getPageMetadata("/about/how-we-work");}
import Link from "next/link";
import { PageHero } from "@/components/Blocks";
import { Workflow } from "@/components/Editorial";
import { getMethod } from "@/lib/cms";

export default async function How(){
  const copy=await getPageCopy("/about/how-we-work");
  const methodDetails=await getMethod();return <>
  <PageHero trail="About / How we work" title={copy.text1} intro={copy.text2}/>
  <section className="section"><div className="wrap"><p className="lead">{copy.text3}</p><Workflow label="Our working method" steps={methodDetails.map(s=>s.title)}/></div></section>
  <section className="section"><div className="wrap process">{methodDetails.map((s,i)=><article key={s.title}><span className="index">0{i+1}</span><div><h2>{s.title}</h2><p>{s.body}</p><h3>{copy.text4}</h3><p>{s.participation}</p><h3>{copy.text5}</h3><p>{s.output}</p></div></article>)}</div></section>
  <section className="section brand-section"><div className="wrap prose-grid"><div><h2>{copy.text6}</h2></div><div className="prose"><p>{copy.text7}</p><p>{copy.text8}</p><Link className="text-link" href="/services/technology-consulting">{copy.text9}</Link></div></div></section>
</>;}
