"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * DESIGN.md motion: short opacity and transform reveals only — no scroll
 * hijacking, no scrub, no pinning, nothing perpetual.
 *
 * The hidden state is set from JavaScript rather than CSS, so a failed or
 * disabled script leaves every block at full opacity instead of blank. The
 * reduced-motion branch is handled by gsap.matchMedia(), which reverts the
 * hidden state automatically if the user flips the setting mid-session.
 */
export function Reveal(){
  const pathname=usePathname();
  useGSAP(()=>{
    const mm=gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)",()=>{
      const solo=gsap.utils.toArray<HTMLElement>(".reveal");
      const groups=gsap.utils.toArray<HTMLElement>(".reveal-stagger");

      gsap.set(solo,{opacity:0,y:14});
      // Opacity only for groups: .fragment-card and .project.compact .project-link
      // already use transform for layout, and animating y here would flatten it.
      for(const group of groups)gsap.set(group.children,{opacity:0});

      ScrollTrigger.batch(solo,{
        start:"top 88%",
        once:true,
        onEnter:batch=>gsap.to(batch,{opacity:1,y:0,duration:.7,ease:"power2.out",stagger:.08,overwrite:true}),
      });

      for(const group of groups){
        ScrollTrigger.create({
          trigger:group,
          start:"top 88%",
          once:true,
          onEnter:()=>gsap.to(group.children,{opacity:1,duration:.7,ease:"power2.out",stagger:.07,overwrite:true}),
        });
      }
    });
    // next/font swaps faces after first paint, which moves every trigger position.
    document.fonts?.ready.then(()=>ScrollTrigger.refresh());
    return ()=>mm.revert();
  },{dependencies:[pathname],revertOnUpdate:true});
  return null;
}
