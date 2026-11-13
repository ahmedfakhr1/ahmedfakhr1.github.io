(function () {
  var root = document.documentElement;

  // Theme: follows the device until the visitor chooses.
  var btn = document.querySelector('.theme');
  var mq = matchMedia('(prefers-color-scheme: dark)');
  function current() { return root.dataset.theme || (mq.matches ? 'dark' : 'light'); }
  function label() {
    if (!btn) return;
    var next = current() === 'dark' ? 'Light' : 'Dark';
    btn.querySelector('span').textContent = next;
    btn.setAttribute('aria-label', 'Switch to ' + next.toLowerCase() + ' theme');
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });
    mq.addEventListener('change', label);
    label();
  }

  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The signature writes itself once on arrival, and again when pointed at.
  var sig = document.querySelector('a.sig');
  if (sig && !calm) {
    var play = function () { sig.classList.remove('on'); void sig.getBoundingClientRect(); sig.classList.add('on'); };
    var seen = false;
    try { seen = sessionStorage.getItem('sig') === '1'; sessionStorage.setItem('sig', '1'); } catch (e) {}
    if (!seen) play();
    sig.addEventListener('mouseenter', play);
  }

  // Sections ease in as they are reached.
  var els = document.querySelectorAll('.rv');
  if (calm || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  els.forEach(function (el) { io.observe(el); });
})();
