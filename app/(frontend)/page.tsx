import { getPageCopy, getPageMetadata, getHomeModules } from "@/lib/cms";
export const dynamic="force-dynamic";
export async function generateMetadata(){return getPageMetadata("/");}
import Link from "next/link";
import { ProjectList, ServiceList, Systems } from "@/components/Blocks";
import { Weave } from "@/components/Weave";
import { ContactForm } from "@/components/ContactForm";





export default async function Home(){
  const copy=await getPageCopy("/");
  const modules=await getHomeModules();
  const fragments=modules.fragments.map(x=>[x.title,x.body]);
  const method=modules.method.map(x=>[x.title,x.body]);
  return <>
    <section className="hero" data-theme="light">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">{copy.text1}</span>
          <h1>{copy.text2}</h1>
          <p className="hero-copy">{copy.text3}</p>
          <div className="hero-actions">
            <Link className="btn" href="/contact">{copy.text4}<span className="arrow" aria-hidden="true">↗</span></Link>
            <Link className="btn alt" href="/work">{copy.text5}<span className="arrow" aria-hidden="true">↓</span></Link>
          </div>
        </div>
        <div className="system-orbit" role="img" aria-label="People, processes, data and technology connected into one system"><span className="orbit-node">{copy.text6}</span><span className="orbit-node">{copy.text7}</span><span className="orbit-node">{copy.text8}</span><span className="orbit-node">{copy.text9}</span><span className="orbit-line a"/><span className="orbit-line b"/><span className="orbit-line c"/><span className="orbit-line d"/><span className="orbit-core"/></div>
      </div>
    </section>

    <section className="proof-strip" aria-label="Representative system signals">
      <div className="wrap proof-grid">
        <div><span className="eyebrow">{copy.text10}</span><strong>{copy.text11}</strong></div>
        <div><strong>{copy.text12}</strong><small>{copy.text13}</small></div>
        <div><strong>{copy.text14}</strong><small>{copy.text15}</small></div>
        <div><strong>{copy.text16}</strong><small>{copy.text17}</small></div>
      </div>
    </section>

    <section className="intro-section" data-theme="light">
      <div className="wrap">
        <div className="split-heading reveal"><div><p className="eyebrow">{copy.text18}</p><h2>{copy.text19}</h2></div><p className="lead">{copy.text20}</p></div>
        <div className="fragmentation reveal-stagger">{fragments.map((item,i) => <article className="fragment-card" key={item[0]}><h3>{item[0]}</h3><p>{item[1]}</p><code>{['spreadsheet.xlsx','platform-a.local','crm / inbox','chat / phone','weekly-report.pdf','version_final_v7'][i]}</code></article>)}</div>
      </div>
    </section>

    <section className="system-section" data-theme="dark">
      <div className="wrap"><div className="system-head"><div><span className="eyebrow">{copy.text21}</span><h2>{copy.text22}</h2></div><p>{copy.text23}</p></div><Systems /></div>
    </section>

    <section className="capabilities" data-theme="light"><div className="wrap"><div className="capabilities-head"><span className="eyebrow">{copy.text24}</span><h2>{copy.text25}</h2></div><ServiceList /></div></section>

    <section className="work-section" data-theme="light"><div className="wrap"><div className="work-header"><h2>{copy.text26}</h2><p>{copy.text27}</p><Link href="/work">{copy.text28}</Link></div><ProjectList /></div></section>

    <section className="method-section" data-theme="light"><div className="wrap"><div className="method-head"><h2>{copy.text29}</h2><p>{copy.text30}</p></div><div className="method-list reveal-stagger">{method.map((item, index) => <article className="method-step" key={item[0]}><span className="num">0{index + 1}</span><h3>{item[0]}</h3><p>{item[1]}</p></article>)}</div><Link className="text-link" href="/about/how-we-work">{copy.text31}</Link></div></section>

    <section className="about-section" data-theme="dark"><div className="wrap"><div className="about-grid reveal"><h2>{copy.text32}</h2><div className="about-copy"><p>{copy.text33}<em>{copy.text34}</em>{copy.text35}</p><p className="muted">{copy.text36}</p></div></div><Weave /></div></section>
    <section className="contact-section" data-theme="dark"><div className="wrap contact-grid"><div><span className="eyebrow">{copy.text37}</span><h2>{copy.text38}</h2><p className="contact-intro">{copy.text39}</p></div><ContactForm enabled={process.env.CONTACT_ENABLED==="true"} /></div></section>
  </>;
}
