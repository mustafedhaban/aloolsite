import 'server-only'
import { cache } from 'react'
import { draftMode, headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload, type CollectionSlug } from 'payload'
import type { Metadata } from 'next'
import type { Article } from '@/payload-types'
import type homeSeeds from '@/cms/home-seeds.json'
import config from '@payload-config'
import { decode } from '@/cms/fields'
import type { Service, Industry, Project } from '@/lib/content'
import type { ServiceDetail, IndustryDetail, caseDetails, methodDetails } from '@/lib/editorial'

export const cms=cache(()=>getPayload({config}))
const context=cache(async()=>{
  const draft=(await draftMode()).isEnabled
  if(!draft)return {draft:false,user:undefined}
  const payload=await cms();const {user}=await payload.auth({headers:await headers()})
  return {draft:Boolean(user),user:user||undefined}
})

export const getDocuments=cache(async(collection:CollectionSlug)=>{
  const payload=await cms();const {draft,user}=await context()
  const result=await payload.find({collection,limit:100,depth:1,draft,user,overrideAccess:false,sort:'createdAt',where:draft?undefined:{_status:{equals:'published'}}})
  return result.docs.map(doc=>decode(doc)) as Record<string,unknown>[]
})
export const getServices=cache(async()=>await getDocuments('services') as unknown as (Service&{detail:ServiceDetail})[])
export const getIndustries=cache(async()=>await getDocuments('industries') as unknown as (Industry&{detail:IndustryDetail})[])
export const getProjects=cache(async()=>{
  const docs=await getDocuments('projects')
  return docs.map(doc=>({...doc,image:typeof doc.cover==='object'&&doc.cover&&'url' in doc.cover?doc.cover.url:doc.image})) as unknown as (Project&{detail:(typeof caseDetails)[string]})[]
})
export const getPageDocument=cache(async(path:string)=>{
  const payload=await cms();const {draft,user}=await context()
  const result=await payload.find({collection:'pages',limit:1,depth:0,draft,user,overrideAccess:false,where:{and:[{path:{equals:path}},...(draft?[]:[{_status:{equals:'published'}}])]}})
  return result.docs[0]
})
export async function getPageCopy(path:string):Promise<Record<string,string>>{
  const doc=await getPageDocument(path);if(!doc)notFound()
  return Object.fromEntries((doc.entries||[]).map(entry=>[entry.key,entry.value]))
}
export async function getPageMetadata(path:string):Promise<Metadata>{
  const doc=await getPageDocument(path)
  return doc?{title:doc.title,description:doc.description||undefined}:{title:'Page not found',robots:{index:false}}
}
export const getSiteSettings=cache(async()=>{
  const payload=await cms();return payload.findGlobal({slug:'site-settings',overrideAccess:false})
})
export const getMethod=cache(async()=>{
  const payload=await cms();const {draft,user}=await context()
  const doc=await payload.findGlobal({slug:'working-method',draft,user,overrideAccess:true})
  return (decode(doc.steps)||[]) as typeof methodDetails
})
export const isDraftPreview=async()=>(await context()).draft
export const getHomeModules=cache(async()=>{
  const payload=await cms();const {draft,user}=await context()
  return decode(await payload.findGlobal({slug:'home-modules',draft,user,overrideAccess:true})) as typeof homeSeeds
})
export const getArticles=cache(async()=>await getDocuments('articles') as unknown as Article[])
export const getArticle=cache(async(slug:string)=>{
  const payload=await cms();const {draft,user}=await context()
  const result=await payload.find({collection:'articles',limit:1,depth:1,draft,user,overrideAccess:false,where:{and:[{slug:{equals:slug}},...(draft?[]:[{_status:{equals:'published'}}])]}})
  return result.docs[0]
})
