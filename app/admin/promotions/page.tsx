import { requirePermission } from '@/lib/auth';
import AdminNav from '@/components/AdminNav'; import AdminPromotions from '@/components/AdminPromotions';
export default async function PromotionsAdmin(){await requirePermission('promotions.view');return <main className="admin"><AdminNav/><section><p className="eyebrow">VENTES</p><h1>Promotions</h1><p className="adminLead">Programmez les remises, campagnes et codes promotionnels de la boutique.</p><AdminPromotions/></section></main>}
