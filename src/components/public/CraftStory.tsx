'use client';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { chapters } from '@/lib/public-content';
gsap.registerPlugin(ScrollTrigger,useGSAP);
export function CraftStory(){const root=useRef<HTMLElement>(null);const [active,setActive]=useState(0);
 useGSAP(()=>{const mm=gsap.matchMedia();mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)',()=>{ScrollTrigger.create({trigger:root.current,start:'top 80px',end:'+=1400',pin:true,pinSpacing:true,onUpdate:self=>setActive(Math.min(3,Math.floor(self.progress*4)))});});return()=>mm.revert();},{scope:root});
 return <section className="craft-section section" id="craft" ref={root}><div className="craft-heading"><h2>From pattern<br/>to presence.</h2><p>A conversation becomes a pattern.<br/>A pattern becomes something personal.</p></div><div className="craft-layout"><div className="craft-stage"><div className="craft-images">{chapters.map((chapter,index)=><img key={chapter.title} src={chapter.image} alt={index===0?'Illustrative tailoring handwork':`Design study: ${chapter.title.toLowerCase()}`} width="1200" height="800" loading="lazy" className={active===index?'is-active':''}/>)}</div><div className="craft-stage-caption"><span>0{active+1} / {chapters[active].title.toUpperCase()}</span><div><button aria-label="Previous craft chapter" onClick={()=>setActive((active+3)%4)}><ArrowLeft size={18}/></button><button aria-label="Next craft chapter" onClick={()=>setActive((active+1)%4)}><ArrowRight size={18}/></button></div></div></div><div className="craft-chapters">{chapters.map((chapter,index)=><article key={chapter.title} className={active===index?'active':''}><button aria-expanded={active===index} onClick={()=>setActive(index)}><span>0{index+1}</span><h3>{chapter.title}</h3></button><p>{chapter.body}</p><img className="mobile-chapter-image" src={chapter.image} alt={`Illustrative ${chapter.title.toLowerCase()} study`} width="900" height="600" loading="lazy"/></article>)}</div></div></section>;
}
