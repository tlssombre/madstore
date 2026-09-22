'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {Menu,X} from 'lucide-react';

export default function AdminSideDrawer({children}:{children:React.ReactNode}){
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  useEffect(()=>{setOpen(false)},[pathname]);
  return <>
    <div className="adminMobileBar">
      <button className="adminMenuBtn" onClick={()=>setOpen(true)} aria-label="Ouvrir le menu"><Menu/></button>
      <img src="/brand/logo-transparent.png" alt="MadStore2"/>
    </div>
    {open&&<div className="adminDrawerShade" onClick={()=>setOpen(false)}/>}
    <aside className={open?'adminSide open':'adminSide'}>
      <button className="adminDrawerClose" onClick={()=>setOpen(false)} aria-label="Fermer le menu"><X/></button>
      {children}
    </aside>
  </>;
}
