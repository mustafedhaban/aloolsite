import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getArticle } from '@/lib/cms'
import { PageHero } from '@/components/Blocks'
export const dynamic='force-dynamic'
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const article=await getArticle((await params).slug)
  return article?{title:article.title,description:article.summary,openGraph:{type:'article',publishedTime:article.publishedAt,authors:[article.author]}}:{}
}
export default async function Article({params}:{params:Promise<{slug:string}>}){
  const article=await getArticle((await params).slug);if(!article)notFound()
  const cover=typeof article.cover==='object'?article.cover:null
  return <>
    <PageHero trail={`Insights / ${article.title}`} title={article.title} intro={article.summary}/>
    {cover?.url&&<div className="case-media"><Image src={cover.url} alt={cover.alt} fill priority sizes="100vw"/></div>}
    <article className="section"><div className="wrap prose-grid"><aside><p className="kicker">{article.author}</p><time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleDateString('en',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'})}</time></aside><div className="prose article-body"><RichText data={article.body}/><Link href="/insights" className="text-link">All insights ↗</Link></div></div></article>
  </>
}
