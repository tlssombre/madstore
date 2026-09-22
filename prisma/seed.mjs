import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';
const prisma=new PrismaClient();
const hashPassword=p=>{const salt=randomBytes(16).toString('hex');const derived=scryptSync(p,salt,64).toString('hex');return `scrypt$${salt}$${derived}`};
const email=(process.env.OWNER_EMAIL||'admin@madstore2.ci').toLowerCase();
const password=process.env.OWNER_PASSWORD||'MadStore2-ChangeMe!';
const name=process.env.OWNER_NAME||'Propriétaire MadStore2';
await prisma.staffUser.upsert({where:{email},update:{isOwner:true,role:'OWNER',status:'ACTIVE'},create:{name,email,passwordHash:hashPassword(password),role:'OWNER',status:'ACTIVE',isOwner:true,mustChangePassword:false,passwordChangedAt:new Date()}});
console.log(`Compte propriétaire prêt: ${email}`);
const slideCount=await prisma.homeSlide.count();
if(slideCount===0){
  await prisma.homeSlide.createMany({data:[
    {internalName:'MadStore Duo',eyebrow:'MADSTORE2',title:'Le duo qui vous suit partout.',subtitle:'Smartphone + tablette : travail, création et divertissement.',ctaLabel:'En savoir plus',ctaHref:'/catalogue',imageUrl:'/carousel/madstore-duo.svg',mobileImageUrl:'/carousel/madstore-duo.svg',background:'#f2f3f5',textColor:'#0b0d12',sortOrder:0,autoplayMs:5200},
    {internalName:'iPhone',eyebrow:'NOUVEAUTÉ',title:'iPhone. Simplement puissant.',subtitle:'Découvrez la sélection iPhone MadStore2.',ctaLabel:'Découvrir',ctaHref:'/catalogue?category=iPhone',imageUrl:'/carousel/madstore-iphone.svg',mobileImageUrl:'/carousel/madstore-iphone.svg',background:'#e9eef4',textColor:'#0b0d12',sortOrder:1,autoplayMs:5200},
    {internalName:'MacBook Pro',eyebrow:'PRO',title:'Pensé pour aller plus loin.',subtitle:'Puissance, autonomie et finition premium.',ctaLabel:'Voir les Mac',ctaHref:'/catalogue?category=Mac',imageUrl:'/carousel/madstore-mac.svg',mobileImageUrl:'/carousel/madstore-mac.svg',background:'#07182c',textColor:'#ffffff',sortOrder:2,autoplayMs:5200}
  ]});
  console.log('3 slides d’accueil créées.');
}

const defaultSections=[
 {key:'CAROUSEL',label:'Grand carrousel',sortOrder:0,itemLimit:1},
 {key:'CATEGORIES',label:'Catégories mises en avant',sortOrder:1,itemLimit:6},
 {key:'NEW_PRODUCTS',label:'Nouveautés',kicker:'NOUVEAUTÉS',title:'Tout juste arrivés.',ctaLabel:'Voir tout',ctaHref:'/catalogue',sortOrder:2,itemLimit:4},
 {key:'PROMO_BANNER',label:'Bannière commerciale',sortOrder:3,itemLimit:1},
 {key:'PROMOTIONS',label:'Promotions',kicker:'PROMOTIONS',title:'Les bons plans du moment.',ctaLabel:'Voir tout',ctaHref:'/promotions',sortOrder:4,itemLimit:4},
 {key:'FEATURED',label:'Produits en vedette',kicker:'EN VEDETTE',title:'La sélection MadStore2.',ctaLabel:'Voir tout',ctaHref:'/catalogue',sortOrder:5,itemLimit:4},
 {key:'BESTSELLERS',label:'Best-sellers',kicker:'BEST-SELLERS',title:'Les plus demandés.',ctaLabel:'Voir tout',ctaHref:'/catalogue',sortOrder:6,itemLimit:4},
 {key:'REASSURANCE',label:'Bloc qualité & sécurité',kicker:'MADSTORE2',title:'Qualité & Sécurité.',subtitle:'Des produits sélectionnés, contrôlés et garantis.',ctaLabel:'Découvrir',ctaHref:'/catalogue',sortOrder:7,itemLimit:1},
 {key:'UNIVERSES',label:'Nos univers',title:'Nos univers.',sortOrder:8,itemLimit:4}
];
for(const section of defaultSections) await prisma.homeSection.upsert({where:{key:section.key},update:{},create:section});
if(await prisma.homeCategory.count()===0) await prisma.homeCategory.createMany({data:[
 {internalName:'iPhone',label:'iPhone',href:'/catalogue?category=iPhone',symbol:'M',sortOrder:0},
 {internalName:'MacBook',label:'MacBook',href:'/catalogue?category=Mac',symbol:'MAD',sortOrder:1},
 {internalName:'Audio',label:'Audio',href:'/catalogue?category=Audio',symbol:'◉',sortOrder:2},
 {internalName:'Gaming',label:'Gaming',href:'/catalogue?category=Gaming',symbol:'G',sortOrder:3}
]});
if(await prisma.homeBanner.count()===0) await prisma.homeBanner.create({data:{internalName:'Offre MadStore2',eyebrow:'OFFRE MADSTORE2',title:'Des prix qui baissent. Pas nos standards.',body:'Profitez des offres en cours sur une sélection de produits, dans la limite des stocks disponibles.',ctaLabel:'Voir les promotions',ctaHref:'/promotions',badge:'JUSQU’À -14%',background:'#071a32',textColor:'#ffffff'}});
console.log('Structure de l’accueil prête: sections, catégories et bannière.');

if(!process.env.OWNER_PASSWORD) console.warn('ATTENTION: OWNER_PASSWORD absent. Changez le mot de passe par défaut avant production.');
// Catalogue de démonstration persistant. Le storefront lit désormais ces données PostgreSQL.
const catalogue=[
 ['iphone-17-pro','iPhone 17 Pro 256 Go','iPhone 17 Pro','iPhone','Apple','phone','silver','MAD-IP17P-256-TN','256 Go · Titane naturel','Titane naturel','256 Go','8 Go',949000,999000,8,true,true,false],
 ['iphone-16','iPhone 16 128 Go','iPhone 16','iPhone','Apple','phone','pink','MAD-IP16-128-PK','128 Go · Rose','Rose','128 Go','8 Go',695000,749000,12,false,true,true],
 ['macbook-pro-m5','MacBook Pro 14 pouces M5 Pro 24 Go / 2 To','MacBook Pro 14','Mac','Apple','laptop','dark','MAD-MBP14-M5-2T','24 Go / 2 To · Noir sidéral','Noir sidéral','2 To','24 Go',2599000,null,4,true,true,false],
 ['macbook-air-m4','MacBook Air 13 pouces M4 16 Go / 512 Go','MacBook Air M4','Mac','Apple','laptop','blue','MAD-MBA13-M4-512','16 Go / 512 Go · Bleu ciel','Bleu ciel','512 Go','16 Go',1049000,1149000,7,false,true,false],
 ['ipad-pro-m4','iPad Pro 11 pouces M4 Wi-Fi 256 Go','iPad Pro M4','iPad','Apple','tablet','light','MAD-IPADP11-256','256 Go · Argent','Argent','256 Go','8 Go',899000,null,6,false,true,true],
 ['apple-watch-series-11','Apple Watch Series 11 GPS 46 mm','Apple Watch S11','Watch','Apple','watch','dark','MAD-AWS11-46-BK','46 mm · Noir','Noir','64 Go','',349000,null,9,true,false,false],
 ['airpods-pro-3','AirPods Pro 3 avec boîtier MagSafe','AirPods Pro 3','Audio','Apple','earbuds','light','MAD-APP3-WH','Blanc','Blanc','','',189000,219000,18,false,false,true],
 ['ps5-slim','PlayStation 5 Slim Édition Standard','PS5 Slim','Gaming','Sony','console','light','MAD-PS5-SLIM-1T','1 To · Blanc','Blanc','1 To','',499000,null,5,false,true,true],
 ['jbl-charge-6','JBL Charge 6 Bluetooth','JBL Charge 6','Audio','JBL','speaker','orange','MAD-JBL-C6-BK','Noir','Noir','','',129000,null,11,false,false,false],
 ['magic-keyboard-ipad','Magic Keyboard pour iPad Pro 11 pouces','Magic Keyboard','Accessoires','Apple','accessory','light','MAD-MK-IPAD11-BK','Noir','Noir','','',239000,null,10,false,false,false]
];
for(const [slug,pname,shortName,categoryName,brandName,kind,tone,sku,label,color,storage,memory,price,compareAtPrice,stock,isNew,featured,bestseller] of catalogue){
 const cslug=String(categoryName).toLowerCase().replace(/[^a-z0-9]+/g,'-'); const bslug=String(brandName).toLowerCase().replace(/[^a-z0-9]+/g,'-');
 const category=await prisma.category.upsert({where:{slug:cslug},update:{name:categoryName},create:{name:categoryName,slug:cslug}});
 const brand=await prisma.brand.upsert({where:{slug:bslug},update:{name:brandName},create:{name:brandName,slug:bslug}});
 const product=await prisma.product.upsert({where:{slug},update:{name:pname,shortName,categoryId:category.id,brandId:brand.id,status:'ACTIVE',kind,tone,isNew,featured,bestseller},create:{slug,name:pname,shortName,description:`${pname}, sélectionné et contrôlé par MadStore2.`,categoryId:category.id,brandId:brand.id,status:'ACTIVE',kind,tone,isNew,featured,bestseller,specs:[['Garantie','12 mois'],['Référence',sku]]}});
 const existing=await prisma.productVariant.findUnique({where:{sku}});
 if(!existing){const variant=await prisma.productVariant.create({data:{productId:product.id,sku,label,color,storage,memory,price,compareAtPrice,stockOnHand:stock,stockReserved:0}});await prisma.stockMovement.create({data:{variantId:variant.id,type:'INITIAL',onHandDelta:stock,reason:'Stock initial seed'}})}
}
console.log('Catalogue PostgreSQL prêt avec stock initial journalisé.');

// Codes promotionnels persistants de démonstration.
const defaultCodes=[
 {code:'BIENVENUE10',label:'10 % de bienvenue',type:'PERCENT',value:10,minSubtotal:0},
 {code:'MAD5000',label:'5 000 F CFA de réduction',type:'FIXED',value:5000,minSubtotal:50000},
 {code:'LIVRAISON',label:'Livraison offerte',type:'FREE_SHIPPING',value:0,minSubtotal:100000}
];
for(const c of defaultCodes) await prisma.promoCode.upsert({where:{code:c.code},update:{},create:c});
console.log('Codes promo PostgreSQL prêts.');

await prisma.$disconnect();
