import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata={title:'MadStore2 — Qualité & Sécurité',description:'Votre boutique tech en Côte d’Ivoire',icons:{icon:'/brand/favicon.png'}};
export const viewport: Viewport={width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
