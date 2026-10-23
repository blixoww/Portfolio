/* Point d'entrée de la page d'accueil. */

import { initThemeToggle } from './modules/theme.js';
import { initMobileMenu, initHeaderScroll, initActiveSection } from './modules/navigation.js';
import { initReveal } from './modules/reveal.js';
import { initKatakanaRain } from './modules/katakana-rain.js';

initThemeToggle();
initMobileMenu();
initHeaderScroll();
initActiveSection();
initReveal();
initKatakanaRain(document.getElementById('rain'));

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
