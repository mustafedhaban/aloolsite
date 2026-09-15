import { getPayload } from 'payload'
import config from '../payload.config'
import pageSeeds from '../cms/page-seeds.json'
import homeSeeds from '../cms/home-seeds.json'
import { encode } from '../cms/fields'
import { services,industries,projects,nav } from '../lib/content'
import { serviceDetails,industryDetails,caseDetails,methodDetails } from '../lib/editorial'

const payload=await getPayload({config})
for(const [collection,items]of [
  ['pages',pageSeeds],
  ['services',services.map(s=>({...s,detail:serviceDetails[s.slug]}))],
  ['industries',industries.map(s=>({...s,detail:industryDetails[s.slug]}))],
  ['projects',projects.map(s=>({...s,detail:caseDetails[s.slug]}))],
] as const){
  let added=0
  for(const item of items){
    const key='path' in item?'path':'slug';const value=item[key as keyof typeof item]
    const existing=await payload.find({collection,limit:1,where:{[key]:{equals:value}},overrideAccess:true,draft:true})
    if(existing.totalDocs)continue
    // Existing approved copy only. Articles and users are never fabricated or seeded.
    await payload.create({collection,data:{...encode(item) as object,_status:'published'} as never,overrideAccess:true})
    added++
  }
  console.log(`${collection}: ${added} new records; existing records preserved.`)
}
const settings=await payload.findGlobal({slug:'site-settings'})
if(!settings.navigation?.length)await payload.updateGlobal({slug:'site-settings',data:{companyName:'Alool Technologies',description:'We turn complexity into connected digital systems.',footerHeading:'Let’s make the system work.',navigation:nav},overrideAccess:true})
const method=await payload.findGlobal({slug:'working-method',overrideAccess:true})
if(!method.steps?.length)await payload.updateGlobal({slug:'working-method',data:{steps:encode(methodDetails),_status:'published'} as never,overrideAccess:true})
const home=await payload.findGlobal({slug:'home-modules',overrideAccess:true})
if(!home.fragments?.length)await payload.updateGlobal({slug:'home-modules',data:{...encode(homeSeeds) as object,_status:'published'} as never,overrideAccess:true})
await payload.destroy()
console.log('Seed complete. Create the first administrator privately at /admin.')
process.exit(0)
