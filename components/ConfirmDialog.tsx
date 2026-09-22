'use client';
import { AlertTriangle, X } from 'lucide-react';

type Props={
  open:boolean;
  title:string;
  description:string;
  confirmLabel?:string;
  cancelLabel?:string;
  danger?:boolean;
  loading?:boolean;
  onConfirm:()=>void;
  onClose:()=>void;
};

export default function ConfirmDialog({open,title,description,confirmLabel='Confirmer',cancelLabel='Annuler',danger=false,loading=false,onConfirm,onClose}:Props){
  if(!open)return null;
  return <div className="premiumModalShade" role="presentation" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}>
    <section className="premiumDialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <button className="premiumDialogClose" type="button" onClick={onClose} aria-label="Fermer"><X/></button>
      <span className={`premiumDialogIcon ${danger?'danger':''}`}><AlertTriangle/></span>
      <h2 id="confirm-title">{title}</h2>
      <p>{description}</p>
      <div className="premiumDialogActions">
        <button type="button" className="btnSecondary" onClick={onClose} disabled={loading}>{cancelLabel}</button>
        <button type="button" className={danger?'btnDanger':'btnPrimary'} onClick={onConfirm} disabled={loading}>{loading?'Traitement…':confirmLabel}</button>
      </div>
    </section>
  </div>
}
