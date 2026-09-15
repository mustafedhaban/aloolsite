import { createHmac } from 'node:crypto'
import { getPayload } from 'payload'
import { sql } from '@payloadcms/db-postgres/drizzle'
import config from '@payload-config'

export const runtime='nodejs'
export async function POST(request:Request){
  const json=(body:object,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}})
  if(process.env.CONTACT_ENABLED!=='true')return json({error:'Inquiry delivery is not enabled yet.'},503)
  const origin=process.env.NEXT_PUBLIC_SERVER_URL||'http://localhost:4173'
  if(request.headers.get('origin')!==new URL(origin).origin)return json({error:'This request could not be verified.'},403)
  if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Send a JSON request.'},415)
  let data:Record<string,unknown>
  try{
    const reader=request.body?.getReader();if(!reader)return json({error:'Missing request.'},400)
    let size=0;const chunks:Uint8Array[]=[]
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16_384){await reader.cancel();return json({error:'Your message is too large.'},413)}chunks.push(value)}
    const buffer=Buffer.concat(chunks);data=JSON.parse(buffer.toString('utf8'))
    if(!data||Array.isArray(data)||typeof data!=='object')return json({error:'Invalid request.'},400)
  }catch{return json({error:'Invalid request.'},400)}
  if(data.website)return json({ok:true})
  const value=(key:string)=>typeof data[key]==='string'?data[key].trim():''
  const name=value('name'),email=value('email'),message=value('message'),organization=value('organization'),projectType=value('projectType'),projectStage=value('projectStage')
  if(name.length<2||name.length>120||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||message.length<20||message.length>10000||organization.length>200||projectType.length>100||projectStage.length>100)return json({error:'Check your name, email, and project context. Keep the message under 10,000 characters.'},400)
  try{
    const payload=await getPayload({config})
    // Never trust arbitrary forwarded IP headers. Set one only behind a proxy that overwrites it.
    const header=process.env.TRUSTED_CLIENT_IP_HEADER
    const client=header?request.headers.get(header)?.slice(0,100)||'unknown':'shared-local-bucket'
    const fingerprint=createHmac('sha256',process.env.PAYLOAD_SECRET!).update(client).digest('hex')
    const result=await payload.db.drizzle.execute(sql`
      INSERT INTO inquiry_limits (fingerprint, count, window_start, created_at, updated_at)
      VALUES (${fingerprint}, 1, NOW(), NOW(), NOW())
      ON CONFLICT (fingerprint) DO UPDATE SET
        count = CASE WHEN inquiry_limits.window_start < NOW() - INTERVAL '15 minutes' THEN 1 ELSE inquiry_limits.count + 1 END,
        window_start = CASE WHEN inquiry_limits.window_start < NOW() - INTERVAL '15 minutes' THEN NOW() ELSE inquiry_limits.window_start END,
        updated_at = NOW()
      RETURNING count
    `)
    if(Number(result.rows[0]?.count)>5)return json({error:'Too many inquiries. Please try again later.'},429)
    await payload.create({collection:'inquiries',overrideAccess:true,data:{name,email,message,organization,projectType,projectStage,status:'new'}})
    return json({ok:true})
  }catch{
    console.error('Contact inquiry could not be stored. No message content was logged.')
    return json({error:'We could not save your inquiry. Please try again later.'},503)
  }
}
