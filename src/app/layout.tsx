import type { Metadata } from 'next';
import { Bodoni_Moda, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google';
import '@/styles/globals.css';
import '@/styles/public.css';
import '@/styles/admin.css';
const display = Bodoni_Moda({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Source_Sans_3({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-mono', display: 'swap' });
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), title: { default: 'DARZI — Tailoring that starts with you', template: '%s · DARZI' }, description: 'Explore a personal approach to bespoke tailoring, made to measure, weddings and alterations. Visit the DARZI Melbourne studio.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${mono.variable}`}><body>{children}</body></html>; }
