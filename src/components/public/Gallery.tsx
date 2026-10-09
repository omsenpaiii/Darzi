'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {workStudies} from '@/lib/public-content';
export function Gallery(){const [category,setCategory]=useState('All');const works=workStudies.filter(w=>category==='All'||w.category===category);return <section className="gallery-section section"><div className="gallery-filters" aria-label="Filter work">{['All','Suits','Weddings','Details'].map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div><p className="gallery-disclosure">Design studies — original illustrative imagery. Client commissions will be published with approval.</p><div className="gallery-grid">{works.map(work=><Link href={`/our-work/${work.slug}`} className="work-piece" key={work.slug}><div className="work-image"><img src={work.image} alt={`Design study: ${work.title}`} width="1000" height="1300" loading="lazy"/><span className="work-arrow"><ArrowUpRight size={21}/></span></div><h3>{work.title}</h3><p>{work.subtitle}</p></Link>)}</div>{!works.length&&<p role="status">No work in this selection yet.</p>}</section>;}
