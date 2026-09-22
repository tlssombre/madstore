'use client';
import {useState} from 'react';
import {Heart} from 'lucide-react';
import {discountPercent,type Product} from '@/lib/data';
import ProductQuickView from './ProductQuickView';

export default function ProductCard({p}:{p:Product}){
  const discount=discountPercent(p);
  const [open,setOpen]=useState(false);
  return <>
    <div className="productCard" role="button" tabIndex={0} onClick={()=>setOpen(true)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setOpen(true)}}}>
      <div className={'productVisual '+p.tone}>{discount>0&&<span className="discountBadge">-{discount}%</span>}<span className="heart" aria-hidden="true"><Heart/></span>{p.imageUrl?<img className="cardRealImage" src={p.imageUrl} alt=""/>:<span className={'deviceVisual '+p.kind} aria-hidden="true"><i></i><em>{p.kind==='laptop'?'MAD':p.kind==='phone'?'M':p.kind==='watch'?'12:45':p.kind==='tablet'?'MAD':p.kind==='console'?'PS5':p.kind==='speaker'?'JBL':p.kind==='earbuds'?'● ●':'⌨'}</em></span>}</div>
      <span className="tag">{p.tag}</span>
      <h3>{p.name}</h3>
      <div className="priceLine"><p className="cardPrice">{p.price}</p>{p.oldPrice&&<small className="oldPrice">{p.oldPrice}</small>}</div>
    </div>
    {open&&<ProductQuickView p={p} onClose={()=>setOpen(false)}/>}
  </>;
}
