'use client';
import {useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';

export default function ProductGallery({images,alt,tone,kind,badge}:{images:string[];alt:string;tone:string;kind:string;badge?:React.ReactNode}){
  const [i,setI]=useState(0);
  const [loaded,setLoaded]=useState(false);
  const has=images.length>0;
  const selectImage=(next:number)=>{setLoaded(false);setI(next)};
  return <div className="gallery productGallery">
    {badge}
    {has?<><div className={'productImageStage '+(loaded?'isLoaded':'')}>
      {!loaded&&<span className="productImageLoader" aria-label="Chargement de l’image" role="status"/>}
      <img className="realProductImage" src={images[i]} alt={alt} onLoad={()=>setLoaded(true)}/>
    </div>
      {images.length>1&&<>
        <button type="button" className="galleryArrow prev" onClick={()=>selectImage((i-1+images.length)%images.length)} aria-label="Image précédente"><ChevronLeft/></button>
        <button type="button" className="galleryArrow next" onClick={()=>selectImage((i+1)%images.length)} aria-label="Image suivante"><ChevronRight/></button>
        <div className="productThumbnails" aria-label="Choisir une image">{images.map((image,n)=><button type="button" key={image+n} className={n===i?'active':''} onClick={()=>selectImage(n)} aria-label={`Voir l’image ${n+1}`} aria-current={n===i}><img src={image} alt=""/></button>)}</div>
      </>}
    </>:<div className={'bigDevice '+tone}><span className={'deviceVisual detail '+kind} aria-hidden="true"><i></i><em>{kind==='laptop'?'MAD':kind==='phone'?'M':kind==='watch'?'12:45':'MAD'}</em></span></div>}
  </div>;
}
