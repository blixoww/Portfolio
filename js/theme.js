/*
 * Appliqué avant le rendu pour éviter un flash de thème.
 * Mode Night City (sombre) par défaut ; le mode Arasaka (jaune) est un choix explicite mémorisé.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var theme = 'dark';
  try {
    if (localStorage.getItem('theme') === 'light') theme = 'light';
  } catch (e) { /* stockage indisponible (navigation privée, etc.) */ }
  root.setAttribute('data-theme', theme);
  root.classList.add('js');
})();
