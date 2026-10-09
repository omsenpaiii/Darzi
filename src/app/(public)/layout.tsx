import { SiteHeader, SiteFooter } from '@/components/public/SiteShell';
export default function PublicLayout({children}:{children:React.ReactNode}) { return <div className="public-site"><a className="skip-link" href="#main">Skip to content</a><SiteHeader />{children}<SiteFooter /></div>; }
