'use client';
import Link from 'next/link';
import {useMemo,useState} from 'react';
import {ChevronLeft,ChevronRight,X} from 'lucide-react';
import CartDrawer from './CartDrawer';
import {formatPrice,type Product} from '@/lib/data';
import {useCart} from '@/lib/cart-store';

export default function ProductQuickView({p,onClose}:{p:Product;onClose:()=>void}){
  const images=useMemo(()=>p.images&&p.images.length?p.images:(p.imageUrl?[p.imageUrl]:[]),[p.images,p.imageUrl]);
  const [imgIndex,setImgIndex]=useState(0);
  const variants=p.variants&&p.variants.length?p.variants:null;
  const [variantId,setVariantId]=useState(variants?.find(v=>v.stock>0)?.id||variants?.[0]?.id||'');
  const [qty,setQty]=useState(1);
  const [added,setAdded]=useState(false);
  const add=useCart(s=>s.add);
  const v=useMemo(()=>variants?.find(x=>x.id===variantId)||variants?.[0],[variants,variantId]);
  const price=v?v.price:p.priceValue;
  const oldPrice=v?v.compareAtPrice:p.oldPriceValue;
  const stock=v?v.stock:p.stock;
  const canBuy=stock>0;
  const discount=oldPrice&&oldPrice>price?Math.round((1-price/oldPrice)*100):0;

  const doAdd=()=>{
    if(!canBuy)return;
    add({variantId:v?.id||p.slug,productId:p.id,slug:p.slug,name:p.name,variantName:v?.label||[p.color,p.storage].filter(Boolean).join(' · '),sku:v?.sku||p.sku,price,quantity:qty,stock,imageUrl:p.imageUrl,tone:p.tone,kind:p.kind});
    setAdded(true);
  };

  return <>
    <div className="quickViewShade" onClick={onClose}>
      <div className="quickViewModal" onClick={e=>e.stopPropagation()}>
        <button className="quickViewClose" onClick={onClose} aria-label="Fermer"><X/></button>
        <div className={'quickViewMedia '+p.tone}>
          {discount>0&&<span className="discountBadge">-{discount}%</span>}
          {images.length?<><img src={images[imgIndex]} alt=""/>
            {images.length>1&&<>
              <button type="button" className="galleryArrow prev" onClick={()=>setImgIndex(n=>(n-1+images.length)%images.length)} aria-label="Image précédente"><ChevronLeft/></button>
              <button type="button" className="galleryArrow next" onClick={()=>setImgIndex(n=>(n+1)%images.length)} aria-label="Image suivante"><ChevronRight/></button>
              <div className="galleryDots">{images.map((_,n)=><button type="button" key={n} className={n===imgIndex?'active':''} onClick={()=>setImgIndex(n)} aria-label={`Image ${n+1}`}/>)}</div>
            </>}
          </>:<span className={'deviceVisual '+p.kind} aria-hidden="true"><i></i><em>{p.kind==='laptop'?'MAD':p.kind==='phone'?'M':p.kind==='watch'?'12:45':p.kind==='tablet'?'MAD':p.kind==='console'?'PS5':p.kind==='speaker'?'JBL':p.kind==='earbuds'?'● ●':'⌨'}</em></span>}
        </div>
        <div className="quickViewInfo">
          <span className="tag">{p.tag}</span>
          <h2>{p.name}</h2>
          <div className="quickViewPrice"><b>{formatPrice(price)}</b>{!!oldPrice&&oldPrice>price&&<small className="oldPrice">{formatPrice(oldPrice)}</small>}</div>
          {p.description&&<p className="quickViewDesc">{p.description}</p>}
          {variants&&variants.length>1&&<div className="quickViewVariants">{variants.map(x=><button key={x.id} type="button" className={x.id===v?.id?'active':''} disabled={x.stock<=0} onClick={()=>{setVariantId(x.id);setQty(1);setAdded(false)}}>{x.label}</button>)}</div>}
          <span className="quickViewStock">{canBuy?`${stock} disponible(s)`:'Rupture de stock'}</span>
          <div className="quickViewBuyRow">
            <div className="qty"><button type="button" onClick={()=>setQty(Math.max(1,qty-1))}>−</button><b>{qty}</b><button type="button" disabled={qty>=stock} onClick={()=>setQty(Math.min(stock,qty+1))}>＋</button></div>
            <button type="button" className="addCart" disabled={!canBuy} onClick={doAdd}>{canBuy?'Ajouter au panier':'Rupture de stock'}</button>
          </div>
          <div className="quickViewActions">
            <Link href={'/produit/'+p.slug} className="quickViewMore">Voir la fiche complète ›</Link>
          </div>
        </div>
      </div>
    </div>
    <CartDrawer open={added} onClose={()=>{setAdded(false);onClose()}}/>
  </>;
}
