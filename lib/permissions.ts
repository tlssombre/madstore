export type PermissionKey =
  | 'dashboard.view'
  | 'orders.view' | 'orders.update' | 'orders.cancel'
  | 'quotes.view' | 'quotes.manage'
  | 'products.view' | 'products.create' | 'products.update' | 'products.delete'
  | 'stock.view' | 'stock.update'
  | 'promotions.view' | 'promotions.manage'
  | 'content.view' | 'content.manage'
  | 'delivery.view' | 'delivery.manage'
  | 'reports.view'
  | 'settings.view' | 'settings.manage'
  | 'staff.view' | 'staff.manage';

export type PermissionGroup = { label: string; description: string; permissions: { key: PermissionKey; label: string }[] };

export const permissionGroups: PermissionGroup[] = [
  { label: 'Tableau de bord', description: 'Indicateurs principaux de la boutique.', permissions: [
    { key: 'dashboard.view', label: 'Voir le tableau de bord' }, { key: 'reports.view', label: 'Voir les rapports et chiffres' },
  ]},
  { label: 'Commandes & devis', description: 'Accès aux ventes et informations de livraison.', permissions: [
    { key: 'orders.view', label: 'Voir les commandes' }, { key: 'orders.update', label: 'Modifier le statut des commandes' }, { key: 'orders.cancel', label: 'Annuler une commande' },
    { key: 'quotes.view', label: 'Voir les devis' }, { key: 'quotes.manage', label: 'Créer / modifier les devis' },
  ]},
  { label: 'Catalogue', description: 'Produits, prix et informations commerciales.', permissions: [
    { key: 'products.view', label: 'Voir les produits' }, { key: 'products.create', label: 'Créer des produits' }, { key: 'products.update', label: 'Modifier produits et prix' }, { key: 'products.delete', label: 'Supprimer des produits' },
  ]},
  { label: 'Stock', description: 'Quantités disponibles et mouvements de stock.', permissions: [
    { key: 'stock.view', label: 'Voir les stocks' }, { key: 'stock.update', label: 'Modifier les stocks' },
  ]},
  { label: 'Marketing', description: 'Promotions, codes promo et contenu du storefront.', permissions: [
    { key: 'promotions.view', label: 'Voir les promotions' }, { key: 'promotions.manage', label: 'Créer / modifier les promotions' }, { key: 'content.view', label: 'Voir le contenu du site' }, { key: 'content.manage', label: 'Modifier accueil et bannières' },
  ]},
  { label: 'Livraison', description: 'Zones, tarifs et paramètres de livraison.', permissions: [
    { key: 'delivery.view', label: 'Voir les paramètres de livraison' }, { key: 'delivery.manage', label: 'Modifier zones et tarifs' },
  ]},
  { label: 'Administration', description: 'Paramètres sensibles et équipe.', permissions: [
    { key: 'settings.view', label: 'Voir les paramètres' }, { key: 'settings.manage', label: 'Modifier les paramètres' }, { key: 'staff.view', label: 'Voir les employés' }, { key: 'staff.manage', label: 'Créer employés et gérer permissions' },
  ]},
];

export const allPermissions = permissionGroups.flatMap(group => group.permissions.map(item => item.key));

export const roleTemplates: Record<string, PermissionKey[]> = {
  'Administrateur': allPermissions,
  'Responsable boutique': allPermissions.filter(p => !['staff.manage','settings.manage','products.delete'].includes(p)),
  'Ventes': ['dashboard.view','orders.view','orders.update','quotes.view','quotes.manage','products.view','stock.view'],
  'Stock': ['dashboard.view','orders.view','products.view','stock.view','stock.update'],
  'Marketing': ['dashboard.view','products.view','promotions.view','promotions.manage','content.view','content.manage','reports.view'],
};

export const roleCodeToLabel: Record<string, string> = {
  OWNER: 'Propriétaire', MANAGER: 'Responsable boutique', SALES: 'Ventes', STOCK: 'Stock', MARKETING: 'Marketing', CUSTOM: 'Personnalisé',
};
export const roleLabelToCode: Record<string, 'MANAGER'|'SALES'|'STOCK'|'MARKETING'|'CUSTOM'> = {
  'Responsable boutique': 'MANAGER', 'Ventes': 'SALES', 'Stock': 'STOCK', 'Marketing': 'MARKETING', 'Personnalisé': 'CUSTOM',
};
export function sanitizePermissions(values: unknown): PermissionKey[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((v): v is PermissionKey => typeof v === 'string' && (allPermissions as string[]).includes(v)))];
}
