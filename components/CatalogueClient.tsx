'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight,Filter,Search,SlidersHorizontal,X} from 'lucide-react';
import ProductCard from './ProductCard';
import type {Product} from '@/lib/data';

const cats=['Tout','iPhone','Mac','iPad','Audio','Watch','Gaming','Accessoires'];
const brands=['Tout','Apple','Android','Sony','JBL'];
export default function CatalogueClient({products,initialBrand,initialCategory}:{products:Product[];initialBrand?:string;initialCategory?:string}){
  const [cat,setCat]=useState(initialCategory&&cats.includes(initialCategory)?initialCategory:'Tout'); const [brand,setBrand]=useState(initialBrand&&brands.includes(initialBrand)?initialBrand:'Tout'); const [sort,setSort]=useState('default'); const [query,setQuery]=useState(''); const [filtersOpen,setFiltersOpen]=useState(false); const [canScrollLeft,setCanScrollLeft]=useState(false); const [canScrollRight,setCanScrollRight]=useState(false); const categoryRail=useRef<HTMLDivElement>(null);
  const list=useMemo(()=>{
    let out=products.filter(p=>(cat==='Tout'||p.category===cat)&&(brand==='Tout'||p.brand===brand)&&(p.name.toLowerCase().includes(query.toLowerCase())||p.category.toLowerCase().includes(query.toLowerCase())));
    const amount=(v:string)=>Number(v.replace(/\D/g,''));
    if(sort==='asc') out=[...out].sort((a,b)=>amount(a.price)-amount(b.price));
    if(sort==='desc') out=[...out].sort((a,b)=>amount(b.price)-amount(a.price));
    return out;
  },[products,cat,brand,sort,query]);
  const updateRail=()=>{const rail=categoryRail.current;if(!rail)return;setCanScrollLeft(rail.scrollLeft>4);setCanScrollRight(rail.scrollLeft+rail.clientWidth<rail.scrollWidth-4)};
  useEffect(()=>{updateRail();window.addEventListener('resize',updateRail);return()=>window.removeEventListener('resize',updateRail)},[]);
  const moveRail=(direction:number)=>categoryRail.current?.scrollBy({left:direction*180,behavior:'smooth'});
  const resetFilters=()=>{setBrand('Tout');setSort('default')};
  const activeFilters=(brand!=='Tout'?1:0)+(sort!=='default'?1:0);
  return <>
    <div className="catalogToolbar">
      <div className="catalogSearch"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un produit..." aria-label="Rechercher un produit"/>{query&&<button type="button" onClick={()=>setQuery('')} aria-label="Effacer la recherche"><X/></button>}</div>
      <div className="catalogCategoryBar">
        <button type="button" className={'categoryRailControl left '+(!canScrollLeft?'isHidden':'')} onClick={()=>moveRail(-1)} aria-label="Catégories précédentes"><ChevronLeft/></button>
        <div className="categoryChips" ref={categoryRail} onScroll={updateRail}>{cats.map(c=><button key={c} className={cat===c?'active':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
        <button type="button" className={'categoryRailControl right '+(!canScrollRight?'isHidden':'')} onClick={()=>moveRail(1)} aria-label="Catégories suivantes"><ChevronRight/></button>
      </div>
      <div className="catalogToolbarMeta"><span className="resultCount">{list.length} produit{list.length>1?'s':''}</span><button type="button" className="catalogFilterButton" onClick={()=>setFiltersOpen(true)}><SlidersHorizontal/> Filtres {activeFilters>0&&<b>{activeFilters}</b>}</button></div>
    </div>
    {filtersOpen&&<div className="catalogFilterShade" onMouseDown={e=>{if(e.currentTarget===e.target)setFiltersOpen(false)}}><section className="catalogFilterModal" role="dialog" aria-modal="true" aria-labelledby="catalogFilterTitle"><div className="catalogFilterHead"><div><span className="sectionKicker">CATALOGUE</span><h2 id="catalogFilterTitle">Filtrer les produits</h2></div><button type="button" onClick={()=>setFiltersOpen(false)} aria-label="Fermer"><X/></button></div><div className="filterModalGroup"><b>Marque</b><div className="filterChoiceGrid">{brands.map(item=><button type="button" key={item} className={brand===item?'active':''} onClick={()=>setBrand(item)}>{item}</button>)}</div></div><div className="filterModalGroup"><b>Trier par prix</b><div className="filterChoiceGrid"><button type="button" className={sort==='default'?'active':''} onClick={()=>setSort('default')}>Recommandés</button><button type="button" className={sort==='asc'?'active':''} onClick={()=>setSort('asc')}>Prix croissant</button><button type="button" className={sort==='desc'?'active':''} onClick={()=>setSort('desc')}>Prix décroissant</button></div></div><div className="catalogFilterActions"><button type="button" className="filterReset" onClick={resetFilters}>Réinitialiser</button><button type="button" className="filterApply" onClick={()=>setFiltersOpen(false)}><Filter/> Voir {list.length} produit{list.length>1?'s':''}</button></div></section></div>}
    {list.length?<div className="grid">{list.map(p=><ProductCard key={p.slug} p={p}/>)}</div>:<div className="emptyState"><b>Aucun produit trouvé.</b><span>Essayez une autre catégorie ou recherche.</span></div>}
  </>
}
