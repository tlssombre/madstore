'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import type {HomeSlideData} from '@/lib/home-slides';

export default function HomeCarousel({slides}:{slides:HomeSlideData[]}){
  const [index,setIndex]=useState(0); const [paused,setPaused]=useState(false); const touchX=useRef<number|null>(null);
  const current=slides[index]||slides[0];
  const go=(next:number)=>setIndex((next+slides.length)%slides.length);
  useEffect(()=>{if(slides.length<2||paused)return;const ms=Math.max(2800,current?.autoplayMs||5200);const timer=setTimeout(()=>go(index+1),ms);return()=>clearTimeout(timer)},[index,paused,slides.length,current?.autoplayMs]);
  useEffect(()=>{if(index>=slides.length)setIndex(0)},[slides.length,index]);
  if(!current)return null;
  return <section className="homeCarousel" aria-roledescription="carousel" aria-label="À la une" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onTouchStart={e=>{touchX.current=e.touches[0]?.clientX??null}} onTouchEnd={e=>{if(touchX.current===null)return;const dx=(e.changedTouches[0]?.clientX??touchX.current)-touchX.current;if(Math.abs(dx)>45)go(index+(dx<0?1:-1));touchX.current=null}}>
    <div className="homeCarouselTrack" style={{transform:`translateX(-${index*100}%)`}}>
      {slides.map((slide,i)=><article className={`homeSlide align${slide.contentAlign}`} key={slide.id} style={{background:slide.background,color:slide.textColor}} aria-hidden={i!==index}>
        <div className="homeSlideContent">
          {slide.eyebrow&&<span className="homeSlideEyebrow">{slide.eyebrow}</span>}
          <h1>{slide.title}</h1>
          {slide.subtitle&&<p>{slide.subtitle}</p>}
          {slide.ctaLabel&&slide.ctaHref&&<Link className="homeSlideCta" href={slide.ctaHref}>{slide.ctaLabel}</Link>}
        </div>
        {(slide.imageUrl||slide.mobileImageUrl)&&<picture className="homeSlideMedia">
          {slide.mobileImageUrl&&<source media="(max-width: 800px)" srcSet={slide.mobileImageUrl}/>}<img src={slide.imageUrl||slide.mobileImageUrl||''} alt="" draggable={false}/>
        </picture>}
      </article>)}
    </div>
    {slides.length>1&&<><button className="homeCarouselArrow prev" aria-label="Slide précédente" onClick={()=>go(index-1)}><ChevronLeft/></button><button className="homeCarouselArrow next" aria-label="Slide suivante" onClick={()=>go(index+1)}><ChevronRight/></button><div className="homeCarouselDots" role="tablist" aria-label="Choisir une slide">{slides.map((s,i)=><button key={s.id} role="tab" aria-selected={i===index} aria-label={`Slide ${i+1}`} className={i===index?'active':''} onClick={()=>setIndex(i)}/>)}</div></>}
  </section>
}
