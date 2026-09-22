# MadStore2 V13 — Promotions + 3 modes de commande + factures

Cette version prolonge le Commerce Core V12 avec des promotions persistantes et un checkout adapté aux trois parcours MadStore2.

## 1. Promotions et codes promo réels

PostgreSQL/Prisma devient la source de vérité pour :
- campagnes automatiques (`Promotion`) ;
- remises en pourcentage ou montant fixe ;
- livraison offerte ;
- ciblage tous produits / catégorie / produit ;
- minimum de commande ;
- dates de début et de fin ;
- activation/désactivation ;
- codes promo (`PromoCode`) ;
- limite globale d'utilisation ;
- compteur d'utilisation ;
- historique de redemption lié à la commande.

Administration : `/admin/promotions`.

Le checkout ne fait jamais confiance à une réduction calculée dans le navigateur : `/api/store/quote` et `/api/store/orders` recalculent prix, promotions, code, livraison et stock côté serveur.

Codes de démonstration créés par le seed : `BIENVENUE10`, `MAD5000`, `LIVRAISON`.

## 2. Trois modes de commande

### Livraison + paiement à la livraison
`HOME_DELIVERY_COD`

Le client fournit ses coordonnées et l'adresse complète. MadStore2 organise l'envoi du livreur. Le paiement reste `PENDING` jusqu'à la remise ; le passage de la commande à `DELIVERED` le marque `PAID`.

### Retrait magasin
`STORE_PICKUP`

Le client fournit ses coordonnées, une date et une tranche horaire. Pas de frais de livraison. Le paiement est effectué au magasin au retrait. Le workflow passe directement de `READY` à `DELIVERED` (retrait effectué).

Les créneaux proposés par défaut sont 09–11 h, 11–13 h, 14–16 h et 16–18 h.

Configurer dans `.env` :
```
STORE_NAME="MadStore2"
STORE_ADDRESS="Adresse complète du magasin"
```

### Mobile Money
`MOBILE_MONEY`

Le client fournit les informations de livraison. La commande est créée et le stock réservé, mais `paymentStatus` reste `PENDING`. Aucun faux encaissement n'est simulé. Une API et son webhook pourront être branchés ultérieurement.

## 3. Facture/document personnalisé

Après validation, le client reçoit un lien privé de facture utilisant la référence + un token aléatoire :
`/commande/[reference]/facture?token=...`

Le document s'adapte au mode :
- paiement à la livraison : adresse et mention du règlement à la remise ;
- retrait : magasin, date, créneau et règlement au retrait ;
- Mobile Money : document pro forma avec paiement en attente.

Le document est optimisé pour impression / « Enregistrer en PDF ». L'admin retrouve aussi le lien depuis `/admin/commandes`.

## 4. Stock

Comme en V12, la création de commande réserve le stock dans une transaction `Serializable`. Annulation = libération. Livraison/retrait terminé = sortie physique du stock. Remboursement = retour en stock.

## Installation

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Pour une base déjà utilisée par une boutique réelle, préférer une migration Prisma versionnée plutôt que `db push`.

## À connecter plus tard

- API Mobile Money + webhook signé ;
- zones/tarifs de livraison administrables ;
- adresse réelle du magasin ;
- éventuellement créneaux de retrait administrables ;
- envoi automatique de facture par WhatsApp/e-mail.
