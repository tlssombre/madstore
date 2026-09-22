'use client';
import {useEffect,useState} from 'react';
import {ArrowDown,ArrowUp,CheckCircle2,Eye,EyeOff,FolderTree,Pencil,Plus,Trash2,X} from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

type Category={id:string;name:string;slug:string;active:boolean;sortOrder:number;productCount:number};

export default function AdminCategories(){
  const [items,setItems]=useState<Category[]>([]),[loading,setLoading]=useState(true),[toast,setToast]=useState('');
  const [open,setOpen]=useState(false),[editing,setEditing]=useState<Category|null>(null),[draft,setDraft]=useState(''),[saving,setSaving]=useState(false),[error,setError]=useState('');
  const [removeTarget,setRemoveTarget]=useState<Category|null>(null);
  const notify=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2500)};
  const load=()=>{setLoading(true);fetch('/api/admin/categories',{cache:'no-store'}).then(r=>r.json()).then(j=>setItems(j.categories||[])).finally(()=>setLoading(false))};
  useEffect(load,[]);
  const sorted=[...items].sort((a,b)=>a.sortOrder-b.sortOrder);

  const start=(c?:Category)=>{setEditing(c||null);setDraft(c?.name||'');setError('');setOpen(true)};
  const save=async()=>{
    const name=draft.trim();if(!name)return setError('Le nom est requis.');
    setSaving(true);
    const r=await fetch(editing?`/api/admin/categories/${editing.id}`:'/api/admin/categories',{method:editing?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
    const d=await r.json().catch(()=>({}));
    setSaving(false);
    if(!r.ok)return setError(d.error||'Enregistrement impossible.');
    setOpen(false);load();notify(editing?'Catégorie mise à jour':'Catégorie créée');
  };
  const patch=async(c:Category,p:Partial<Category>)=>{const next={...c,...p};setItems(v=>v.map(x=>x.id===c.id?next:x));await fetch(`/api/admin/categories/${c.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)})};
  const move=async(i:number,d:-1|1)=>{const a=sorted[i],b=sorted[i+d];if(!b)return;await Promise.all([patch(a,{sortOrder:b.sortOrder}),patch(b,{sortOrder:a.sortOrder})]);load()};
  const remove=async()=>{
    if(!removeTarget)return;
    const r=await fetch(`/api/admin/categories/${removeTarget.id}`,{method:'DELETE'});
    const d=await r.json().catch(()=>({}));
    setRemoveTarget(null);
    if(!r.ok)return notify(d.error||'Suppression impossible.');
    load();notify('Catégorie supprimée');
  };

  if(loading)return <div className="carouselAdminEmpty"><FolderTree/><p>Chargement…</p></div>;
  return <>
    {toast&&<div className="premiumToast"><CheckCircle2/><span>{toast}</span></div>}
    <div className="adminToolbar">
      <div><b>{items.length}</b> catégorie(s) de catalogue</div>
      <button onClick={()=>start()}><Plus/> Nouvelle catégorie</button>
    </div>
    {!sorted.length?<div className="carouselAdminEmpty"><FolderTree/><h3>Aucune catégorie</h3><p>Les catégories organisent le catalogue (iPhone, Mac, Audio…) et servent de filtre sur la boutique.</p><button onClick={()=>start()}><Plus/> Créer une catégorie</button></div>:
    <div className="adminTable"><div className="adminRow adminHead categoryDbRow"><span>Nom</span><span>Produits</span><span>Statut</span><span>Actions</span></div>
    {sorted.map((c,i)=><div className="adminRow categoryDbRow" key={c.id}>
      <span><b>{c.name}</b><small>{c.slug}</small></span>
      <span>{c.productCount} produit{c.productCount>1?'s':''}</span>
      <span><i className={c.active?'stockOk':'staffSuspended'}>{c.active?'Active':'Masquée'}</i></span>
      <span className="rowActions">
        <button title="Monter" disabled={i===0} onClick={()=>move(i,-1)}><ArrowUp/></button>
        <button title="Descendre" disabled={i===sorted.length-1} onClick={()=>move(i,1)}><ArrowDown/></button>
        <button title={c.active?'Masquer':'Activer'} onClick={()=>patch(c,{active:!c.active})}>{c.active?<Eye/>:<EyeOff/>}</button>
        <button title="Renommer" onClick={()=>start(c)}><Pencil/></button>
        <button title="Supprimer" disabled={c.productCount>0} onClick={()=>setRemoveTarget(c)}><Trash2/></button>
      </span>
    </div>)}</div>}

    {open&&<div className="adminModalShade" onMouseDown={e=>{if(e.currentTarget===e.target)setOpen(false)}}>
      <div className="adminModal categoryDbModal">
        <button className="modalClose" onClick={()=>setOpen(false)}><X/></button>
        <span className="sectionKicker">CATALOGUE</span>
        <h2>{editing?'Renommer la catégorie':'Nouvelle catégorie'}</h2>
        <p className="modalIntro">{editing?'Le changement s’applique immédiatement à tous les produits de cette catégorie.':'Elle sera disponible pour classer vos produits dès sa création.'}</p>
        <label>Nom<input autoFocus value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Ex. Accessoires"/></label>
        {error&&<small className="couponError checkoutError">{error}</small>}
        <button className="saveProduct" disabled={saving} onClick={save}>{saving?'Enregistrement…':'Enregistrer'}</button>
      </div>
    </div>}
    <ConfirmDialog open={!!removeTarget} title="Supprimer cette catégorie ?" description="Cette action est définitive. Elle n’est possible que si aucun produit ne l’utilise plus." danger confirmLabel="Supprimer" onClose={()=>setRemoveTarget(null)} onConfirm={remove}/>
  </>;
}
