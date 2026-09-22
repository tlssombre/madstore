import { prisma } from './prisma';

export type HomeSlideData = {
  id:string; internalName:string; eyebrow?:string|null; title:string; subtitle?:string|null;
  ctaLabel?:string|null; ctaHref?:string|null; imageUrl?:string|null; mobileImageUrl?:string|null;
  background:string; textColor:string; contentAlign:string; active:boolean; sortOrder:number; autoplayMs:number;
};

export const defaultHomeSlides:HomeSlideData[] = [
  {id:'demo-duo',internalName:'MadStore Duo',eyebrow:'MADSTORE2',title:'Le duo qui vous suit partout.',subtitle:'Smartphone + tablette : travail, création et divertissement.',ctaLabel:'En savoir plus',ctaHref:'/catalogue',imageUrl:'/carousel/madstore-duo.svg',mobileImageUrl:'/carousel/madstore-duo.svg',background:'#f2f3f5',textColor:'#0b0d12',contentAlign:'CENTER',active:true,sortOrder:0,autoplayMs:5200},
  {id:'demo-iphone',internalName:'iPhone',eyebrow:'NOUVEAUTÉ',title:'iPhone. Simplement puissant.',subtitle:'Découvrez la sélection iPhone MadStore2.',ctaLabel:'Découvrir',ctaHref:'/catalogue?category=iPhone',imageUrl:'/carousel/madstore-iphone.svg',mobileImageUrl:'/carousel/madstore-iphone.svg',background:'#e9eef4',textColor:'#0b0d12',contentAlign:'CENTER',active:true,sortOrder:1,autoplayMs:5200},
  {id:'demo-mac',internalName:'MacBook Pro',eyebrow:'PRO',title:'Pensé pour aller plus loin.',subtitle:'Puissance, autonomie et finition premium.',ctaLabel:'Voir les Mac',ctaHref:'/catalogue?category=Mac',imageUrl:'/carousel/madstore-mac.svg',mobileImageUrl:'/carousel/madstore-mac.svg',background:'#07182c',textColor:'#ffffff',contentAlign:'CENTER',active:true,sortOrder:2,autoplayMs:5200},
];

export async function getPublishedHomeSlides():Promise<HomeSlideData[]> {
  try {
    const rows = await prisma.homeSlide.findMany({where:{active:true},orderBy:[{sortOrder:'asc'},{createdAt:'asc'}]});
    return rows;
  } catch {
    return defaultHomeSlides;
  }
}
