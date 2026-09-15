import { getPageCopy, getPageMetadata } from "@/lib/cms";
export const dynamic="force-dynamic";
export async function generateMetadata(){return getPageMetadata("/privacy");}
import { PageHero } from "@/components/Blocks";
 export default async function Privacy(){
  const copy=await getPageCopy("/privacy");return <><PageHero trail="Privacy" title={copy.text1} intro={copy.text2}/><section className="section"><div className="wrap legal"><aside className="proof-notice"><strong>{copy.text3}</strong><p>{copy.text4}</p></aside><h2>{copy.text5}</h2><p>{copy.text6}</p><h2>{copy.text7}</h2><p>{copy.text8}</p><h2>{copy.text9}</h2><p>{copy.text10}</p></div></section></>}
