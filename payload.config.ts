import path from 'node:path'
import { buildConfig, type CollectionConfig, type Field } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import homeSeeds from './cms/home-seeds.json'
import { admin, adminField, adminOrSelf, published, staff } from './cms/access'
import { fieldsFrom } from './cms/fields'
import { services, industries, projects } from './lib/content'
import { serviceDetails, industryDetails, caseDetails, methodDetails } from './lib/editorial'

const serverURL=process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4173'
const contentAccess={read:published,create:staff,update:staff,delete:admin}
const slug:Field={name:'slug',type:'text',required:true,unique:true,index:true,validate:(value:unknown)=>typeof value==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)||'Use lowercase words separated by hyphens.'}
const title:Field={name:'title',type:'text',required:true}
const fields=(sample:Record<string,unknown>)=>fieldsFrom(sample).filter(f=>!('name' in f&&['slug','title'].includes(f.name)))
const contentMeta:Record<string,{description:string;singular:string;plural:string}>={
  services:{singular:'Service',plural:'Services',description:'Manage Alool’s service offer and the detail shown on each service page.'},
  industries:{singular:'Industry',plural:'Industries',description:'Explain how the systems-led approach adapts to different operating contexts.'},
  projects:{singular:'Case study',plural:'Case studies',description:'Representative work and approved project stories. Keep illustrative entries clearly labeled.'},
}
const contentCollection=(name:string,route:string,sample:Record<string,unknown>):CollectionConfig=>({
  slug:name,labels:contentMeta[name]&&{singular:contentMeta[name].singular,plural:contentMeta[name].plural},access:contentAccess,admin:{useAsTitle:'title',group:'Content library',description:contentMeta[name]?.description,defaultColumns:['title','slug','_status','updatedAt'],listSearchableFields:['title','slug'],preview:doc=>`${serverURL}/api/preview?path=${encodeURIComponent(`${route}/${doc.slug}`)}`},
  versions:{drafts:true,maxPerDoc:30},
  hooks:{beforeChange:[({data,originalDoc})=>({...data,slug:originalDoc?.slug||data.slug})]},
  fields:[title,slug,...fields(sample),{name:'cover',type:'upload',relationTo:'media',admin:{description:'Optional uploaded image. Replaces a reference-image URL when set.'}}],
})
const serviceSample={...services[0],detail:{...serviceDetails[services[0].slug]}}
// Consulting does not have a related concept; this optional link is not a required claim.
const serviceFields=fields(serviceSample)
for(const field of serviceFields)if('name' in field&&field.name==='detail'&&field.type==='group')for(const child of field.fields)if('name' in child&&child.name==='concept'&&child.type==='text')child.required=false
const Services=contentCollection('services','/services',serviceSample)
Services.fields=[title,slug,...serviceFields]

export default buildConfig({
  serverURL,
  secret:process.env.PAYLOAD_SECRET || '',
  admin:{
    user:'users',
    meta:{titleSuffix:'— Alool CMS'},
    importMap:{baseDir:path.resolve(/* turbopackIgnore: true */ process.cwd())},
    components:{
      beforeDashboard:['/components/admin/AloolAdmin#AdminDashboard'],
      beforeLogin:['/components/admin/AloolAdmin#LoginIntro'],
      afterNavLinks:['/components/admin/AloolAdmin#AdminNavFooter'],
      graphics:{
        Icon:'/components/admin/AloolAdmin#AloolIcon',
        Logo:'/components/admin/AloolAdmin#AloolLogo',
      },
    },
  },
  editor:lexicalEditor(),sharp,
  email:()=>({name:'disabled-until-configured',defaultFromAddress:'no-reply@localhost.invalid',defaultFromName:'Alool CMS',sendEmail:async()=>{throw new Error('Email delivery is not configured. No email or reset token was logged.')}}),
  db:postgresAdapter({pool:{connectionString:process.env.DATABASE_URL},push:false,migrationDir:path.resolve('cms/migrations')}),
  typescript:{outputFile:path.resolve('payload-types.ts')},
  cors:[serverURL],csrf:[serverURL],
  upload:{limits:{fileSize:10_000_000}},
  collections:[
    {slug:'users',auth:{tokenExpiration:7200,maxLoginAttempts:5,lockTime:600000},admin:{useAsTitle:'email',group:'Administration',description:'Manage editor access and account roles.',defaultColumns:['name','email','role','updatedAt']},access:{create:admin,read:adminOrSelf,update:adminOrSelf,delete:admin,admin:({req})=>Boolean(req.user)},
      hooks:{beforeChange:[async({data,operation,req})=>{
        if(operation==='create'){
          const count=await req.payload.count({collection:'users',overrideAccess:true})
          if(count.totalDocs===0)data.role='admin'
          else if(req.user?.role!=='admin')data.role='editor'
        }
        return data
      }]},fields:[{name:'name',type:'text',required:true},{name:'role',type:'select',required:true,defaultValue:'editor',options:['admin','editor'],access:{create:adminField,update:adminField}}]},
    {slug:'media',admin:{group:'Content library',useAsTitle:'alt',description:'Upload approved website imagery. Every asset needs useful alternative text.',defaultColumns:['filename','alt','mimeType','updatedAt'],listSearchableFields:['alt','filename']},access:{read:()=>true,create:staff,update:staff,delete:admin},upload:{staticDir:path.resolve('uploads'),mimeTypes:['image/jpeg','image/png','image/webp','image/avif','image/gif'],imageSizes:[{name:'card',width:900},{name:'hero',width:1800}]},fields:[{name:'alt',type:'text',required:true,admin:{description:'Describe the image’s purpose for someone who cannot see it.'}},{name:'credit',type:'text',admin:{description:'Photographer, source, or license note when applicable.'}}]},
    {slug:'pages',access:contentAccess,versions:{drafts:true,maxPerDoc:30},admin:{useAsTitle:'title',group:'Website',description:'Edit copy within the approved layouts. Entry labels show where each line appears.',defaultColumns:['title','path','description','updatedAt'],listSearchableFields:['title','path'],preview:doc=>`${serverURL}/api/preview?path=${encodeURIComponent(String(doc.path))}`},
      hooks:{beforeChange:[({data,originalDoc})=>({...data,path:originalDoc?.path||data.path})]},
      fields:[title,{name:'path',type:'text',required:true,unique:true,admin:{description:'Existing route. Immutable after creation.'}},{name:'description',type:'textarea'},{name:'entries',label:'Page copy',type:'array',labels:{singular:'Text block',plural:'Text blocks'},admin:{initCollapsed:true,description:'Open a labeled block to edit its copy, then save a draft and preview the page.',components:{RowLabel:'/components/admin/ContentRowLabel#ContentRowLabel'}},fields:[{name:'key',type:'text',required:true,admin:{readOnly:true}},{name:'label',type:'text',admin:{readOnly:true}},{name:'value',label:'Website text',type:'textarea',required:true}]}]},
    Services,
    contentCollection('industries','/industries',{...industries[0],detail:industryDetails[industries[0].slug]}),
    contentCollection('projects','/work',{...projects[0],detail:caseDetails[projects[0].slug]}),
    {slug:'articles',labels:{singular:'Insight',plural:'Insights'},access:contentAccess,versions:{drafts:true,maxPerDoc:30},admin:{useAsTitle:'title',group:'Content library',description:'Draft and publish approved thinking from named authors.',defaultColumns:['title','author','publishedAt','_status'],listSearchableFields:['title','summary','author'],preview:doc=>`${serverURL}/api/preview?path=${encodeURIComponent(`/insights/${doc.slug}`)}`},fields:[title,slug,{name:'summary',type:'textarea',required:true},{name:'author',type:'text',required:true,admin:{description:'Approved public byline; no placeholder authors.'}},{name:'publishedAt',type:'date',required:true},{name:'cover',type:'upload',relationTo:'media'},{name:'body',type:'richText',required:true}]},
    {slug:'inquiries',admin:{useAsTitle:'name',group:'Operations',description:'Review project conversations received through the website contact form.',defaultColumns:['name','organization','email','status','createdAt'],listSearchableFields:['name','email','organization']},access:{create:()=>false,read:admin,update:admin,delete:admin},fields:[{name:'name',type:'text',required:true},{name:'email',type:'email',required:true},{name:'organization',type:'text'},{name:'projectType',type:'text'},{name:'projectStage',type:'text'},{name:'message',type:'textarea',required:true},{name:'status',type:'select',options:[{label:'New',value:'new'},{label:'Reviewed',value:'reviewed'},{label:'Closed',value:'closed'}],defaultValue:'new',required:true}]},
    {slug:'inquiry-limits',admin:{hidden:true},access:{create:()=>false,read:()=>false,update:()=>false,delete:()=>false},fields:[{name:'fingerprint',type:'text',unique:true,required:true},{name:'count',type:'number',required:true},{name:'windowStart',type:'date',required:true}]},
  ],
  globals:[
    {slug:'home-modules',label:'Homepage modules',access:{read:({req})=>Boolean(req.user),update:staff},versions:{drafts:true},admin:{group:'Website',description:'Manage structured homepage sections outside the main page-copy entry.'},fields:fieldsFrom(homeSeeds)},
    {slug:'site-settings',label:'Site settings',access:{read:()=>true,update:admin},admin:{group:'Website',description:'Control shared company, footer, and navigation content.'},fields:[{name:'companyName',type:'text',required:true,defaultValue:'Alool Technologies'},{name:'description',type:'textarea',defaultValue:'We turn complexity into connected digital systems.'},{name:'footerHeading',type:'text',defaultValue:'Let’s make the system work.'},{name:'navigation',type:'array',fields:[{name:'label',type:'text',required:true},{name:'href',type:'text',required:true,validate:(v:unknown)=>typeof v==='string'&&/^\/(?!\/)[a-z0-9/\-]*$/.test(v)||'Use a local site path.'}]}]},
    {slug:'working-method',label:'How we work',access:{read:({req})=>Boolean(req.user),update:staff},versions:{drafts:true},admin:{group:'Website',description:'Maintain the ordered working-method steps used across the site.'},fields:[{name:'steps',type:'array',fields:fieldsFrom(methodDetails[0])}]},
  ],
})
