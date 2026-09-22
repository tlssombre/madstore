'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Boxes,FolderTree,LayoutDashboard,Package,PanelsTopLeft,ScrollText,Settings,ShoppingCart,Tags,Truck,Users} from 'lucide-react';

const icons:any={dashboard:LayoutDashboard,orders:ShoppingCart,products:Package,categories:FolderTree,stock:Boxes,promotions:Tags,delivery:Truck,content:PanelsTopLeft,staff:Users,audit:ScrollText,settings:Settings};
export default function AdminNavClient({items}:{items:{href?:string;label:string;icon:string}[]}){const pathname=usePathname();return <nav className="adminNavLinks">{items.map(item=>{const Icon=icons[item.icon]||Package;const active=item.href&&(pathname===item.href||(item.href!=='/admin'&&pathname.startsWith(item.href)));return item.href?<Link key={item.label} className={active?'active':''} href={item.href}><Icon/><span>{item.label}</span></Link>:<span key={item.label} className="adminNavDisabled"><Icon/><span>{item.label}</span><small>Bientôt</small></span>})}</nav>}
