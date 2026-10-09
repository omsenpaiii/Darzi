'use client';

import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StitchLoader } from '@/components/shared/StitchLoader';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const chapters = [
  { name: 'The pattern', title: 'It starts with\na point of view.', body: 'Cloth, proportion and the possibility of something personal.' },
  { name: 'The foundation', title: 'Shape, from\nthe inside out.', body: 'A considered foundation gives the silhouette its character.' },
  { name: 'The silhouette', title: 'A lapel. A line.\nA little character.', body: 'Every piece finds its place. The garment begins to take shape.' },
  { name: 'The handwork', title: 'Quiet details.\nA lasting impression.', body: 'Stitches, lining and the finishing touches bring it together.' },
  { name: 'The finishing', title: 'Made around\nyou.', body: 'A complete silhouette, ready for your own story.' },
];

export function Hero({ frames }: { frames: string[] }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const currentChapter = useRef(0);
  const [ready, setReady] = useState(false);
  const [loadingScene, setLoadingScene] = useState(false);
  const [staticScene, setStaticScene] = useState(false);
  const [chapter, setChapter] = useState(0);

  useGSAP(() => {
    const element = root.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    const media = gsap.matchMedia();

    media.add({ motion: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      let disposed = false;
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      const useStatic = Boolean(context.conditions?.reduced || connection?.saveData || frames.length < 2);
      setStaticScene(useStatic);
      setLoadingScene(!useStatic);
      setReady(false);
      currentChapter.current = 0;
      setChapter(0);
      if (useStatic) return;

      const drawing = surface.getContext('2d', { alpha: false });
      if (!drawing) { setStaticScene(true); setLoadingScene(false); return; }
      const images: HTMLImageElement[] = [];
      const loaded: boolean[] = [];
      const state = { progress: 0 };
      let timeline: gsap.core.Timeline | undefined;
      let width = 0, height = 0, ratio = 1;

      const drawFrame = (image: HTMLImageElement, alpha: number) => {
        drawing.globalAlpha = alpha;
        if (width < 768) {
          const sceneHeight = height * .66;
          const scale = Math.min(sceneHeight / image.naturalHeight, width * .97 / (image.naturalWidth * .48));
          const focus = image.naturalWidth * .65;
          const imageHeight = image.naturalHeight * scale;
          drawing.drawImage(image, width * .5 - focus * scale, height - imageHeight, image.naturalWidth * scale, imageHeight);
        } else {
          const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
          const imageWidth = image.naturalWidth * scale, imageHeight = image.naturalHeight * scale;
          drawing.drawImage(image, (width - imageWidth) * .5, (height - imageHeight) * .5, imageWidth, imageHeight);
        }
      };
      const render = () => {
        const position = Math.min(1, state.progress / .9) * (images.length - 1);
        let index = Math.min(images.length - 1, Math.floor(position));
        // Keep a decoded frame visible while later frames load on slower connections.
        while (index >= 0 && !loaded[index]) index--;
        if (index < 0) return;
        const next = Math.min(index + 1, images.length - 1);
        const blend = loaded[next] ? Math.min(1, position - index) : 0;
        drawing.setTransform(ratio, 0, 0, ratio, 0, 0);
        drawing.globalAlpha = 1;
        drawing.fillStyle = '#101413';
        drawing.fillRect(0, 0, width, height);
        drawFrame(images[index], 1);
        if (blend > 0) drawFrame(images[next], blend);
        drawing.globalAlpha = 1;
        if (width < 768) {
          const imageHeight = Math.min(height * .66, width * .97 / (images[index].naturalWidth * .48) * images[index].naturalHeight);
          const top = height - imageHeight;
          const fade = drawing.createLinearGradient(0, top, 0, top + imageHeight * .22);
          fade.addColorStop(0, '#101413');
          fade.addColorStop(1, '#10141300');
          drawing.fillStyle = fade;
          drawing.fillRect(0, top, width, imageHeight * .22);
        }
      };
      const resize = () => {
        width = element.clientWidth;
        height = element.clientHeight;
        ratio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
        surface.width = Math.round(width * ratio);
        surface.height = Math.round(height * ratio);
        render();
      };
      resize();
      frames.forEach((source, index) => {
        const image = new Image();
        image.decoding = 'async';
        images.push(image);
        loaded.push(false);
        image.onload = () => {
          if (disposed) return;
          loaded[index] = true;
          render();
          if (index === 0) { setReady(true); setLoadingScene(false); }
        };
        image.onerror = () => {
          if (disposed || index !== 0) return;
          timeline?.scrollTrigger?.kill(true);
          timeline?.kill();
          setStaticScene(true);
          setLoadingScene(false);
        };
        image.src = source;
      });
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: element, start: 'top top', end: () => `+=${Math.round(window.innerHeight * 3.6)}`, pin: true, scrub: .55, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      timeline.to(state, {
        progress: 1,
        duration: 1,
        ease: 'none',
        onUpdate: () => {
          render();
          const nextChapter = Math.min(chapters.length - 1, Math.floor(state.progress * chapters.length));
          if (nextChapter !== currentChapter.current) {
            currentChapter.current = nextChapter;
            setChapter(nextChapter);
          }
          if (rail.current) rail.current.style.transform = `scaleX(${Math.max(.035, Math.min(1, state.progress / .9))})`;
        },
      }, 0);
      timeline.to(intro.current, { autoAlpha: 0, y: -22, duration: .16 }, 0);
      timeline.fromTo(story.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .07 }, .16);
      return () => {
        disposed = true;
        observer.disconnect();
        images.forEach(image => { image.onload = null; image.onerror = null; });
      };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [frames.join('|')], revertOnUpdate: true });

  return <section className={`hero hero-scroll ${staticScene ? 'assembly-static-mode' : ''}`} ref={root} aria-label="Scroll to see the suit take shape">
    <picture className="hero-media hero-static"><img src={frames[0] || '/media/hero-exploded.webp'} alt="A charcoal wool suit explored through its pattern, canvas, wool panels and finishing details" width="1920" height="1080" fetchPriority="high" /></picture>
    <picture className="hero-reduced"><img src={frames.at(-1) || '/media/hero-complete.webp'} width="1920" height="1080" alt="The completed charcoal wool suit, an illustrative design study" /></picture>
    <canvas ref={canvas} className={`assembly-canvas ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
    {loadingScene && <div className="hero-stitch-loading"><StitchLoader variant="stage" tone="dark" label="Preparing the cloth…" /></div>}
    <div className="hero-copy" ref={intro}>
      <h1>Every detail.<br />Made around<br /><em>you.</em></h1>
      <p>A personal commission. A considered silhouette. <br />Tailoring that starts with you.</p>
      <div className="hero-actions"><Link href="/contact-us" className="button button-hero">Request a consultation <ArrowRight size={19} /></Link><Link href="/our-work" className="text-link">Explore our work</Link></div>
    </div>
    <div className="assembly-story" ref={story} aria-hidden="true"><h2>{chapters[chapter].title.split('\n').map(line => <span key={line}>{line}</span>)}</h2><p>{chapters[chapter].body}</p></div>
    <div className="assembly-bottom"><a className="assembly-scroll-cue" href="#character"><ArrowDown size={18} /><span>SCROLL TO DISCOVER</span></a><div className="assembly-progress"><div className="assembly-progress-track"><div ref={rail} /></div><span>{chapters[chapter].name}</span></div></div>
    <p className="sr-only">Scroll through cloth, structure, the silhouette, handwork and the finished suit. These are original illustrative design frames.</p>
  </section>;
}
