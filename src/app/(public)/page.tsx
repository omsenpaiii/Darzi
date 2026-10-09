import { Hero } from '@/components/public/Hero';
import { EditorialWork, ServicesAndCloth, StudioFinale } from '@/components/public/HomeSections';
import { CraftStory } from '@/components/public/CraftStory';
export default function Home(){const frames=Array.from({length:7},(_,i)=>`/media/assembly/frame-${String(i).padStart(2,'0')}.webp`);return <main id="main"><Hero frames={frames}/><EditorialWork/><CraftStory/><ServicesAndCloth/><StudioFinale/></main>;}
