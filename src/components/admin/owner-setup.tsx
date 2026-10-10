"use client";
import Link from 'next/link';
import { BrandWordmark } from "@/components/shared/BrandWordmark";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Button, ErrorMessage, Field } from './admin-ui';

export function OwnerSetup({ email, kind = 'owner' }: { email: string; kind?: 'owner'|'staff' }) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const invite = new URLSearchParams(window.location.hash.slice(1)).get('invite');
    if (invite) {
      setToken(invite);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);
  async function createAccount() {
    if (password !== confirmation) { setError('The two passwords do not match.'); return; }
    if (!token) { setError('Open the original private setup link to continue.'); return; }
    setBusy(true); setError('');
    try {
      const response = await fetch(kind === 'staff' ? '/api/staff-setup' : '/api/owner-setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, token, name, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Account setup could not be completed.');
      setPassword(''); setConfirmation(''); setToken('');
      router.replace('/admin');
    } catch (error) { setError(error instanceof Error ? error.message : 'Please retry account setup.'); }
    finally { setBusy(false); }
  }
  return <div className="admin-sign-in">
    <section className="admin-sign-in-story">
      <Link href="/" className="admin-sign-in-wordmark" aria-label="Darzi home"><BrandWordmark /></Link>
      <div><h1>Behind every<br /><em>remarkable detail.</em></h1><p>The atelier workspace.<br />Australia & India, working as one.</p></div>
      <span><ShieldCheck size={17} />Private {kind === 'staff' ? 'team' : 'owner'} invitation</span>
    </section>
    <section className="admin-sign-in-form"><div>
      <LockKeyhole size={23} /><h2>Your atelier starts here.</h2><p>{kind === 'staff' ? 'Activate your private workspace account.' : 'Create your Super Admin account.'}</p>
      <form onSubmit={event => { event.preventDefault(); void createAccount(); }}>
        <Field label="Your name"><input autoComplete="name" value={name} onChange={event => setName(event.target.value)} minLength={2} maxLength={80} required /></Field>
        <Field label="Email address"><input type="email" autoComplete="username" value={email} readOnly required /></Field>
        <Field label="Choose a password" hint="Use at least 12 characters."><input type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} minLength={12} maxLength={128} required /></Field>
        <Field label="Confirm password"><input type="password" autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} minLength={12} maxLength={128} required /></Field>
        <ErrorMessage message={error} />
        <Button type="submit" busy={busy}>Create my account<ArrowRight size={17} /></Button>
      </form>
      <p className="admin-sign-in-help">This private invitation works once, for the email shown. Keep your password private.</p>
      <Link href="/admin/sign-in" className="admin-text-link">Already set up? Sign in<ArrowRight size={14} /></Link>
    </div></section>
  </div>;
}
