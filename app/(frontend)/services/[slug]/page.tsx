import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/Blocks";
import { StorySections, RelatedServices } from "@/components/Editorial";
import { getServices } from "@/lib/cms";


export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const detail=(await getServices()).find(s=>s.slug===slug)?.detail;
  return detail?{title:detail.name,description:detail.proposition}:{};
}
export default async function Service({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const service=(await getServices()).find(s=>s.slug===slug);const detail=service?.detail;
  if(!service||!detail)notFound();
  return <>
    <PageHero trail={`Services / ${service.title}`} title={detail.name+"."} intro={detail.proposition}/>
    <section className="section"><div className="wrap prose-grid">
      <aside><p className="kicker">When this matters</p></aside>
      <div className="prose"><p className="prose-intro">{detail.fit}</p><h2>What we can help with</h2><ul className="large-list">{service.deliverables.map(x=><li key={x}>{x}</li>)}</ul><StorySections items={detail.approach}/></div>
    </div></section>
    <section className="section ink-section"><div className="wrap prose-grid"><div><p className="kicker">From discussion to delivery</p><h2>Make the scope tangible.</h2></div><div className="prose"><p className="lead">Depending on the agreed engagement, outputs can include:</p><ul className="large-list">{detail.outputs.map(x=><li key={x}>{x}</li>)}</ul><p>{detail.boundary}</p><Link className="text-link" href="/about/how-we-work">How we work ↗</Link></div></div></section>
    <section className="section"><div className="wrap prose-grid"><div><p className="kicker">A useful starting point</p><h2>Questions worth asking.</h2></div><div className="prose"><div className="question-grid">{service.questions.map(x=><p key={x}>{x}</p>)}</div><p>You do not need a finished specification to begin a conversation. Start with the workflow, decision, or constraint that needs attention.</p>{detail.concept&&<Link className="text-link" href={`/work/${detail.concept}`}>Explore an illustrative system concept ↗</Link>}</div></div></section>
    <section className="section"><div className="wrap"><h2>Connected capabilities.</h2><RelatedServices slugs={detail.related}/></div></section>
  </>;
}
