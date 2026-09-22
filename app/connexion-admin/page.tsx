import { getCurrentStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLogin from '@/components/AdminLogin';
export default async function ConnexionAdmin(){const staff=await getCurrentStaff();if(staff)redirect(staff.mustChangePassword?'/admin/changer-mot-de-passe':'/admin');return <AdminLogin/>}
