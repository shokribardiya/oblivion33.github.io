/* OBLIVION — site runtime. No frameworks, no build step. */

const BASE = document.body.dataset.base || './';

const STATUS_CLASS = {
  'active-development': 's-active',
  'research': 's-research',
  'in-progress': 's-research',
  'early': 's-research'
};

async function loadJSON(path){
  try{
    const res = await fetch(BASE + path, { cache: 'no-store' });
    if(!res.ok) throw new Error(res.status);
    return await res.json();
  }catch(err){
    console.warn('OBLIVION: could not load', path, err);
    return [];
  }
}

function el(html){
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/* ---------- ACTIVE SYSTEMS ---------- */
function renderSystems(systems){
  const grid = document.getElementById('systems-grid');
  if(!grid) return;
  grid.innerHTML = systems.map(s => `
    <a class="object-card" href="${BASE}products/${s.slug}/">
      <div class="object-top">
        <div>
          <div class="object-id">${s.id}</div>
          <h3 class="object-name">${s.name}</h3>
          <p class="object-cat">${s.category}</p>
        </div>
        <span class="status-chip ${STATUS_CLASS[s.status] || 's-core'}">${s.statusLabel}</span>
      </div>
      <p class="object-desc">${s.description}</p>
      <div class="object-meta">
        <span>${s.version}</span>
        <a href="${s.repository}" target="_blank" rel="noopener">repository</a>
        <a href="${BASE}${s.documentation}">docs</a>
      </div>
    </a>
  `).join('');
}

/* ---------- RESEARCH ---------- */
function renderResearch(items){
  const list = document.getElementById('research-list');
  if(!list) return;
  list.innerHTML = items.map(r => `
    <div class="entry">
      <div class="entry-date mono">${r.date}</div>
      <a class="entry-link" href="${BASE}research/papers/${r.id}/">
        <h3>${r.title}</h3>
        <p>${r.abstract}</p>
      </a>
      <span class="entry-tag">${r.category}</span>
    </div>
  `).join('');
}

/* ---------- ENGINEERING ---------- */
function renderEngineering(items){
  const list = document.getElementById('engineering-list');
  if(!list) return;
  list.innerHTML = items.map(a => `
    <div class="entry">
      <div class="entry-date mono">${a.date}</div>
      <a class="entry-link" href="${BASE}engineering/notes/${a.id}/">
        <h3>${a.title}</h3>
        <p>${a.summary}</p>
      </a>
      <span class="entry-tag">${a.category}</span>
    </div>
  `).join('');
}

/* ---------- RELEASES ---------- */
function renderReleases(releases){
  const wrap = document.getElementById('release-panel');
  if(!wrap || !releases.length) return;
  const r = releases[0];
  wrap.innerHTML = `
    <div class="release-version mono">${r.version}</div>
    <div class="release-info">
      <h3>${r.system} — ${r.date}</h3>
      <p>${r.summary}</p>
      <div class="release-highlights">
        ${r.highlights.map(h => `<span>${h}</span>`).join('')}
      </div>
    </div>
    <a class="btn btn-ghost" href="${BASE}releases/latest/">View release</a>
  `;
}

/* ---------- GLOBAL SEARCH ---------- */
let SEARCH_INDEX = [];

function buildSearchIndex(systems, research, engineering){
  SEARCH_INDEX = [
    ...systems.map(s => ({ group:'Products', name:s.name, desc:s.category, href:`${BASE}products/${s.slug}/` })),
    ...research.map(r => ({ group:'Research', name:r.title, desc:r.category, href:`${BASE}research/papers/${r.id}/` })),
    ...engineering.map(a => ({ group:'Engineering', name:a.title, desc:a.category, href:`${BASE}engineering/notes/${a.id}/` }))
  ];
}

function initSearch(){
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const openers = document.querySelectorAll('[data-open-search]');

  function open(){
    overlay.classList.add('open');
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 10);
  }
  function close(){ overlay.classList.remove('open'); }

  function renderResults(query){
    const q = query.trim().toLowerCase();
    const matches = q
      ? SEARCH_INDEX.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
      : SEARCH_INDEX.slice(0, 6);

    if(!matches.length){
      results.innerHTML = `<div class="search-empty">No matches for "${query}"</div>`;
      return;
    }
    const groups = {};
    matches.forEach(m => { (groups[m.group] ||= []).push(m); });

    results.innerHTML = Object.entries(groups).map(([group, items]) => `
      <div class="search-group-label">${group}</div>
      ${items.map(i => `
        <a class="search-result" href="${i.href}">
          <span class="r-name">${i.name}</span>
          <span class="r-desc">${i.desc}</span>
        </a>
      `).join('')}
    `).join('');
  }

  openers.forEach(btn => btn.addEventListener('click', open));
  overlay.addEventListener('click', e => { if(e.target === overlay) close(); });
  input.addEventListener('input', e => renderResults(e.target.value));

  document.addEventListener('keydown', e => {
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    }
    if(e.key === 'Escape') close();
  });
}

/* ---------- MOBILE DRAWER ---------- */
function initDrawer(){
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if(!toggle) return;
  function open(){ drawer.classList.add('open'); backdrop.classList.add('open'); }
  function close(){ drawer.classList.remove('open'); backdrop.classList.remove('open'); }
  toggle.addEventListener('click', open);
  backdrop.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ---------- STACK DIAGRAM ---------- */
function initStack(){
  document.querySelectorAll('.stack-node[data-href]').forEach(node => {
    node.addEventListener('click', () => { window.location.href = node.dataset.href; });
  });
}

/* ---------- BOOT ---------- */
(async function init(){
  initDrawer();
  initStack();

  const [systems, research, engineering, releases] = await Promise.all([
    loadJSON('data/systems.json'),
    loadJSON('data/research.json'),
    loadJSON('data/engineering.json'),
    loadJSON('data/releases.json')
  ]);

  renderSystems(systems);
  renderResearch(research);
  renderEngineering(engineering);
  renderReleases(releases);
  buildSearchIndex(systems, research, engineering);
  initSearch();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
