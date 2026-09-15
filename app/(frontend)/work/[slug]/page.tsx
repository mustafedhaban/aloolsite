import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero, CaseNavigation } from "@/components/Blocks";
import { Workflow, StorySections } from "@/components/Editorial";
import { getProjects } from "@/lib/cms";

export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const p=(await getProjects()).find(x=>x.slug===slug);
  return p?{title:p.title+" — illustrative concept",description:"Illustrative concept, not a completed client project. "+p.summary,robots:{index:false,follow:true}}:{};
}
export default async function Case({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const p=(await getProjects()).find(x=>x.slug===slug);const detail=p?.detail;if(!p||!detail)notFound();
  return <>
    <PageHero trail={`Work / ${p.title}`} title={p.title+"."} intro={"Illustrative concept — not a completed client project. "+p.summary}/>
    <figure className="case-figure"><div className="case-media"><Image src={p.image} alt={p.alt} fill priority sizes="100vw"/></div><figcaption className="wrap">Reference photograph. This is not a screenshot or photograph of an Alool client project.</figcaption></figure>
    <section className="case-summary"><div className="wrap"><aside className="proof-notice"><strong>About this concept</strong><p>This scenario explores a possible approach to a common organizational problem. It does not identify a client, describe verified delivery, or report measured outcomes.</p></aside><dl><div><dt>Illustrative sector</dt><dd>{p.sector}</dd></div><div><dt>Proposed scope</dt><dd>{p.scope}</dd></div><div><dt>Focus</dt><dd>{p.type}</dd></div></dl></div></section>
    <section className="section"><div className="wrap prose-grid"><aside><p className="kicker">Problem → proposed system → potential value</p></aside><div className="prose"><h2>The situation</h2><p>{p.situation}</p><h2>A possible approach</h2><p>{p.approach}</p><h2>The proposed system</h2><ul className="large-list">{p.system.map(x=><li key={x}>{x}</li>)}</ul><h2>Potential operational value</h2><p>{p.value}</p><p>No performance results or client outcomes have been measured for this illustrative concept.</p></div></div></section>
    <section className="section ink-section"><div className="wrap"><h2>How the work could connect.</h2><Workflow label="Proposed workflow" steps={detail.journey}/></div></section>
    <section className="section"><div className="wrap prose-grid"><aside><p className="kicker">Technical considerations</p></aside><div className="prose"><StorySections items={detail.considerations}/></div></div></section>
    <CaseNavigation slug={p.slug}/>
  </>;
}
