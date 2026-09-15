"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { Logo } from "@/components/Logo";

export function Header({navigation=nav}:{navigation?:{label:string;href:string}[]}) {
  const pathname = usePathname();
  const [menuPath,setMenuPath] = useState<string|null>(null);
  const open = menuPath === pathname;
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = [...document.querySelectorAll('main section, .contact-band, footer')];
      const active = sections.find(e => { const r=e.getBoundingClientRect(); return r.top<=40 && r.bottom>40; });
      const dark = open || (active instanceof HTMLElement && (active.dataset.theme==='dark' || /ink-section|brand-section|contact-band|site-footer/.test(active.className)));
      header.current?.classList.toggle('on-dark',!!dark);
      header.current?.classList.toggle('scrolled',window.scrollY>18);
    };
    const schedule = () => { if(!frame) frame=requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    return () => { cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule); };
  },[pathname,open]);
  useEffect(() => {
    document.body.classList.toggle('menu-open',open);
    const focusFrame = open ? requestAnimationFrame(() => menu.current?.querySelector('a')?.focus()) : 0;
    const onKey = (e:KeyboardEvent) => {
      if(!open) return;
      if(e.key==='Escape'){setMenuPath(null);toggle.current?.focus();}
      if(e.key==='Tab'){
        const links = [...(menu.current?.querySelectorAll('a') ?? [])];
        const first=links[0], last=links[links.length-1];
        if(e.shiftKey && document.activeElement===first){e.preventDefault();toggle.current?.focus();}
        else if(!e.shiftKey && document.activeElement===last){e.preventDefault();toggle.current?.focus();}
        else if(document.activeElement===toggle.current){e.preventDefault();(e.shiftKey?last:first)?.focus();}
      }
    };
    const media=window.matchMedia('(min-width:1021px)');
    const closeDesktop=()=>{if(media.matches)setMenuPath(null);};
    document.addEventListener('keydown',onKey);media.addEventListener('change',closeDesktop);
    return ()=>{cancelAnimationFrame(focusFrame);document.body.classList.remove('menu-open');document.removeEventListener('keydown',onKey);media.removeEventListener('change',closeDesktop);};
  },[open]);
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header ref={header} className="site-header"><div className="container nav-shell">
      <Link className="brand" href="/" aria-label="Alool Technologies home"><Logo aria-hidden="true" role={undefined}/></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{navigation.map(item=><Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href)?'page':undefined}>{item.label}</Link>)}</nav>
      <Link className="nav-cta" href="/contact">Discuss your project <span aria-hidden="true">↗</span></Link>
      <button ref={toggle} className="menu-toggle" type="button" aria-label={open?'Close navigation menu':'Open navigation menu'} aria-controls="mobile-menu" aria-expanded={open} onClick={()=>setMenuPath(open?null:pathname)}><i aria-hidden="true"/></button>
    </div></header>
    <aside ref={menu} id="mobile-menu" className={`mobile-menu ${open?'open':''}`} aria-hidden={!open} inert={!open}><div className="container"><nav aria-label="Mobile navigation">{[...navigation,{label:'How we work',href:'/about/how-we-work'},{label:'Discuss your project',href:'/contact'}].map(item=><Link key={item.href} href={item.href} onClick={()=>setMenuPath(null)}>{item.label}</Link>)}</nav></div></aside>
  </>;
}
