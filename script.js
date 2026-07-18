// ==========================================================
// theme toggle
// ==========================================================
(function(){
  var toggle = document.getElementById('themeToggle');
  var root = document.documentElement;

  toggle.addEventListener('click', function(){
    var current = root.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // keep in sync with OS-level changes if the user hasn't chosen manually
  if (window.matchMedia){
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e){
      if (!localStorage.getItem('theme')){
        root.setAttribute('data-theme', e.matches ? 'light' : 'dark');
      }
    });
  }
})();

// ==========================================================
// mobile sidebar
// ==========================================================
(function(){
  var menuBtn = document.getElementById('menuBtn');
  var sidebar = document.getElementById('sidebar');
  var backdrop = document.getElementById('backdrop');

  function closeMenu(){
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  function openMenu(){
    sidebar.classList.add('open');
    backdrop.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  menuBtn.addEventListener('click', function(){
    sidebar.classList.contains('open') ? closeMenu() : openMenu();
  });
  backdrop.addEventListener('click', closeMenu);
  sidebar.querySelectorAll('.nav-link').forEach(function(link){
    link.addEventListener('click', closeMenu);
  });
})();

// ==========================================================
// scroll-spy: highlight the current section's file in the sidebar
// ==========================================================
(function(){
  var links = Array.from(document.querySelectorAll('.nav-link'));
  var sections = links
    .map(function(l){ return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var link = links.find(function(l){ return l.getAttribute('href') === '#' + entry.target.id; });
      if (!link) return;
      if (entry.isIntersecting){
        links.forEach(function(l){ l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

  sections.forEach(function(s){ observer.observe(s); });
})();

// ==========================================================
// hero terminal — typed REPL-style intro
// ==========================================================
(function(){
  var el = document.getElementById('terminalBody');
  if (!el) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Each line: prompt text (typed) + optional pre-built HTML output shown instantly after.
  var lines = [
    { type: 'input', text: 'from career import Researcher' },
    { type: 'input', text: 'me = Researcher()' },
    { type: 'input', text: 'me.focus' },
    { type: 'output', html: '<span class="out">[</span><span class="str">\'multimodal representation learning\'</span><span class="out">, </span><span class="str">\'generative &amp; latent-variable models\'</span><span class="out">, </span><span class="str">\'representation compression\'</span><span class="out">]</span>' },
    { type: 'input', text: 'me.based_in' },
    { type: 'output', html: '<span class="str">\'Kerman, Iran\'</span>' },
    { type: 'input', text: 'me.status' },
    { type: 'output', html: '<span class="str">\'open to MSc &amp; research opportunities\'</span>' }
  ];

  function renderStatic(){
    var html = '';
    lines.forEach(function(l){
      if (l.type === 'input'){
        html += '<div><span class="prompt">&gt;&gt;&gt; </span>' + escapeHtml(l.text) + '</div>';
      } else {
        html += '<div>' + l.html + '</div>';
      }
    });
    el.innerHTML = html;
  }

  function escapeHtml(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  if (reduceMotion){
    renderStatic();
    return;
  }

  var lineIndex = 0, charIndex = 0;
  var currentLineEl = null;

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
      lineIndex++;
      charIndex = 0;
      setTimeout(typeStep, 220);
      return;
    }

    if (charIndex === 0){
      currentLineEl = document.createElement('div');
      var promptSpan = document.createElement('span');
      promptSpan.className = 'prompt';
      promptSpan.textContent = '>>> ';
      currentLineEl.appendChild(promptSpan);
      var textSpan = document.createElement('span');
      currentLineEl.appendChild(textSpan);
      el.appendChild(currentLineEl);
    }

    var textSpan = currentLineEl.querySelector('span:last-child');
    textSpan.textContent += line.text[charIndex];
    charIndex++;

    if (charIndex < line.text.length){
      setTimeout(typeStep, 26 + Math.random() * 30);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeStep, 260);
    }
  }

  typeStep();
})();

// ==========================================================
// footer year
// ==========================================================
document.getElementById('year').textContent = new Date().getFullYear();
