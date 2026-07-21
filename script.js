var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================================
// theme toggle (+ warp flash transition)
// ==========================================================
(function(){
  var toggle = document.getElementById('themeToggle');
  var root = document.documentElement;
  var flash = document.getElementById('warpFlash');

  toggle.addEventListener('click', function(e){
    var current = root.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';

    if (!reduceMotion){
      var rect = toggle.getBoundingClientRect();
      flash.style.setProperty('--flash-x', (rect.left + rect.width/2) + 'px');
      flash.style.setProperty('--flash-y', (rect.top + rect.height/2) + 'px');
      flash.classList.remove('flash');
      void flash.offsetWidth; // restart animation
      flash.classList.add('flash');
    }

    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  if (window.matchMedia){
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e){
      if (!localStorage.getItem('theme')){
        root.setAttribute('data-theme', e.matches ? 'light' : 'dark');
      }
    });
  }
})();

// ==========================================================
// starfield canvas (ambient background, both themes)
// ==========================================================
(function(){
  var canvas = document.getElementById('starfield');
  var ctx = canvas.getContext('2d');
  var stars = [];
  var w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    var count = Math.round((w * h) / 9000);
    stars = [];
    for (var i = 0; i < count; i++){
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  var t = 0;
  function draw(){
    ctx.clearRect(0, 0, w, h);
    var light = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.fillStyle = light ? '#3f8fd6' : '#c9bdfa';
    ctx.shadowColor = light ? 'rgba(255,255,255,.95)' : 'transparent';
    ctx.shadowBlur = light ? 5 : 0;
    for (var i = 0; i < stars.length; i++){
      var s = stars[i];
      var tw = s.base + Math.sin(t * s.speed * 60 + s.phase) * 0.35;
      ctx.globalAlpha = Math.max(0, Math.min(1, tw));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    t += 1;
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
  if (reduceMotion){
    // draw a single static frame, no animation loop
  }
})();

// ==========================================================
// trajectory rail — waypoint dots + scroll-synced ship marker
// ==========================================================
(function(){
  var rail = document.getElementById('rail');
  var ship = document.getElementById('railShip');
  var line = document.querySelector('.rail-line');

  var waypoints = [
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'research', label: 'Research' },
    { id: 'projects', label: 'Projects' },
    { id: 'industry', label: 'Experience' },
    { id: 'teaching', label: 'Teaching' },
    { id: 'skills', label: 'Skills' },
    { id: 'coursework', label: 'Coursework' },
    { id: 'contact', label: 'Contact' }
  ];

  var dots = waypoints.map(function(wp){
    var el = document.querySelector('#' + wp.id);
    var dot = document.createElement('button');
    dot.className = 'rail-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Jump to ' + wp.label);
    var label = document.createElement('span');
    label.className = 'rail-label';
    label.textContent = wp.label;
    dot.appendChild(label);
    dot.addEventListener('click', function(){
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
    rail.appendChild(dot);
    return { dot: dot, section: el, id: wp.id };
  });

  var trackTop = 70, trackBottom = 70;

  function layout(){
    var railH = rail.getBoundingClientRect().height;
    var trackH = railH - trackTop - trackBottom;
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    dots.forEach(function(d){
      var target = Math.max(0, d.section.offsetTop - 90);
      var frac = Math.min(1, target / maxScroll);
      d.dot.style.top = (trackTop + frac * trackH) + 'px';
    });
    updateShip();
  }

  function updateShip(){
    var railH = rail.getBoundingClientRect().height;
    var trackH = railH - trackTop - trackBottom;
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var frac = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    ship.style.top = (trackTop + frac * trackH) + 'px';
  }

  window.addEventListener('resize', layout);
  window.addEventListener('scroll', updateShip, { passive: true });
  window.addEventListener('load', layout);
  setTimeout(layout, 300);
  layout();

  // active-section highlighting
  if ('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var match = dots.find(function(d){ return d.section === entry.target; });
        if (!match) return;
        if (entry.isIntersecting){
          dots.forEach(function(d){ d.dot.classList.remove('active'); });
          match.dot.classList.add('active');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    dots.forEach(function(d){ observer.observe(d.section); });
  }
})();

// ==========================================================
// scroll-reveal for panels and hero content
// ==========================================================
(function(){
  var targets = document.querySelectorAll('.entry, .project-card, .contact-box, .skills-block.panel, .csv-wrap.panel, .hero .eyebrow, .hero h1, .hero .role, .hero .console, .hero-actions, .eyebrow, h2.section-title, .pill-row');
  if (reduceMotion || !('IntersectionObserver' in window)){
    return; // leave everything visible, no motion
  }
  targets.forEach(function(el){ el.classList.add('reveal'); });

  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 15% 0px' });

  targets.forEach(function(el){ revealObserver.observe(el); });
})();

// ==========================================================
// onboard computer — boot console typing
// ==========================================================
(function(){
  var el = document.getElementById('consoleBody');
  if (!el) return;

  var lines = [
    { type: 'input', text: 'query --field=name' },
    { type: 'output', html: '<span class="hl">MohammadHosein Shamsipoor</span>' },
    { type: 'input', text: 'query --field=focus' },
    { type: 'output', html: '<span class="out">multimodal representation learning &middot; generative &amp; latent-variable models &middot; representation compression</span>' },
    { type: 'input', text: 'query --field=base' },
    { type: 'output', html: '<span class="hl">Kerman, Iran</span>' },
    { type: 'input', text: 'query --field=status' },
    { type: 'output', html: '<span class="hl">open to MSc &amp; research opportunities</span>' }
  ];

  function escapeHtml(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  if (reduceMotion){
    var html = '';
    lines.forEach(function(l){
      html += l.type === 'input'
        ? '<div><span class="prompt">&gt; </span>' + escapeHtml(l.text) + '</div>'
        : '<div>' + l.html + '</div>';
    });
    el.innerHTML = html;
    return;
  }

  var lineIndex = 0, charIndex = 0, currentLineEl = null;

  function typeStep(){
    if (lineIndex >= lines.length){
      var cursor = document.createElement('span');
      cursor.className = 'cursor';
      el.appendChild(cursor);
      return;
    }
    var line = lines[lineIndex];

    if (line.type === 'output'){
      var div = document.createElement('div');
      div.innerHTML = line.html;
      el.appendChild(div);
      lineIndex++; charIndex = 0;
      setTimeout(typeStep, 240);
      return;
    }

    if (charIndex === 0){
      currentLineEl = document.createElement('div');
      var promptSpan = document.createElement('span');
      promptSpan.className = 'prompt';
      promptSpan.textContent = '> ';
      currentLineEl.appendChild(promptSpan);
      var textSpan = document.createElement('span');
      currentLineEl.appendChild(textSpan);
      el.appendChild(currentLineEl);
    }

    var textSpan = currentLineEl.querySelector('span:last-child');
    textSpan.textContent += line.text[charIndex];
    charIndex++;

    if (charIndex < line.text.length){
      setTimeout(typeStep, 24 + Math.random() * 28);
    } else {
      lineIndex++; charIndex = 0;
      setTimeout(typeStep, 280);
    }
  }
  typeStep();
})();

// ==========================================================
// mission clock — counts up from page load
// ==========================================================
(function(){
  var el = document.getElementById('missionClock');
  if (!el) return;
  var start = Date.now();
  function pad(n){ return String(n).padStart(2, '0'); }
  function tick(){
    var elapsed = Math.floor((Date.now() - start) / 1000);
    var hrs = Math.floor(elapsed / 3600);
    var mins = Math.floor((elapsed % 3600) / 60);
    var secs = elapsed % 60;
    el.textContent = 'T+' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
  }
  tick();
  setInterval(tick, 1000);
})();

// ==========================================================
// footer year
// ==========================================================
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();