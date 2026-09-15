/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node diagnostic, not application code. */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/Users/dhaban/.npm/_npx/c61c9351a0dbcfa7/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const out = path.join(root,'.design/alool-site/screenshots');
const routes = ['/', '/work','/work/connected-operations-platform','/work/digital-service-experience','/work/purpose-built-workflow','/services','/services/custom-software','/services/business-systems','/services/digital-experiences','/services/technology-consulting','/industries','/industries/business-enterprise','/industries/government','/industries/development','/industries/startups','/about','/about/how-we-work','/insights','/contact','/privacy','/terms'];
const widths = [1440,1024,768,390];
const base=process.env.QA_BASE||'http://localhost:3000';
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({headless:true});
  const results=[];
  for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    for(const route of routes){
      const errors=[];
      const onError=e=>errors.push(e.message);
      const onConsole=e=>{if(e.type()==='error')errors.push(e.text());};
      page.on('pageerror',onError);
      page.on('console',onConsole);
      const response=await page.goto(base+route,{waitUntil:'networkidle'});
      await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
      const audit=await page.evaluate(()=>{
        const hidden=e=>e.closest('[aria-hidden="true"], [inert], nextjs-portal');
        const overflow=[...document.querySelectorAll('main *,footer *')].filter(e=>{
          if(hidden(e))return false;
          const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+2||r.left< -2);
        }).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,50)}));
        return {title:document.title,h1:document.querySelectorAll('h1').length,overflow,brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0||i.getBoundingClientRect().height<1).map(i=>i.src),sections:[...document.querySelectorAll('main > section')].map(e=>({class:e.className,height:Math.round(e.getBoundingClientRect().height)}))};
      });
      const filename=`${route==='/'?'home':route.slice(1).replaceAll('/','-')}-${width}.png`;
      await page.screenshot({path:path.join(out,filename),fullPage:true});
      results.push({route,width,status:response.status(),errors,...audit,filename});
      page.off('pageerror',onError);
      page.off('console',onConsole);
      console.log(JSON.stringify({route,width,status:response.status(),overflow:audit.overflow.length,brokenImages:audit.brokenImages.length,errors}));
    }
    await page.close();
  }
  const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await p.goto(base+'/contact');
  await p.getByRole('button',{name:'Open navigation menu'}).click();
  await p.getByRole('navigation',{name:'Mobile navigation'}).waitFor({state:'visible'});
  const menuVisible=await p.getByRole('navigation',{name:'Mobile navigation'}).isVisible();
  await p.keyboard.press('Escape');
  const escapeClosed=await p.getByRole('button',{name:'Open navigation menu'}).getAttribute('aria-expanded')==='false';
  await p.getByRole('button',{name:'Check inquiry details'}).click();
  const errorsShown=await p.locator('[role="alert"]').count();
  await p.getByLabel('Your name').fill('QA check');
  await p.getByLabel('Work email').fill('qa@example.com');
  await p.getByLabel('What are you working on?').fill('Local test of the contact validation workflow.');
  await p.getByRole('button',{name:'Check inquiry details'}).click();
  const success=await p.getByRole('status').isVisible();
  await p.screenshot({path:path.join(out,'contact-success-390.png'),fullPage:true});
  const interaction={menuVisible,escapeClosed,errorsShown,success};
  fs.writeFileSync(path.join(out,'qa-results.json'),JSON.stringify({results,interaction},null,2));
  console.log('INTERACTIONS',interaction);
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
