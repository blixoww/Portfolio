# Portfolio

Site accessible via ce lien : [blixoww.github.io/Portfolio](https://blixoww.github.io/Portfolio/)

## Stack

- HTML / CSS / JavaScript vanilla : aucun framework, aucune dépendance à l'exécution
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

- **Content-Security-Policy** stricte (`script-src 'self'`, `style-src 'self'`, pas d'inline, `object-src 'none'`)
- Aucune saisie utilisateur n'est injectée en HTML : rendu exclusivement via `textContent` / `createElement`
- Liens externes en `rel="noopener noreferrer"`, `Referrer-Policy` restrictive
- CI : actions **épinglées par SHA**, permissions `GITHUB_TOKEN` minimales par job,
  `persist-credentials: false`, mises à jour suivies par Dependabot
- Contrôles automatiques : validation HTML (`html-validate`) et interdiction de
  `innerHTML` / `eval` / handlers et styles inline

## Structure

```
index.html        page principale
terminal.html     terminal interactif
404.html          page d'erreur
css/main.css      styles (design tokens, thèmes, responsive)
css/terminal.css  styles du terminal
js/theme.js       application du thème avant rendu (anti-flash)
js/main.js        navigation, thème, pluie de katakana, animations
assets/fonts/     polices woff2 + licences OFL
js/terminal.js    logique du terminal
```

## Développement local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
npx html-validate@11.16.2 index.html terminal.html 404.html
```

## Licence

MIT
