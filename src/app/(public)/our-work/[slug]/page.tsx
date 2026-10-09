import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {workStudies} from '@/lib/public-content';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;return {title:workStudies.find(w=>w.slug===slug)?.title||'Work not found'};}
export default async function WorkDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const work=workStudies.find(w=>w.slug===slug);if(!work)notFound();return <main id="main" className="work-detail"><section className="section"><Link className="text-link back-link" href="/our-work"><ArrowLeft size={18}/>All design studies</Link><div className="work-detail-heading"><h1>{work.title}</h1><p>{work.description}</p></div><img className="work-detail-image" src={work.image} alt={`Illustrative garment design study: ${work.title}`} width="1536" height="1500" fetchPriority="high"/><div className="work-spec"><span className="small-label">ILLUSTRATIVE DESIGN STUDY</span><ul>{work.details.map(detail=><li key={detail}>{detail}</li>)}</ul><Link className="button button-wine" href={`/contact-us?service=${work.category==='Weddings'?'Weddings':'Bespoke'}`}>Discuss a similar direction <ArrowRight size={20}/></Link></div></section></main>;}
