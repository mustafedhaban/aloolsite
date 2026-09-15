import { ContactStatus } from "@/components/ContactStatus";
import { getPageCopy, getPageMetadata } from "@/lib/cms";
export const dynamic="force-dynamic";
export async function generateMetadata(){return getPageMetadata("/contact");}
import { PageHero } from "@/components/Blocks";
import { ContactForm } from "@/components/ContactForm";

export default async function Contact(){
  const copy=await getPageCopy("/contact");return <>
<PageHero trail="Contact" title={copy.text1} intro={copy.text2}/>
<section className="section"><div className="wrap contact-grid"><div><p className="kicker">{copy.text3}</p><h2>{copy.text4}</h2><p>{copy.text5}</p><p>{copy.text6}</p><ContactStatus/></div><ContactForm enabled={process.env.CONTACT_ENABLED==="true"}/></div></section>
</>;}
