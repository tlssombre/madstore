import AdminNav from '@/components/AdminNav';
import AuditLogTable from '@/components/AuditLogTable';
import { requirePermission } from '@/lib/auth';
export default async function Journal(){await requirePermission('settings.view');return <main className="admin"><AdminNav/><section><p className="eyebrow">SÉCURITÉ</p><h1>Journal d’activité</h1><p className="adminLead">Historique des connexions et actions sensibles du back-office.</p><AuditLogTable/></section></main>}
