# 🚀 Guide complet : Tester Stripe en local

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration initiale](#configuration-initiale)
3. [Mise en place du webhook avec ngrok](#mise-en-place-du-webhook-avec-ngrok)
4. [Test du flux de paiement](#test-du-flux-de-paiement)
5. [Débogage](#débogage)
6. [Passage en production](#passage-en-production)

---

## 🔧 Prérequis

### 1. Compte Stripe

- Créer un compte sur https://stripe.com
- Activer le mode "Test"

### 2. Outils nécessaires

```bash
# Installer ngrok (exposition localhost à internet)
brew install ngrok

# Vérifier l'installation
ngrok version
```

---

## ⚙️ Configuration initiale

### 1. Récupérer les clés Stripe

#### Dans le Dashboard Stripe (mode Test)

1. Aller sur https://dashboard.stripe.com/test/apikeys
2. Copier :
    - **Publishable key** (commence par `pk_test_`)
    - **Secret key** (commence par `sk_test_`)

#### Créer les produits et prix

1. Aller sur https://dashboard.stripe.com/test/products
2. Créer un produit "Abonnement Premium"
3. Créer deux prix :
    - Prix mensuel (ex: 9.90€/mois)
    - Prix annuel (ex: 90€/an)
4. Copier les **Price ID** (commence par `price_`)

### 2. Configurer les variables d'environnement

Créer/modifier `.env.local` à la racine du projet :

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRO_MONTHLY=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRO_YEARLY=price_xxxxxxxxxxxxx

# Webhook (sera mis à jour avec ngrok)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Créer la table dans Supabase

Exécuter ce SQL dans l'éditeur SQL de Supabase :

```sql
CREATE TABLE app_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_app_subscriptions_user_id ON app_subscriptions(user_id);
CREATE INDEX idx_app_subscriptions_stripe_subscription_id ON app_subscriptions(stripe_subscription_id);

-- RLS (Row Level Security)
ALTER TABLE app_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON app_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🌐 Mise en place du webhook avec ngrok

### Pourquoi ngrok ?

**Problème** : Stripe ne peut pas envoyer de webhooks à `localhost` directement.

**Solution** : ngrok crée un tunnel sécurisé qui expose votre `localhost:3000` sur internet via une URL publique.

### Étapes détaillées

#### 1. Lancer ngrok

Dans un **nouveau terminal** (Terminal 1) :

```bash
ngrok http 3000
```

**Résultat attendu** :

```
ngrok

Session Status                online
Forwarding                    https://abc123-def456.ngrok-free.app -> http://localhost:3000

Connections                   0
```

⚠️ **Important** :

- Copie l'URL `https://abc123-def456.ngrok-free.app`
- **Cette URL change à chaque redémarrage de ngrok**
- Garde ce terminal ouvert pendant tous tes tests

#### 2. Configurer le webhook sur Stripe

1. **Aller sur** : https://dashboard.stripe.com/test/webhooks
2. **Cliquer** : "Add endpoint"
3. **URL de l'endpoint** : `https://abc123-def456.ngrok-free.app/api/webhook`
    - ⚠️ Remplace `abc123-def456` par ton URL ngrok
    - ⚠️ N'oublie pas `/api/webhook` à la fin !
4. **Description** : "Local development webhook"
5. **Événements à écouter** :
    - Cliquer sur "Select events"
    - Chercher et cocher :
        - ✅ `checkout.session.completed`
        - ✅ `customer.subscription.updated`
        - ✅ `customer.subscription.deleted`
        - ✅ `invoice.paid` (optionnel)
        - ✅ `invoice.payment_failed` (optionnel)
6. **Cliquer** : "Add endpoint"

#### 3. Récupérer le Signing Secret

Après avoir créé l'endpoint :

1. Cliquer sur l'endpoint que tu viens de créer
2. Cliquer sur "Reveal" dans la section "Signing secret"
3. Copier le secret (commence par `whsec_`)
4. Le coller dans `.env.local` :

```env
STRIPE_WEBHOOK_SECRET=whsec_le_secret_copié_ici
```

#### 4. Redémarrer Next.js

**Important** : Next.js doit redémarrer pour charger la nouvelle variable d'environnement.

Dans le terminal Next.js (Terminal 2) :

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

#### 5. Vérifier que tout fonctionne

Dans un terminal ou navigateur, tester :

```bash
curl https://ton-url-ngrok.ngrok-free.app/api/webhook
```

**Résultat attendu** : `Webhook endpoint is working!`

---

## 🧪 Test du flux de paiement

### Configuration des terminaux

Tu dois avoir **2 terminaux ouverts** :

```
Terminal 1 : ngrok http 3000                    (Tunnel ngrok)
Terminal 2 : npm run dev                        (Serveur Next.js)
```

### Étapes de test

#### 1. Naviguer vers la page de billing

```
http://localhost:3000/billing
```

#### 2. Cliquer sur "Choisir ce plan"

Tu seras redirigé vers la page de paiement Stripe hébergée.

#### 3. Utiliser les cartes de test Stripe

| Carte                 | Expiration | CVC | Résultat                      |
| --------------------- | ---------- | --- | ----------------------------- |
| `4242 4242 4242 4242` | 12/34      | 123 | ✅ Succès                     |
| `4000 0000 0000 0002` | 12/34      | 123 | ❌ Échec (carte refusée)      |
| `4000 0027 6000 3184` | 12/34      | 123 | 🔐 Authentification 3D Secure |

#### 4. Compléter le paiement

Après avoir entré les informations, valider le paiement.

#### 5. Vérifier les logs

##### Terminal Next.js (Terminal 2)

Tu devrais voir :

```
🚀 ========================================
🚀 Webhook POST appelé à 2025-01-15T10:30:45.123Z
🚀 ========================================
🎯 Webhook reçu: checkout.session.completed
✅ checkout.session.completed détecté
📦 Session: {...}
🔑 Metadata: { supabase_user_id: '...' }
👤 Supabase User ID: 4735e168-...
💾 Tentative d'insertion dans Supabase: {...}
✅ Abonnement enregistré avec succès!
```

##### Terminal ngrok (Terminal 1)

Tu devrais voir :

```
HTTP Requests
-------------
POST /api/webhook    200 OK
```

##### Dashboard Stripe

1. Aller sur https://dashboard.stripe.com/test/webhooks
2. Cliquer sur ton endpoint
3. Onglet "Logs"
4. Tu devrais voir `checkout.session.completed` avec statut **200**

#### 6. Vérifier la base de données

Dans Supabase :

1. Aller sur "Table Editor"
2. Ouvrir la table `app_subscriptions`
3. Tu devrais voir une nouvelle ligne avec :
    - `user_id` : ton ID utilisateur
    - `status` : `active`
    - `stripe_subscription_id` : commence par `sub_`

#### 7. Tester les fonctionnalités premium

- Aller sur un devis finalisé
- Le bouton "Convertir en facture" devrait maintenant être actif (vert)
- Tester la conversion

---

## 🐛 Débogage

### Problème : Webhook ne reçoit rien

**Symptôme** : Pas de log `🚀 Webhook POST appelé` dans Next.js

**Solutions** :

1. **Vérifier ngrok**

    ```bash
    curl https://ton-url-ngrok.ngrok-free.app/api/webhook
    ```

    Si ça ne fonctionne pas → ngrok n'est pas lancé ou l'URL est incorrecte

2. **Vérifier l'URL dans Stripe**
    - Dashboard Stripe → Webhooks → ton endpoint
    - L'URL doit être `https://xxx.ngrok-free.app/api/webhook`
    - **PAS** `http://localhost:3000/api/webhook`

3. **Vérifier le middleware**
    - Ouvrir `src/middleware.ts`
    - Vérifier que `/api/webhook` est bien exclu

4. **Redémarrer Next.js**
    - Après tout changement de `.env.local`
    - Arrêter (Ctrl+C) et relancer `npm run dev`

### Problème : Webhook retourne 401/403

**Symptôme** : Dashboard Stripe montre une erreur 401 ou 403

**Solution** : Vérifier que le middleware n'intercepte pas le webhook

Dans `src/middleware.ts` :

```typescript
export async function middleware(request: NextRequest) {
    // Exclure les webhooks
    if (request.nextUrl.pathname.startsWith('/api/webhook')) {
        return NextResponse.next()
    }
    // ... reste du middleware
}
```

### Problème : Erreur "Invalid signature"

**Symptôme** : Log `Erreur de signature` dans Next.js

**Causes** :

1. Le `STRIPE_WEBHOOK_SECRET` dans `.env.local` ne correspond pas au secret du webhook Stripe
2. Next.js n'a pas été redémarré après modification du `.env.local`

**Solution** :

1. Aller sur Dashboard Stripe → Webhooks → ton endpoint
2. Copier le **Signing secret**
3. Le mettre dans `.env.local` sous `STRIPE_WEBHOOK_SECRET`
4. **Redémarrer** Next.js

### Problème : Erreur "Pas de supabase_user_id dans metadata"

**Symptôme** : Log `❌ Pas de supabase_user_id dans metadata`

**Cause** : Les metadata ne sont pas passées correctement lors de la création de la session checkout

**Vérifier** dans `src/app/api/checkout/create/route.ts` :

```typescript
const session = await stripe.checkout.sessions.create({
    // ...
    subscription_data: {
        metadata: { supabase_user_id: supabaseUserId }, // ← Doit être présent
    },
})
```

### Problème : Rien ne s'enregistre dans Supabase

**Symptôme** : Webhook arrive bien (200) mais table vide

**Solutions** :

1. **Vérifier le SUPABASE_SERVICE_ROLE_KEY**
    - Dans `.env.local`, vérifier que `SUPABASE_SERVICE_ROLE_KEY` est défini
    - C'est la clé "service_role" (pas "anon")
    - Trouver dans Supabase → Settings → API

2. **Vérifier les RLS (Row Level Security)**
    - Les webhooks utilisent la clé service_role qui bypass les RLS
    - Mais vérifier quand même dans Supabase → Table Editor → app_subscriptions

3. **Tester l'insertion manuellement**
    - Dans la console du navigateur (F12) :
    ```javascript
    fetch('/api/test-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'ton-user-id' }),
    })
        .then((r) => r.json())
        .then(console.log)
    ```

---

## 🚀 Passage en production

### 1. Passer en mode Live sur Stripe

1. Activer le compte en production sur Stripe
2. Récupérer les nouvelles clés (mode Live) :
    - `STRIPE_SECRET_KEY` → commence par `sk_live_`
    - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → commence par `pk_live_`
3. Créer les **mêmes produits et prix** en mode Live
4. Récupérer les nouveaux **Price ID**

### 2. Configurer le webhook en production

1. **Aller sur** : https://dashboard.stripe.com/webhooks (mode Live)
2. **Cliquer** : "Add endpoint"
3. **URL de l'endpoint** : `https://ton-domaine.com/api/webhook`
4. **Événements** : Mêmes événements qu'en test
5. **Récupérer** le Signing secret (différent du test !)

### 3. Mettre à jour les variables de production

Dans ton hébergeur (Vercel, Railway, etc.), ajouter :

```env
# Stripe PRODUCTION
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRO_MONTHLY=price_xxxxxxxxxxxxx  # Prix LIVE
NEXT_PUBLIC_STRIPE_PRO_YEARLY=price_xxxxxxxxxxxxx   # Prix LIVE
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx           # Secret LIVE

# App
NEXT_PUBLIC_APP_URL=https://ton-domaine.com
```

### 4. Tester en production

1. Faire un paiement **réel** (tu seras débité !)
2. Vérifier les logs du webhook dans Stripe Dashboard (Live mode)
3. Vérifier la table `app_subscriptions` en production
4. **Annuler** immédiatement l'abonnement si c'est juste un test

---

## 📝 Checklist complète

### Configuration locale (une fois)

- [ ] Installer ngrok
- [ ] Créer compte Stripe et activer mode Test
- [ ] Créer produits et prix dans Stripe
- [ ] Créer table `app_subscriptions` dans Supabase
- [ ] Configurer `.env.local`

### Avant chaque session de développement

- [ ] Terminal 1 : `ngrok http 3000`
- [ ] Copier l'URL ngrok
- [ ] Mettre à jour le webhook sur Stripe Dashboard
- [ ] Copier le nouveau Signing secret
- [ ] Mettre à jour `STRIPE_WEBHOOK_SECRET` dans `.env.local`
- [ ] Terminal 2 : Redémarrer Next.js (`npm run dev`)
- [ ] Tester : `curl https://xxx.ngrok-free.app/api/webhook`

### Après chaque paiement test

- [ ] Vérifier les logs Next.js
- [ ] Vérifier les logs ngrok
- [ ] Vérifier les logs Stripe Dashboard
- [ ] Vérifier la table Supabase

### Avant la production

- [ ] Passer en mode Live sur Stripe
- [ ] Créer les produits/prix en mode Live
- [ ] Configurer le webhook en production
- [ ] Mettre à jour toutes les variables d'environnement
- [ ] Tester avec un vrai paiement (petit montant)

---

## 🎯 Commandes utiles

```bash
# Démarrer ngrok
ngrok http 3000

# Tester le webhook localement
curl http://localhost:3000/api/webhook

# Tester le webhook via ngrok
curl https://ton-url.ngrok-free.app/api/webhook

# Voir les logs ngrok en temps réel
# Ouvrir dans le navigateur : http://localhost:4040

# Redémarrer Next.js proprement
# Ctrl+C puis
npm run dev
```

---

## 🔗 Liens utiles

- **Stripe Dashboard Test** : https://dashboard.stripe.com/test/dashboard
- **Stripe Webhooks** : https://dashboard.stripe.com/test/webhooks
- **Cartes de test** : https://stripe.com/docs/testing
- **Ngrok Dashboard** : https://dashboard.ngrok.com
- **Docs Stripe Webhooks** : https://stripe.com/docs/webhooks

---

## 💡 Astuces

### Utiliser ngrok gratuitement sans limite de temps

Crée un compte sur https://dashboard.ngrok.com et obtiens un authtoken :

```bash
ngrok config add-authtoken TON_TOKEN
```

Ensuite tu pourras utiliser des domaines fixes :

```bash
ngrok http 3000 --domain=ton-sous-domaine.ngrok-free.app
```

### Voir les requêtes ngrok en détail

Ouvre http://localhost:4040 dans ton navigateur pendant que ngrok tourne.
Tu verras toutes les requêtes qui passent par le tunnel avec leurs détails complets.

### Garder l'URL ngrok pour plusieurs sessions

Avec un compte gratuit, tu peux avoir une URL fixe :

- Tu n'auras plus besoin de reconfigurer le webhook à chaque fois
- Plus pratique pour le développement

---

## 🆘 Support

Si tu as des problèmes :

1. **Vérifier les logs** dans cet ordre :
    - Terminal Next.js
    - Terminal ngrok
    - Dashboard Stripe → Webhooks → Logs
    - Console navigateur (F12)

2. **Checklist rapide** :
    - [ ] ngrok tourne ?
    - [ ] Next.js tourne ?
    - [ ] `.env.local` à jour ?
    - [ ] Next.js redémarré après modif `.env.local` ?
    - [ ] URL webhook correcte dans Stripe ?
    - [ ] Signing secret correct ?

3. **Tester les composants individuellement** :
    - `curl https://xxx.ngrok-free.app/api/webhook` → ngrok + Next.js
    - Dashboard Stripe → Webhooks → "Send test webhook" → Stripe → Next.js
    - Paiement complet → Flux complet

---

**Créé le** : 15 janvier 2025  
**Version** : 1.0  
**Projet** : EasInvoice v2
