import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/Blocks";
import { StorySections, Workflow, RelatedServices } from "@/components/Editorial";
import { getIndustries } from "@/lib/cms";

export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const x=(await getIndustries()).find(i=>i.slug===slug);return x?{title:x.detail.name,description:x.intro}:{};
}
export default async function Industry({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const x=(await getIndustries()).find(i=>i.slug===slug);const detail=x?.detail;if(!x||!detail)notFound();
  return <>
    <PageHero trail={`Industries / ${x.title}`} title={detail.name+"."} intro={x.intro}/>
    <section className="section"><div className="wrap prose-grid"><aside><p className="kicker">The operating context</p></aside><div className="prose"><p className="prose-intro">{detail.context}</p><h2>Where friction appears.</h2><ul className="large-list">{x.realities.map(v=><li key={v}>{v}</li>)}</ul></div></div></section>
    <section className="section ink-section"><div className="wrap"><h2>Follow the whole journey.</h2><p className="lead">An illustrative workflow—not a claim of a completed client engagement.</p><Workflow label="A possible flow" steps={detail.journey}/></div></section>
    <section className="section"><div className="wrap prose-grid"><aside><p className="kicker">Design considerations</p></aside><div className="prose"><StorySections items={detail.story}/><h2>{detail.question}</h2><p>A useful first conversation starts with the people involved, the information they need, and the constraints the system must respect.</p></div></div></section>
    <section className="section"><div className="wrap"><p className="kicker">From context to capability</p><h2>Relevant services.</h2><RelatedServices slugs={detail.services}/></div></section>
  </>;
}
