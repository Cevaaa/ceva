/* Minimal progressive enhancement: language toggle, mobile nav,
   active-section highlight, footer year. */
(function () {
  'use strict';

  // ---------- Footer year ----------
  var y = document.getElementById('year');
  if (y) { y.textContent = String(new Date().getFullYear()); }

  // ---------- Language toggle ----------
  var STORE_KEY = 'xc-lang';
  var TITLES = {
    en: 'Xiao Chen | Tsinghua SIGS',
    zh: '陈骁 | 清华大学深圳国际研究生院'
  };

  function applyLang(lang) {
    var nodes = document.querySelectorAll('[data-' + lang + ']');
    for (var i = 0; i < nodes.length; i++) {
      var val = nodes[i].getAttribute('data-' + lang);
      if (val !== null) { nodes[i].innerHTML = val; }
    }
    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : 'en';
    document.title = TITLES[lang] || TITLES.en;
    document.body.classList.toggle('is-zh', lang === 'zh');

    var btns = document.querySelectorAll('.lang button');
    for (var j = 0; j < btns.length; j++) {
      var on = btns[j].getAttribute('data-lang') === lang;
      btns[j].classList.toggle('on', on);
      btns[j].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* ignore */ }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* ignore */ }
  if (!saved) {
    saved = (navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
  }
  if (saved === 'zh') { applyLang('zh'); }

  var langBox = document.querySelector('.lang');
  if (langBox) {
    langBox.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-lang]') : null;
      if (b) { applyLang(b.getAttribute('data-lang')); }
    });
  }

  // ---------- Mobile navigation ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Active section highlight ----------
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav a[href^="#"]')
  );
  if (!navLinks.length || !('IntersectionObserver' in window)) { return; }

  var map = {};
  navLinks.forEach(function (a) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) { map[el.id] = a; }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = map[entry.target.id];
      if (!link) { return; }
      if (entry.isIntersecting) {
        navLinks.forEach(function (a) { a.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });

  Object.keys(map).forEach(function (id) {
    observer.observe(document.getElementById(id));
  });
})();
