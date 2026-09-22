import { requirePermission } from '@/lib/auth';
import AdminNav from '@/components/AdminNav'; import AdminProducts from '@/components/AdminProducts';
export default async function AdminProduits(){await requirePermission('products.view');return <main className="admin"><AdminNav/><section><p className="eyebrow">CATALOGUE</p><h1>Produits</h1><p className="adminLead">Ajoutez, recherchez et gérez les articles de MadStore2.</p><AdminProducts/></section></main>}
