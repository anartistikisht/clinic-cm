import { useState } from 'react';
import { api } from '../lib/api';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('admin@clinic.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: any) => { e.preventDefault();
    try { const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); localStorage.setItem('token', data.token); onLogin(); }
    catch { setError('Kredencialet nuk janë të sakta'); } };
  return (<div style={{ maxWidth: 360, margin: '10vh auto' }}>
      <h1>Clinic CMS – Login</h1>
      <form onSubmit={submit}>
        <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /></div>
        <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /></div>
        <button type="submit">Hyr</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>);
}