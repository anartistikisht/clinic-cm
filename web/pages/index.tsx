import { useEffect, useState } from 'react';
import Login from '../components/Auth';
import Layout from '../components/Layout';
export default function Home(){ const [logged,setLogged]=useState(false); useEffect(()=>{ setLogged(!!localStorage.getItem('token')); },[]); if(!logged) return <Login onLogin={()=>setLogged(true)} />; return (<Layout><h2>Mirësevini!</h2><p>Zgjidh një modul nga menuja.</p></Layout>); }