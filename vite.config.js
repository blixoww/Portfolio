import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/*
 * Content-Security-Policy injectée uniquement au build : en développement, Vite
 * injecte des styles inline (HMR) qu'une CSP stricte bloquerait.
 */
const CSP = {
  'index.html': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests",
  'terminal.html': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'",
  '404.html': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'",
};

function contentSecurityPolicy() {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { filename }) {
        const policy = CSP[filename.split(/[\\/]/).pop()];
        if (!policy) throw new Error(`Aucune CSP définie pour ${filename}`);
        return [{
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: policy },
          injectTo: 'head-prepend',
        }];
      },
    },
  };
}

export default defineConfig({
  // Le site est servi par GitHub Pages sous https://blixoww.github.io/Portfolio/
  base: '/Portfolio/',
  plugins: [contentSecurityPolicy()],
  build: {
    target: 'es2022',
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        terminal: resolve(import.meta.dirname, 'terminal.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});
