import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
export async function GET(request:Request){
  const payload=await getPayload({config});const {user}=await payload.auth({headers:await headers()})
  if(!user)return new Response('Sign in to the CMS before previewing drafts.',{status:401})
  const path=new URL(request.url).searchParams.get('path')||'/'
  if(!/^\/(?:[a-z0-9-]+\/?)*$/.test(path)||path.startsWith('/api')||path.startsWith('/admin'))return new Response('Invalid preview path',{status:400})
  ;(await draftMode()).enable()
  return new Response(null,{status:307,headers:{Location:path}})
}
