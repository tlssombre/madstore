import { getCurrentStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChangePassword from '@/components/ChangePassword';
export default async function Page(){const staff=await getCurrentStaff();if(!staff)redirect('/connexion-admin');if(!staff.mustChangePassword)redirect('/admin');return <main className="adminPasswordPage"><ChangePassword/></main>}
