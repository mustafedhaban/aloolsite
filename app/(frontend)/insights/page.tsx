import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Blocks";
import { getArticles } from "@/lib/cms";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Insights",description:"Perspectives on the people, decisions, and technology behind connected digital systems."};
export default async function Insights(){
  const articles=(await getArticles()).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  return <>
    <PageHero trail="Insights" title="Thinking behind the systems." intro="Perspectives on organizational workflows, software engineering, and the decisions that connect them."/>
    <section className="section"><div className="wrap">{articles.length?<div className="related-services">{articles.map(a=><Link href={`/insights/${a.slug}`} key={a.id}><span>{a.author} · {new Date(a.publishedAt).toLocaleDateString('en',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'})}</span><strong>{a.title} ↗</strong><span>{a.summary}</span></Link>)}</div>:<div className="empty-state"><p className="kicker">From Alool</p><h2>Our first articles are still to come.</h2><p>In the meantime, explore how we approach complex requirements and turn them into a shared direction for design and engineering.</p><Link className="text-link" href="/about/how-we-work">Explore our approach ↗</Link></div>}</div></section>
  </>;
}
