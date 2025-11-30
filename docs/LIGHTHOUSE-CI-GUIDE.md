# 🚀 Lighthouse CI - Guide d'Utilisation

## 📝 Vue d'Ensemble

Lighthouse CI est configuré pour auditer automatiquement :
- **L'application Angular** (performance, accessibilité, SEO, best practices)
- **La documentation Compodoc** (accessibilité et qualité de la documentation)

---

## 📦 Installation

Lighthouse CI et ses dépendances sont déjà installés :

```json
{
  "devDependencies": {
    "@lhci/cli": "^0.15.1",
    "wait-on": "^8.0.1",
    "concurrently": "^8.2.2"
  }
}
```

---

## 🎯 Scripts Disponibles

### 1. Auditer l'Application Angular

```bash
# Lancer l'audit complet de l'app (3 runs)
npm run lighthouse:app
```

**Ce que ça fait :**
- Démarre automatiquement le serveur de développement Angular (port 4200)
- Attend que l'app soit prête
- Lance 3 audits Lighthouse
- Génère les rapports dans `.lighthouseci/`

**Seuils configurés :**
- ⚠️ Performance : ≥ 80%
- ❌ Accessibilité : ≥ 90% (bloquant)
- ⚠️ Best Practices : ≥ 90%
- ⚠️ SEO : ≥ 90%

---

### 2. Auditer la Documentation Compodoc

```bash
# Générer la doc puis auditer
npm run lighthouse:docs:build

# Auditer une doc déjà générée
npm run lighthouse:docs
```

**Ce que ça fait :**
- Génère la documentation Compodoc (si `lighthouse:docs:build`)
- Audite la documentation statique générée
- Lance 2 audits Lighthouse
- Génère les rapports dans `.lighthouseci-docs/`

**Seuils configurés :**
- ⚠️ Performance : ≥ 70%
- ❌ Accessibilité : ≥ 95% (bloquant, doc doit être accessible)
- ⚠️ Best Practices : ≥ 80%
- ⚠️ SEO : ≥ 80%

---

### 3. Lancer Compodoc + Lighthouse en Même Temps

```bash
# Auditer la doc en mode serveur live
npm run audit:docs
```

**Ce que ça fait :**
- Lance le serveur Compodoc (port 8080)
- Attend que le serveur soit prêt
- Lance l'audit Lighthouse sur la doc live
- Stoppe automatiquement après l'audit

---

### 4. Mode Développement Complet

```bash
# Lancer Compodoc + App Angular simultanément
npm run audit:docs+app
```

**Ce que ça fait :**
- Lance Compodoc (port 8080)
- Lance l'app Angular (port 4200)
- Utile pour développement/debug simultané

---

## 📊 Fichiers de Configuration

### `lighthouserc.json` - Configuration App Angular

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run start",
      "url": ["http://localhost:4200"],
      "startServerReadyPattern": "Angular Live Development Server is listening",
      "startServerReadyTimeout": 60000,
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": ".lighthouseci"
    }
  }
}
```

**Points clés :**
- ✅ **3 runs** pour moyenne fiable
- ✅ **Démarre automatiquement** l'app
- ✅ **Desktop preset** pour tests cohérents
- ✅ **Timeout 60s** pour démarrage Angular

---

### `lighthouserc.docs.json` - Configuration Compodoc

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 2,
      "staticDistDir": "./docs/compodoc",
      "url": ["http://localhost:8080/index.html"],
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.7 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.8 }],
        "categories:seo": ["warn", { "minScore": 0.8 }]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": ".lighthouseci-docs"
    }
  }
}
```

**Points clés :**
- ✅ **2 runs** suffisants pour doc statique
- ✅ **Sert dossier statique** (plus rapide)
- ✅ **Accessibilité 95%** (doc doit être exemplaire)
- ⚠️ **Seuils plus souples** pour performance (doc = contenu statique)

---

## 📈 Interpréter les Résultats

### Structure des Rapports

```
.lighthouseci/               # Rapports app Angular
├── lhr-*.html               # Rapports individuels HTML
├── lhr-*.json               # Données JSON
└── manifest.json            # Résumé des runs

.lighthouseci-docs/          # Rapports doc Compodoc
├── lhr-*.html
├── lhr-*.json
└── manifest.json
```

### Ouvrir les Rapports

```bash
# Ouvrir le dernier rapport app
open .lighthouseci/lhr-*.html

# Ouvrir le dernier rapport docs
open .lighthouseci-docs/lhr-*.html
```

### Métriques Clés

| Métrique                  | Bon       | Moyen     | Mauvais   |
|---------------------------|-----------|-----------|-----------|
| **Performance Score**     | ≥ 90      | 50-89     | < 50      |
| **Accessibility Score**   | 100       | 90-99     | < 90      |
| **Best Practices Score**  | ≥ 95      | 80-94     | < 80      |
| **SEO Score**             | ≥ 95      | 80-94     | < 80      |
| **First Contentful Paint**| < 1.8s    | 1.8-3s    | > 3s      |
| **Largest Contentful Paint**| < 2.5s  | 2.5-4s    | > 4s      |
| **Cumulative Layout Shift**| < 0.1    | 0.1-0.25  | > 0.25    |
| **Total Blocking Time**   | < 200ms   | 200-600ms | > 600ms   |

---

## 🔧 Personnalisation des Seuils

### Modifier les Seuils App (`lighthouserc.json`)

```json
{
  "assert": {
    "assertions": {
      // Augmenter le seuil de performance
      "categories:performance": ["error", { "minScore": 0.9 }],
      
      // Ajouter une métrique personnalisée
      "speed-index": ["warn", { "maxNumericValue": 3000 }],
      
      // Ajouter une vérification d'image
      "uses-optimized-images": "error"
    }
  }
}
```

### Modifier les Seuils Docs (`lighthouserc.docs.json`)

```json
{
  "assert": {
    "assertions": {
      // Forcer 100% accessibilité
      "categories:accessibility": ["error", { "minScore": 1.0 }],
      
      // Ajouter vérification HTTPS (si déployé)
      "is-on-https": "error"
    }
  }
}
```

---

## 🚀 Intégration CI/CD

### GitHub Actions (exemple)

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Run Lighthouse CI
        run: npm run lighthouse:app
      
      - name: Upload Lighthouse results
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-reports
          path: .lighthouseci
```

---

## 📋 Checklist Pré-Déploiement

Avant de déployer en production, vérifie :

### Application Angular

```bash
npm run lighthouse:app
```

- [ ] ✅ Performance ≥ 80%
- [ ] ✅ Accessibility ≥ 90%
- [ ] ✅ Best Practices ≥ 90%
- [ ] ✅ SEO ≥ 90%
- [ ] ✅ FCP < 2s
- [ ] ✅ LCP < 2.5s
- [ ] ✅ CLS < 0.1

### Documentation Compodoc

```bash
npm run lighthouse:docs:build
```

- [ ] ✅ Accessibility ≥ 95%
- [ ] ✅ Performance ≥ 70%
- [ ] ✅ Pas d'erreurs bloquantes
- [ ] ✅ Navigation accessible au clavier
- [ ] ✅ Contraste des couleurs suffisant

---

## 🔍 Debugging

### Le serveur ne démarre pas

```bash
# Vérifier que le port 4200 est libre
lsof -ti:4200 | xargs kill -9

# Relancer l'audit
npm run lighthouse:app
```

### Timeout après 60s

```bash
# Augmenter le timeout dans lighthouserc.json
{
  "collect": {
    "startServerReadyTimeout": 120000  // 2 minutes
  }
}
```

### Scores incohérents

```bash
# Augmenter le nombre de runs
{
  "collect": {
    "numberOfRuns": 5  // Plus de runs = moyenne plus fiable
  }
}
```

### Erreur "Port already in use"

```bash
# Tuer tous les processus Node
pkill -f node

# Ou spécifiquement
lsof -ti:4200 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

---

## 🎯 Best Practices

### 1. Auditer Régulièrement

- ✅ **Avant chaque PR** : `npm run lighthouse:app`
- ✅ **Après chaque feature** : Vérifier l'impact sur les métriques
- ✅ **Avant déploiement** : Audit complet

### 2. Surveiller les Régressions

```bash
# Comparer avec le dernier audit
diff .lighthouseci/manifest.json .lighthouseci.backup/manifest.json
```

### 3. Optimiser Progressivement

- 🎯 **Objectif 1** : Accessibility 100%
- 🎯 **Objectif 2** : Best Practices 100%
- 🎯 **Objectif 3** : SEO 100%
- 🎯 **Objectif 4** : Performance ≥ 90%

### 4. Documenter les Changements

Après chaque optimisation :
1. Noter le score avant/après
2. Documenter l'action effectuée
3. Vérifier les effets de bord

---

## 📊 Exemples de Problèmes Courants

### Accessibilité

| Problème                      | Solution                                    |
|-------------------------------|---------------------------------------------|
| Contraste insuffisant         | Utiliser variables CSS Bootstrap           |
| Pas de labels sur inputs      | Ajouter `<label>` ou `aria-label`          |
| Images sans alt               | Ajouter attribut `alt` sur toutes images   |
| Navigation clavier impossible | Vérifier `tabindex` et focus styles        |

### Performance

| Problème                    | Solution                                      |
|-----------------------------|-----------------------------------------------|
| Bundle trop gros            | Lazy loading des routes Angular              |
| Images non optimisées       | Utiliser `NgOptimizedImage`                  |
| Pas de cache HTTP           | Configurer les headers (nginx, CloudFront)   |
| Blocking scripts            | Déférer les scripts non critiques           |

### SEO

| Problème                  | Solution                                        |
|---------------------------|-------------------------------------------------|
| Pas de meta description   | Ajouter `<meta name="description">`            |
| Titres manquants          | Ajouter `<title>` dynamique via Angular        |
| Liens sans texte          | Ajouter texte descriptif ou `aria-label`       |

---

## 🚀 Prochaines Étapes

1. **Lancer un premier audit** : `npm run lighthouse:app`
2. **Analyser les rapports** : Ouvrir les fichiers `.html` générés
3. **Prioriser les corrections** : Commencer par l'accessibilité
4. **Automatiser dans CI** : Ajouter GitHub Actions
5. **Monitorer dans le temps** : Garder historique des scores

---

## 📚 Ressources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Performance Guide](https://angular.dev/best-practices/runtime-performance)

---

**Configuration par : Agent Architecte Nx** 🎯
**Date : 30 Novembre 2025**

