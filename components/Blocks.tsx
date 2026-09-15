import Link from "next/link";
import Image from "next/image";
import { getProjects, getServices, getHomeModules } from "@/lib/cms";

export function PageHero({trail, title, intro}:{trail:string;title:string;intro:string}) {
  const [parent,...rest]=trail.split(" / ");
  const href=({Services:"/services",Industries:"/industries",About:"/about",Work:"/work",Insights:"/insights"} as Record<string,string>)[parent];
  return <section className="page-hero"><div className="wrap"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Alool</Link><span aria-hidden="true">/</span>{rest.length&&href?<><Link href={href}>{parent}</Link><span aria-hidden="true">/</span><span aria-current="page">{rest.join(" / ")}</span></>:<span aria-current="page">{trail}</span>}</nav><h1>{title}</h1><p className="lead">{intro}</p></div></section>;
}
export async function Systems() { const items=(await getHomeModules()).systems.map(x=>[x.title,x.body]); return <div className="systems-map reveal-stagger">{items.map((x,i)=><article className="system-cell" key={x[0]}><span className="num">0{i+1}</span><span className="node-dot" aria-hidden="true"/><div><h3>{x[0]}</h3><p>{x[1]}</p></div></article>)}</div> }
export async function ServiceList() { const services=await getServices(); return <div className="cap-list reveal-stagger">{services.map((s,i)=><Link className="cap-row" key={s.slug} href={`/services/${s.slug}`}><span className="cap-num">0{i+1}</span><h3>{s.title}</h3><p>{s.intro}</p><span className="cap-arrow" aria-hidden="true">↗</span></Link>)}</div> }
export async function ProjectList() { const projects=await getProjects(); return <div className="project-grid reveal-stagger">{projects.map((p,i)=><article className={`project ${i===1?"compact":""}`} key={p.slug}><Link className="project-media" href={`/work/${p.slug}`} aria-label={`View ${p.title}`}><Image src={p.image} alt={p.alt} fill sizes={i===1?"(max-width: 760px) 100vw, 66vw":"(max-width: 1440px) 92vw, 1325px"}/></Link><div className="project-kicker">Illustrative concept · {p.type}</div><div className="project-copy"><h3>{p.title}</h3><p>{p.summary}</p></div><Link className="project-link" href={`/work/${p.slug}`}>Read the case ↗</Link></article>)}</div> }
export function ProofNotice() { return <aside className="proof-notice"><strong>About these cases</strong><p>These illustrative concepts show how Alool could approach systems work. They are not verified client engagements or evidence of delivered results.</p></aside> }
export async function CaseNavigation({slug}:{slug:string}) {
  const projects=await getProjects();
  if(projects.length<2)return <nav className="wrap case-navigation" aria-label="Project navigation"><Link href="/work">All work ↗</Link></nav>;
  const index=projects.findIndex(p=>p.slug===slug);
  const next=projects[(index+1)%projects.length];
  return <nav className="wrap case-navigation" aria-label="Project navigation"><Link href="/work"><span className="kicker">Explore</span><strong>All work ↗</strong></Link><Link href={`/work/${next.slug}`}><span className="kicker">Next illustrative concept</span><strong>{next.title} ↗</strong></Link></nav>;
}
