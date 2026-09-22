import {requirePermission} from '@/lib/auth';
import AdminNav from '@/components/AdminNav';
import AdminHomeContent from '@/components/AdminHomeContent';
export default async function ContenuAdmin(){await requirePermission('content.view');return <main className="admin"><AdminNav/><section><p className="eyebrow">STOREFRONT</p><h1>Accueil & contenu</h1><p className="adminLead">Pilotez l’ordre des sections, le carrousel, les catégories mises en avant et les campagnes commerciales sans modifier le code.</p><AdminHomeContent/></section></main>}
