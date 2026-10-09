import type {MetadataRoute} from 'next';
import {services,workStudies} from '@/lib/public-content';
export default function sitemap():MetadataRoute.Sitemap{const origin=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';return ['/',...services.map(s=>`/${s.slug}`),'/our-work','/our-craft','/fabrics','/world-of-darzi','/contact-us','/privacy','/terms','/cancellation-refunds',...workStudies.map(w=>`/our-work/${w.slug}`)].map(route=>({url:origin+route,changeFrequency:'monthly',priority:route==='/'?1:.7}));}
