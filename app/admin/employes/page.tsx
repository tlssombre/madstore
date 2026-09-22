import { requirePermission } from '@/lib/auth';
import AdminNav from '@/components/AdminNav';
import AdminEmployees from '@/components/AdminEmployees';
export default async function AdminEmployes(){await requirePermission('staff.view');return <main className="admin"><AdminNav/><section><p className="eyebrow">ÉQUIPE & SÉCURITÉ</p><h1>Employés & permissions</h1><p className="adminLead">Créez des accès individuels et contrôlez précisément les actions autorisées.</p><AdminEmployees/></section></main>}
