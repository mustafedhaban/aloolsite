import { getPageCopy, getPageMetadata } from "@/lib/cms";
export const dynamic="force-dynamic";
export async function generateMetadata(){return getPageMetadata("/work");}
import { PageHero, ProjectList, ProofNotice } from "@/components/Blocks";

export default async function Work(){
  const copy=await getPageCopy("/work");return <><PageHero trail="Work" title={copy.text1} intro={copy.text2}/><section className="section"><div className="wrap"><ProofNotice/><ProjectList/></div></section></>}
