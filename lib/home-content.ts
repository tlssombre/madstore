import {prisma} from './prisma';

export const HOME_SECTION_KEYS=['CAROUSEL','CATEGORIES','NEW_PRODUCTS','PROMO_BANNER','PROMOTIONS','FEATURED','BESTSELLERS','REASSURANCE','UNIVERSES'] as const;
export type HomeSectionKey=typeof HOME_SECTION_KEYS[number];
export type HomeSectionData={key:HomeSectionKey;label:string;kicker?:string|null;title?:string|null;subtitle?:string|null;ctaLabel?:string|null;ctaHref?:string|null;active:boolean;sortOrder:number;itemLimit:number};
export type HomeCategoryData={id:string;internalName:string;label:string;href:string;imageUrl?:string|null;symbol?:string|null;background:string;active:boolean;sortOrder:number};
export type HomeBannerData={id:string;internalName:string;eyebrow?:string|null;title:string;body?:string|null;ctaLabel?:string|null;ctaHref?:string|null;badge?:string|null;imageUrl?:string|null;background:string;textColor:string;active:boolean;sortOrder:number;startsAt?:Date|null;endsAt?:Date|null};

export const defaultHomeSections:HomeSectionData[]=[
 {key:'CAROUSEL',label:'Grand carrousel',active:true,sortOrder:0,itemLimit:1},
 {key:'CATEGORIES',label:'Catégories mises en avant',active:true,sortOrder:1,itemLimit:6},
 {key:'NEW_PRODUCTS',label:'Nouveautés',kicker:'NOUVEAUTÉS',title:'Tout juste arrivés.',ctaLabel:'Voir tout',ctaHref:'/catalogue',active:true,sortOrder:2,itemLimit:4},
 {key:'PROMO_BANNER',label:'Bannière commerciale',active:true,sortOrder:3,itemLimit:1},
 {key:'PROMOTIONS',label:'Promotions',kicker:'PROMOTIONS',title:'Les bons plans du moment.',ctaLabel:'Voir tout',ctaHref:'/promotions',active:true,sortOrder:4,itemLimit:4},
 {key:'FEATURED',label:'Produits en vedette',kicker:'EN VEDETTE',title:'La sélection MadStore2.',ctaLabel:'Voir tout',ctaHref:'/catalogue',active:true,sortOrder:5,itemLimit:4},
 {key:'BESTSELLERS',label:'Best-sellers',kicker:'BEST-SELLERS',title:'Les plus demandés.',ctaLabel:'Voir tout',ctaHref:'/catalogue',active:true,sortOrder:6,itemLimit:4},
 {key:'REASSURANCE',label:'Bloc qualité & sécurité',kicker:'MADSTORE2',title:'Qualité & Sécurité.',subtitle:'Des produits sélectionnés, contrôlés et garantis.',ctaLabel:'Découvrir',ctaHref:'/catalogue',active:true,sortOrder:7,itemLimit:1},
 {key:'UNIVERSES',label:'Nos univers',title:'Nos univers.',active:true,sortOrder:8,itemLimit:4},
];
export const defaultHomeCategories:HomeCategoryData[]=[
 {id:'demo-iphone',internalName:'iPhone',label:'iPhone',href:'/catalogue?category=iPhone',symbol:'M',background:'#1559c7',active:true,sortOrder:0},
 {id:'demo-mac',internalName:'MacBook',label:'MacBook',href:'/catalogue?category=Mac',symbol:'MAD',background:'#1559c7',active:true,sortOrder:1},
 {id:'demo-audio',internalName:'Audio',label:'Audio',href:'/catalogue?category=Audio',symbol:'◉',background:'#1559c7',active:true,sortOrder:2},
 {id:'demo-gaming',internalName:'Gaming',label:'Gaming',href:'/catalogue?category=Gaming',symbol:'G',background:'#1559c7',active:true,sortOrder:3},
];
export const defaultHomeBanners:HomeBannerData[]=[{id:'demo-offer',internalName:'Offre MadStore2',eyebrow:'OFFRE MADSTORE2',title:'Des prix qui baissent. Pas nos standards.',body:'Profitez des offres en cours sur une sélection de produits, dans la limite des stocks disponibles.',ctaLabel:'Voir les promotions',ctaHref:'/promotions',badge:'JUSQU’À -14%',background:'#071a32',textColor:'#ffffff',active:true,sortOrder:0}];

export async function getHomeContent(){
 try{
  const now=new Date();
  const [sectionRows,categoryRows,bannerRows]=await Promise.all([
   prisma.homeSection.findMany({orderBy:{sortOrder:'asc'}}),
   prisma.homeCategory.findMany({where:{active:true},orderBy:[{sortOrder:'asc'},{createdAt:'asc'}]}),
   prisma.homeBanner.findMany({where:{active:true,AND:[{OR:[{startsAt:null},{startsAt:{lte:now}}]},{OR:[{endsAt:null},{endsAt:{gte:now}}]}]},orderBy:[{sortOrder:'asc'},{createdAt:'desc'}]})
  ]);
  const byKey=new Map(sectionRows.map(s=>[s.key,s]));
  const sections=defaultHomeSections.map(d=>({...d,...byKey.get(d.key),key:d.key as HomeSectionKey})).sort((a,b)=>a.sortOrder-b.sortOrder);
  return {sections,categories:categoryRows,banners:bannerRows};
 }catch{return {sections:defaultHomeSections,categories:defaultHomeCategories,banners:defaultHomeBanners}}
}
