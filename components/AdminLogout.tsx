'use client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function AdminLogout(){const router=useRouter();return <button className="adminLogout" onClick={async()=>{await fetch('/api/admin/auth/logout',{method:'POST'});router.replace('/connexion-admin');router.refresh()}}><LogOut/> Déconnexion</button>}
