import assert from 'node:assert/strict'
import {randomBytes} from 'node:crypto'
import sharp from 'sharp'
import {chromium} from '/Users/dhaban/.npm/_npx/c61c9351a0dbcfa7/node_modules/playwright/index.mjs'
const base='http://localhost:4174'; const password=randomBytes(24).toString('base64url')
let token,adminID,editorID,articleID,mediaID;const inquiries=[]
const results=[]
async function request(path,method='GET',data,auth=token){
 const response=await fetch(base+path,{method,headers:{Origin:path==='/api/contact'?'http://localhost:4173':base,...(data?{'Content-Type':'application/json'}:{}),...(auth?{Authorization:`JWT ${auth}`}:{})},body:data?JSON.stringify(data):undefined,redirect:'manual'})
 let body;try{body=await response.json()}catch{body=null}return {status:response.status,body,response}
}
const check=(name,test)=>{assert.ok(test,name);results.push(name);console.log('PASS',name)}
try{
 const first=await request('/api/users/first-register','POST',{email:'cms-qa@example.invalid',password,name:'Temporary CMS QA'},null)
 check('Private first administrator setup',first.status===200&&first.body.user.role==='admin');token=first.body.token;adminID=first.body.user.id
 const editor=await request('/api/users','POST',{email:'editor-qa@example.invalid',password,name:'Temporary editor QA',role:'editor'});editorID=editor.body.doc.id
 const editorLogin=await request('/api/users/login','POST',{email:'editor-qa@example.invalid',password},null);const editorToken=editorLogin.body.token
 check('Editor cannot create administrators',(await request('/api/users','POST',{email:'blocked@example.invalid',password,name:'Blocked',role:'admin'},editorToken)).status===403)
 check('Editor cannot read private inquiries',(await request('/api/inquiries','GET',null,editorToken)).status===403)
 const profile=await request(`/api/users/${editorID}`,'PATCH',{name:'Updated QA editor',role:'admin'},editorToken)
 check('Editor can edit own profile without escalating role',profile.status===200&&profile.body.doc.name==='Updated QA editor'&&profile.body.doc.role==='editor')
 check('Anonymous cannot create content',(await request('/api/articles','POST',{title:'blocked'},null)).status===403)
 check('Anonymous preview rejected',(await request('/api/preview?path=/','GET',null,null)).status===401)
 const article=await request('/api/articles','POST',{title:'Temporary CMS QA article',slug:'temporary-cms-qa',summary:'A temporary local integration check, removed after testing.',author:'Internal QA',publishedAt:new Date().toISOString(),_status:'draft',body:{root:{type:'root',format:'',indent:0,version:1,direction:'ltr',children:[{type:'paragraph',format:'',indent:0,version:1,direction:'ltr',children:[{type:'text',text:'Temporary integration test content.',format:0,detail:0,mode:'normal',style:'',version:1}]}]}}},editorToken)
 check('Editor can save an article draft',article.status===201);articleID=article.body.doc.id
 check('Draft hidden from anonymous REST',(await request(`/api/articles/${articleID}?draft=true`,'GET',null,null)).status===404)
 check('Draft page is not public',(await fetch(base+'/insights/temporary-cms-qa')).status===404)
 const published=await request(`/api/articles/${articleID}`,'PATCH',{_status:'published'},editorToken)
 check('Editor can publish',published.status===200)
 check('Published article route renders',(await fetch(base+'/insights/temporary-cms-qa')).status===200)
 check('Published article appears in archive',(await(await fetch(base+'/insights')).text()).includes('Temporary CMS QA article'))
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto(base+'/admin/login');await page.getByLabel('Email').fill('cms-qa@example.invalid');await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'Login',exact:true}).click();await page.waitForURL('**/admin');await page.screenshot({path:'.design/alool-site/screenshots/cms-dashboard-1440.png',fullPage:true});await page.locator('.card__click[href="/admin/collections/pages"]').click();await page.waitForURL('**/admin/collections/pages');await page.screenshot({path:'.design/alool-site/screenshots/cms-pages-1440.png',fullPage:true});check('Admin login and content listing render',errors.length===0)
 await request(`/api/articles/${articleID}?draft=true`,'PATCH',{title:'Private unpublished revision',_status:'draft'},editorToken)
 check('Unpublished revision does not replace public article',!(await(await fetch(base+'/insights/temporary-cms-qa')).text()).includes('Private unpublished revision'))
 await page.goto(base+'/api/preview?path=/insights/temporary-cms-qa');check('Signed-in preview shows draft',await page.getByRole('heading',{level:1}).innerText()==='Private unpublished revision');await page.goto(base+'/api/preview/exit')
 const png=await sharp({create:{width:32,height:32,channels:3,background:'#176B52'}}).png().toBuffer();const form=new FormData();form.set('_payload',JSON.stringify({alt:'Temporary upload QA'}));form.set('file',new Blob([png],{type:'image/png'}),'temporary-qa.png')
 const upload=await fetch(base+'/api/media',{method:'POST',headers:{Authorization:`JWT ${token}`,Origin:base},body:form});const uploaded=await upload.json();check('Media upload accepted',upload.status===201);mediaID=uploaded.doc.id;check('Uploaded image served',(await fetch(uploaded.doc.url)).status===200)
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/admin');await page.screenshot({path:'.design/alool-site/screenshots/cms-dashboard-390.png',fullPage:true});check('Mobile admin has no page overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await browser.close()
 check('Wrong-origin inquiries rejected',(await fetch(base+'/api/contact',{method:'POST',headers:{Origin:'https://example.invalid','Content-Type':'application/json'},body:'{}'})).status===403)
 check('Invalid inquiries rejected',(await request('/api/contact','POST',{name:'Q',email:'bad',message:'short'},null)).status===400)
 for(let i=0;i<6;i++){
  const r=await request('/api/contact','POST',{name:'Temporary CMS QA',email:'inquiry-qa@example.invalid',message:'Temporary local backend integration check. Please remove after testing.'},null)
  check(i===5?'Inquiry rate limit enforced':`Inquiry ${i+1} saved`,r.status===(i===5?429:200))
 }
 const inbox=await request('/api/inquiries?where[email][equals]=inquiry-qa@example.invalid');inquiries.push(...inbox.body.docs.map(d=>d.id));check('Administrator inbox contains saved inquiries',inquiries.length===5)
 console.log('CMS QA complete:',results.length,'checks')
} finally {
 for(const id of inquiries)await request(`/api/inquiries/${id}`,'DELETE')
 if(articleID)await request(`/api/articles/${articleID}`,'DELETE')
 if(mediaID)await request(`/api/media/${mediaID}`,'DELETE')
 if(editorID)await request(`/api/users/${editorID}`,'DELETE')
 if(adminID)await request(`/api/users/${adminID}`,'DELETE')
 console.log('Removed temporary QA content and accounts; first-user setup remains available.')
}
