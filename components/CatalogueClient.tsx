'use client';
import {useMemo,useState} from 'react';
import ProductCard from './ProductCard';
import type {Product} from '@/lib/data';

const cats=['Tout','iPhone','Mac','iPad','Audio','Watch','Gaming','Accessoires'];
const brands=['Tout','Apple','Android','Sony','JBL'];
export default function CatalogueClient({products,initialBrand,initialCategory}:{products:Product[];initialBrand?:string;initialCategory?:string}){
  const [cat,setCat]=useState(initialCategory&&cats.includes(initialCategory)?initialCategory:'Tout'); const [brand,setBrand]=useState(initialBrand&&brands.includes(initialBrand)?initialBrand:'Tout'); const [sort,setSort]=useState('default'); const [query,setQuery]=useState('');
  const list=useMemo(()=>{
    let out=products.filter(p=>(cat==='Tout'||p.category===cat)&&(brand==='Tout'||p.brand===brand)&&(p.name.toLowerCase().includes(query.toLowerCase())||p.category.toLowerCase().includes(query.toLowerCase())));
    const amount=(v:string)=>Number(v.replace(/\D/g,''));
    if(sort==='asc') out=[...out].sort((a,b)=>amount(a.price)-amount(b.price));
    if(sort==='desc') out=[...out].sort((a,b)=>amount(b.price)-amount(a.price));
    return out;
  },[products,cat,brand,sort,query]);
  return <>
    <div className="catalogSearch"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un produit..."/></div>
    <div className="categoryChips">{cats.map(c=><button key={c} className={cat===c?'active':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
    <div className="filterbar">
      <label>Prix <select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">Par défaut</option><option value="asc">Croissant</option><option value="desc">Décroissant</option></select></label>
      <label>Marque <select value={brand} onChange={e=>setBrand(e.target.value)}>{brands.map(b=><option key={b}>{b}</option>)}</select></label>
      <span className="resultCount">{list.length} produit{list.length>1?'s':''}</span>
    </div>
    {list.length?<div className="grid">{list.map(p=><ProductCard key={p.slug} p={p}/>)}</div>:<div className="emptyState"><b>Aucun produit trouvé.</b><span>Essayez une autre catégorie ou recherche.</span></div>}
  </>
}
