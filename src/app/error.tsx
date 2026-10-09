'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="not-found"><span>DARZI</span><h1>A moment, please.</h1><p>This page couldn’t load. Your saved work remains in the workspace.</p><button className="button button-wine" onClick={reset}>Try again</button></main>;}
