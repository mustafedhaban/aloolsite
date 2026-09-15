import Link from "next/link";
import { getServices } from "@/lib/cms";
import type { Story } from "@/lib/editorial";

export function StorySections({items}:{items:Story[]}) {
  return <>{items.map(item=><section className="story-block" key={item.title}><h2>{item.title}</h2><p>{item.body}</p></section>)}</>;
}

export function Workflow({steps,label}:{steps:string[];label:string}) {
  return <div className="workflow"><p className="kicker">{label}</p><ol>{steps.map((step,i)=><li key={step}><span aria-hidden="true">0{i+1}</span><strong>{step}</strong>{i<steps.length-1&&<span className="workflow-arrow" aria-hidden="true">→</span>}</li>)}</ol></div>;
}

export async function RelatedServices({slugs}:{slugs:string[]}) {
  const services=await getServices();
  return <nav className="related-services reveal-stagger" aria-label="Related services">{slugs.map(slug=>{const s=services.find(s=>s.slug===slug);return s?<Link href={`/services/${slug}`} key={slug}><strong>{s.title} ↗</strong><span>{s.intro}</span></Link>:null;})}</nav>;
}
