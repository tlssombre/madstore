import {requirePermission} from '@/lib/auth';import AdminNav from '@/components/AdminNav';import AdminCategories from '@/components/AdminCategories';
export const dynamic='force-dynamic';
export default async function Categories(){await requirePermission('products.view');return <main className="admin"><AdminNav/><section><p className="eyebrow">CATALOGUE</p><h1>Catégories</h1><p className="adminLead">Organisez les catégories utilisées pour classer les produits et filtrer le catalogue.</p><AdminCategories/></section></main>}
