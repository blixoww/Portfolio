# Portfolio

Site accessible via ce lien : [blixoww.github.io/Portfolio](https://blixoww.github.io/Portfolio/)

## Stack

- HTML / CSS / JavaScript vanilla en **modules ES**, buildé avec **[Vite](https://vite.dev/)** :
  serveur de dev avec rechargement à chaud, bundle minifié, fichiers à empreinte de contenu
  (cache long terme). Aucun framework, aucune dépendance à l'exécution
- Direction artistique inspirée de l'interface de **Cyberpunk 2077** : panneaux à coins
  coupés, effet glitch, scanlines et pluie de katakana animée en `<canvas>`
- Deux thèmes : **Night City** (sombre, par défaut) et **Arasaka** (jaune), choix mémorisé
- Polices auto-hébergées (Orbitron, Rajdhani, Share Tech Mono — SIL OFL) et icônes SVG
  inline : **zéro requête vers un tiers**, aucun traceur
- Animations économes (≈ 20 i/s, pause quand l'onglet est masqué) et respect de
  `prefers-reduced-motion`
- Terminal interactif caché (`terminal.html`, lien `>_ terminal` en pied de page)
- Déploiement GitHub Pages via GitHub Actions

## Sécurité

- **Content-Security-Policy** stricte (`script-src 'self'`, `style-src 'self'`, pas d'inline, `object-src 'none'`),
  injectée par un plugin Vite au build (le serveur de dev a besoin de styles inline pour le HMR)
- Aucune saisie utilisateur n'est injectée en HTML : rendu exclusivement via `textContent` / `createElement`
- Liens externes en `rel="noopener noreferrer"`, `Referrer-Policy` restrictive
- CI : actions **épinglées par SHA**, permissions `GITHUB_TOKEN` minimales par job,
  `persist-credentials: false`, mises à jour suivies par Dependabot
- Dépendances de dev épinglées à la version exacte, `npm ci --ignore-scripts` et `npm audit` en CI
- Contrôles automatiques : validation HTML (`html-validate`), interdiction de
  `innerHTML` / `eval` / handlers et styles inline, présence de la CSP dans le build

## Structure

```
index.html, terminal.html, 404.html   pages (points d'entrée Vite)
vite.config.js                        base /Portfolio/, multi-pages, plugin CSP
src/
  main.js                             point d'entrée de la page d'accueil
  terminal.js                         logique du terminal
  modules/                            thème, navigation, apparition, pluie de katakana
  styles/                             main.css (tokens, thèmes, responsive), terminal.css
  assets/fonts/                       polices woff2 + licences OFL
public/                               copié tel quel : favicon, manifest, sitemap,
                                      theme-init.js (thème appliqué avant rendu, anti-flash)
```

## Développement local

Prérequis : Node.js 22.12 ou plus récent.

```bash
npm ci            # installe les dépendances (versions verrouillées)
npm run dev       # serveur de dev : http://localhost:5173/Portfolio/
npm run build     # build de production dans dist/
npm run preview   # sert le build localement
npm run check     # validation HTML + build
```

## Licence

MIT
