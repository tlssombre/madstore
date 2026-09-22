'use client';
import Link from 'next/link';
import Image from 'next/image';
import {ChevronLeft,ChevronRight,Menu,Search,ShoppingBag,X} from 'lucide-react';
import {useEffect,useState} from 'react';
import {useCart} from '@/lib/cart-store';
import type {Product} from '@/lib/data';

const defaultNotices=[{id:'d1',text:'Garantie 12 mois'},{id:'d2',text:'Livraison sur tout Abidjan'},{id:'d3',text:'Produits 100 % authentiques'}];
export default function Header(){
  const [menu,setMenu]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState('');
  const [results,setResults]=useState<Product[]>([]);
  const [notices,setNotices]=useState<{id:string;text:string}[]>(defaultNotices);
  const items=useCart(s=>s.items); const cartCount=items.reduce((n,x)=>n+x.quantity,0);
  useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){setMenu(false);setSearchOpen(false)}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[]);
  useEffect(()=>{fetch('/api/notices').then(r=>r.ok?r.json():null).then(d=>{if(d?.notices?.length)setNotices(d.notices)}).catch(()=>{})},[]);
  useEffect(()=>{if(!searchOpen)return;const c=new AbortController();const t=setTimeout(()=>fetch('/api/store/products?q='+encodeURIComponent(query),{signal:c.signal}).then(r=>r.ok?r.json():{products:[]}).then(d=>setResults((d.products||[]).slice(0,6))).catch(()=>{}),180);return()=>{clearTimeout(t);c.abort()}},[query,searchOpen]);
  return <>
    <div className="notice"><div className="noticeTrack">{[...notices,...notices].map((n,i)=><span key={n.id+'-'+i}>{n.text}</span>)}</div></div>
    <header className="storeHeader">
      <Link href="/" className="brand"><Image src="/brand/logo-transparent.png" alt="MadStore2" width={210} height={80} priority/></Link>
      <nav aria-label="Navigation principale"><Link href="/catalogue">iPhone</Link><Link href="/catalogue">Mac</Link><Link href="/catalogue">iPad</Link><Link href="/catalogue">AirPods</Link><Link href="/catalogue">Apple Watch</Link><Link href="/catalogue">Accessoires</Link></nav>
      <div className="actions">
        <button className="headerIconBtn" type="button" onClick={()=>setSearchOpen(true)} aria-label="Rechercher"><Search/></button>
        <Link className="bag headerIconBtn" href="/panier" aria-label="Panier"><ShoppingBag/>{cartCount>0&&<i>{cartCount>99?'99+':cartCount}</i>}</Link>
        <button className="menuBtn headerIconBtn" type="button" onClick={()=>setMenu(true)} aria-label="Ouvrir le menu"><Menu/></button>
      </div>
    </header>
    <div className="promoStrip"><div className="promoThumb">M</div><div><b>NOUVEAU</b><strong>iPhone 17 Pro</strong><span>À partir de 949.000 F CFA</span></div><div className="promoArrows"><button aria-label="Précédent"><ChevronLeft/></button><button aria-label="Suivant"><ChevronRight/></button></div></div>

    {searchOpen&&<div className="searchOverlay" onMouseDown={e=>{if(e.currentTarget===e.target)setSearchOpen(false)}}>
      <section className="searchModal" role="dialog" aria-modal="true" aria-label="Recherche produits">
        <div className="searchModalTop"><div><span className="sectionKicker">RECHERCHE</span><h2>Que recherchez-vous ?</h2></div><button type="button" onClick={()=>setSearchOpen(false)} aria-label="Fermer"><X/></button></div>
        <div className="searchModalInput"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="iPhone, MacBook, AirPods…"/><span>{results.length} résultat{results.length>1?'s':''}</span></div>
        <div className="searchResults">{results.map(p=><Link key={p.slug} href={'/produit/'+p.slug} onClick={()=>setSearchOpen(false)}><span className={`searchResultVisual ${p.tone}`}>{p.kind==='laptop'?'▰':p.kind==='phone'?'▯':p.kind==='watch'?'◉':'◇'}</span><span><b>{p.name}</b><small>{p.category} · {p.brand}</small></span><strong>{p.price}</strong></Link>)}</div>
        <Link className="searchAll" href="/catalogue" onClick={()=>setSearchOpen(false)}>Voir tout le catalogue <span>→</span></Link>
      </section>
    </div>}

    {menu&&<><div className="drawerShade" onClick={()=>setMenu(false)}/><aside className="menuDrawer"><div className="drawerTop"><Image src="/brand/logo-transparent.png" alt="MadStore2" width={170} height={64}/><button type="button" onClick={()=>setMenu(false)} aria-label="Fermer"><X/></button></div><button className="searchBox" type="button" onClick={()=>{setMenu(false);setSearchOpen(true)}}><Search/> Rechercher un produit</button>{['iPhone','Mac','iPad','AirPods','Apple Watch','Accessoires','Samsung','Montres','Coques'].map(x=><Link key={x} href="/catalogue" onClick={()=>setMenu(false)}>{x}<span>›</span></Link>)}<hr/><Link className="accent" href="/promotions">Promotions <span>›</span></Link><Link href="/checkout">Contact <span>›</span></Link><Link href="/catalogue">Service de réparation <span>›</span></Link></aside></>}
  </>
}
