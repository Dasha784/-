/*
  Lueur Candles – интерактивный демо-магазин
  Возможности: поиск, фильтры, сортировка, избранное, корзина, купоны, быстрый просмотр, адаптив и тёмная тема
*/

const currency = '₽';
const freeShippingThreshold = 5000;
const shippingFlat = 350;

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ${currency}`;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function debounce(fn, ms = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), ms);
  };
}

function createElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function showToast(message, type = 'default') {
  const root = document.getElementById('toastRoot');
  const base = type === 'success'
    ? 'bg-emerald-600 text-white'
    : type === 'error'
      ? 'bg-rose-600 text-white'
      : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900';
  const el = createElement(`
    <div class="pointer-events-auto mb-3 w-full max-w-xs rounded-xl ${base} px-4 py-3 text-sm shadow-soft">
      ${message}
    </div>
  `);
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(4px)';
    setTimeout(() => el.remove(), 200);
  }, 2000);
}

const products = [
  {
    id: 'amber-noir',
    name: 'Amber Noir',
    family: 'Древесный',
    notes: ['амбра', 'сандал', 'мускус'],
    description: 'Тёплая древесная композиция с бархатной амброй и насыщенным сандалом.',
    price: 2990,
    salePrice: 2590,
    rating: 4.8,
    isNew: true,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1602872029481-3bbf5b02cd1d?q=80&w=1200&auto=format&fit=crop',
    colors: ['#4b5563', '#27272a']
  },
  {
    id: 'jardin-blanc',
    name: 'Jardin Blanc',
    family: 'Флоральный',
    notes: ['жасмин', 'белые цветы', 'мускус'],
    description: 'Элегантный букет белых цветов с воздушным звучанием жасмина.',
    price: 2790,
    rating: 4.6,
    isNew: false,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155223168f?q=80&w=1200&auto=format&fit=crop',
    colors: ['#e5e7eb', '#f5f5f4']
  },
  {
    id: 'citrus-sol',
    name: 'Citrus Sol',
    family: 'Цитрусовый',
    notes: ['бергамот', 'апельсин', 'лимон'],
    description: 'Искристый цитрус для бодрого утра и ясной головы.',
    price: 1990,
    rating: 4.5,
    isNew: false,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1541971875078-2c4e3e1d4c9e?q=80&w=1200&auto=format&fit=crop',
    colors: ['#fde68a', '#fef3c7']
  },
  {
    id: 'vanille-creme',
    name: 'Vanille Crème',
    family: 'Гурманский',
    notes: ['ваниль', 'сливки', 'карамель'],
    description: 'Уютная сладость ванили и топлёных сливок в мягком ореоле.',
    price: 2390,
    rating: 4.7,
    isNew: false,
    isLimited: true,
    image: 'https://images.unsplash.com/photo-1556229143-0009f31a5fa3?q=80&w=1200&auto=format&fit=crop',
    colors: ['#f5e6cc', '#ede9fe']
  },
  {
    id: 'brume-marine',
    name: 'Brume Marine',
    family: 'Свежий',
    notes: ['морская соль', 'лилия', 'озон'],
    description: 'Прозрачная свежесть моря и белых цветов для чистого пространства.',
    price: 2190,
    rating: 4.4,
    isNew: false,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1498843053639-170ff2122f35?q=80&w=1200&auto=format&fit=crop',
    colors: ['#bfdbfe', '#e0e7ff']
  },
  {
    id: 'figue-lumiere',
    name: 'Figue Lumière',
    family: 'Флоральный',
    notes: ['инжир', 'зелень', 'белый кедр'],
    description: 'Солнечный инжир с зелёными листьями и сухим кедром.',
    price: 2690,
    rating: 4.6,
    isNew: true,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1548372293-2d6dbd0e0f47?q=80&w=1200&auto=format&fit=crop',
    colors: ['#fde68a', '#bbf7d0']
  },
  {
    id: 'matcha-thé',
    name: 'Matcha Thé',
    family: 'Свежий',
    notes: ['матча', 'вербена', 'мох'],
    description: 'Сдержанный зелёный аромат для сосредоточенности и баланса.',
    price: 2290,
    rating: 4.3,
    isNew: false,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop',
    colors: ['#bbf7d0', '#dcfce7']
  },
  {
    id: 'santal-soir',
    name: 'Santal Soir',
    family: 'Древесный',
    notes: ['сандал', 'кардамон', 'кожа'],
    description: 'Интимный и обволакивающий, с тёплыми специями и мягкой кожей.',
    price: 3190,
    rating: 4.9,
    isNew: false,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1544273677-c433136021ea?q=80&w=1200&auto=format&fit=crop',
    colors: ['#44403c', '#78716c']
  },
  {
    id: 'lavande-rêve',
    name: 'Lavande Rêve',
    family: 'Флоральный',
    notes: ['лаванда', 'ирис', 'тонка'],
    description: 'Французская лаванда с пудровым ирисом и бобами тонка.',
    price: 2090,
    rating: 4.4,
    isNew: false,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop',
    colors: ['#ddd6fe', '#e9d5ff']
  },
  {
    id: 'pamplemousse',
    name: 'Pamplemousse',
    family: 'Цитрусовый',
    notes: ['грейпфрут', 'лайм', 'петитгрейн'],
    description: 'Сочные горькие цитрусы — бодро и звонко.',
    price: 1890,
    rating: 4.2,
    isNew: true,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1543771862-16b21088cafe?q=80&w=1200&auto=format&fit=crop',
    colors: ['#fed7aa', '#fef3c7']
  },
  {
    id: 'cafe-latte',
    name: 'Café Latte',
    family: 'Гурманский',
    notes: ['кофе', 'сливки', 'пралине'],
    description: 'Кремовый кофе с нотами пралине и пудры какао.',
    price: 2490,
    rating: 4.5,
    isNew: false,
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?q=80&w=1200&auto=format&fit=crop',
    colors: ['#f5deb3', '#fde68a']
  },
  {
    id: 'patchouli-muse',
    name: 'Patchouli Muse',
    family: 'Древесный',
    notes: ['пачули', 'амбра', 'ладан'],
    description: 'Плотный и медитативный, с темными смолами и амброй.',
    price: 3390,
    rating: 4.7,
    isNew: false,
    isLimited: true,
    image: 'https://images.unsplash.com/photo-1542665952-375abf4b8d3e?q=80&w=1200&auto=format&fit=crop',
    colors: ['#0f172a', '#334155']
  }
];

const allFamilies = ['Флоральный','Древесный','Цитрусовый','Гурманский','Свежий'];
const allTags = Array.from(new Set(products.flatMap(p => p.notes)));

const state = {
  query: '',
  selectedFamilies: new Set(),
  selectedTags: new Set(),
  priceMin: 0,
  priceMax: 4990,
  onlySale: false,
  onlyFavorites: false,
  sort: 'popular',
  favorites: new Set(readFromStorage('favorites', [])),
  cart: readFromStorage('cart', []),
  coupon: readFromStorage('coupon', ''),
  theme: localStorage.getItem('theme') || 'system'
};

function persistState() {
  saveToStorage('favorites', Array.from(state.favorites));
  saveToStorage('cart', state.cart);
  saveToStorage('coupon', state.coupon);
}

function productMatchesFilters(product) {
  if (state.selectedFamilies.size && !state.selectedFamilies.has(product.family)) return false;
  if (state.selectedTags.size && !product.notes.some(n => state.selectedTags.has(n))) return false;
  const price = product.salePrice ?? product.price;
  if (price < state.priceMin) return false;
  if (price > state.priceMax) return false;
  if (state.onlySale && !product.salePrice) return false;
  if (state.onlyFavorites && !state.favorites.has(product.id)) return false;
  if (state.query) {
    const q = state.query.toLowerCase();
    const hay = [product.name, product.family, ...product.notes, product.description].join(' ').toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function sortProducts(list) {
  switch (state.sort) {
    case 'priceAsc':
      return list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case 'priceDesc':
      return list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating);
    case 'new':
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case 'popular':
    default:
      return list.sort((a, b) => (b.rating + (b.salePrice ? 0.1 : 0)) - (a.rating + (a.salePrice ? 0.1 : 0)));
  }
}

function renderChips(container, items, selectedSet, onToggle) {
  container.innerHTML = '';
  items.forEach(item => {
    const active = selectedSet.has(item);
    const chip = createElement(`
      <button type="button" data-value="${item}" class="inline-flex items-center gap-2 rounded-xl border ${active ? 'border-zinc-800 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900' : 'border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'} px-3 py-1.5 text-xs shadow-sm">
        ${item}
      </button>
    `);
    chip.addEventListener('click', () => onToggle(item));
    container.appendChild(chip);
  });
}

function renderActiveFilters() {
  const root = document.getElementById('activeFilters');
  const chips = [];
  state.selectedFamilies.forEach(f => chips.push(['family', f]));
  state.selectedTags.forEach(t => chips.push(['tag', t]));
  if (state.onlySale) chips.push(['flag', 'со скидкой']);
  if (state.onlyFavorites) chips.push(['flag', 'избранное']);
  if (state.query) chips.push(['query', `“${state.query}”`] );
  if (state.priceMin > 0 || state.priceMax < 4990) chips.push(['price', `${state.priceMin}–${state.priceMax}`]);

  if (!chips.length) {
    root.classList.add('hidden');
    root.innerHTML = '';
    return;
  }
  root.classList.remove('hidden');
  root.innerHTML = '';
  chips.forEach(([type, value]) => {
    const pill = createElement(`
      <span class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span class="text-zinc-600 dark:text-zinc-300">${value}</span>
        <button aria-label="Убрать" class="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
      </span>
    `);
    pill.querySelector('button').addEventListener('click', () => {
      if (type === 'family') state.selectedFamilies.delete(value);
      if (type === 'tag') state.selectedTags.delete(value);
      if (type === 'flag' && value === 'со скидкой') state.onlySale = false;
      if (type === 'flag' && value === 'избранное') state.onlyFavorites = false;
      if (type === 'query') state.query = '';
      if (type === 'price') {
        state.priceMin = 0; state.priceMax = 4990;
        syncPriceInputs();
      }
      update();
    });
    root.appendChild(pill);
  });
}

function renderGrid() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('emptyState');
  let list = products.filter(productMatchesFilters);
  list = sortProducts(list);

  if (!list.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  grid.innerHTML = '';
  list.forEach(p => grid.appendChild(renderCard(p)));
}

function renderCard(p) {
  const priceCurrent = p.salePrice ?? p.price;
  const priceOld = p.salePrice ? `<span class="text-xs text-zinc-400 line-through">${formatPrice(p.price)}</span>` : '';
  const fav = state.favorites.has(p.id);
  const stars = renderStars(p.rating);
  const el = createElement(`
    <article class="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-sm transition hover:shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
      <div class="relative">
        <div class="aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(120deg,${p.colors?.[0] ?? '#e5e7eb'},${p.colors?.[1] ?? '#f5f5f4'})]"></div>
        <img src="${p.image}" alt="${p.name}" class="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" loading="lazy" referrerpolicy="no-referrer"/>
        <div class="absolute left-3 top-3 flex gap-2">
          ${p.isNew ? '<span class="rounded-full bg-zinc-900/90 px-2 py-0.5 text-xs font-semibold text-white dark:bg-white/90 dark:text-zinc-900">New</span>' : ''}
          ${p.isLimited ? '<span class="rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-semibold text-white">Limited</span>' : ''}
          ${p.salePrice ? '<span class="rounded-full bg-rose-600/90 px-2 py-0.5 text-xs font-semibold text-white">-'+ Math.round((1-p.salePrice/p.price)*100) +'%</span>' : ''}
        </div>
        <button class="absolute right-3 top-3 rounded-xl bg-white/90 p-2 text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-200" data-fav="${p.id}" aria-label="В избранное">
          ${fav ? heartFullSvg() : heartSvg()}
        </button>
      </div>
      <div class="p-4">
        <h3 class="font-semibold">${p.name}</h3>
        <p class="mt-1 text-xs text-zinc-500">${p.family} • ${stars}</p>
        <div class="mt-3 flex items-center justify-between">
          <div class="flex items-baseline gap-2">
            <span class="text-base font-bold">${formatPrice(priceCurrent)}</span>
            ${priceOld}
          </div>
          <div class="flex items-center gap-2">
            <button class="hidden rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-zinc-50 sm:inline-flex dark:border-zinc-800 dark:bg-zinc-900" data-quick="${p.id}">Быстрый просмотр</button>
            <button class="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900" data-add="${p.id}">В корзину</button>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-1.5">
          ${p.notes.slice(0,3).map(n => `<span class=\"rounded-lg bg-zinc-100 px-2 py-1 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300\">${n}</span>`).join('')}
        </div>
      </div>
    </article>
  `);
  el.querySelector(`[data-fav="${p.id}"]`).addEventListener('click', () => toggleFavorite(p.id));
  el.querySelector(`[data-add="${p.id}"]`).addEventListener('click', () => addToCart(p.id));
  const quick = el.querySelector(`[data-quick="${p.id}"]`);
  if (quick) quick.addEventListener('click', () => openQuickView(p.id));
  return el;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return `${'★'.repeat(full)}${half ? '☆' : ''}${'☆'.repeat(empty)} <span class="text-[11px] text-zinc-400">${rating.toFixed(1)}</span>`;
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
  persistState();
  update();
}

function syncPriceInputs() {
  const min = document.getElementById('priceMin');
  const max = document.getElementById('priceMax');
  const range = document.getElementById('priceRange');
  const minD = document.getElementById('priceMinD');
  const maxD = document.getElementById('priceMaxD');
  const rangeD = document.getElementById('priceRangeD');
  if (min) min.value = state.priceMin || '';
  if (max) max.value = (state.priceMax && state.priceMax < 4990) ? String(state.priceMax) : '';
  if (range) range.value = state.priceMax;
  if (minD) minD.value = state.priceMin || '';
  if (maxD) maxD.value = (state.priceMax && state.priceMax < 4990) ? String(state.priceMax) : '';
  if (rangeD) rangeD.value = state.priceMax;
}

function attachFilters() {
  const familiesRoot = document.getElementById('filterFamilies');
  const tagsRoot = document.getElementById('filterTags');
  const onlySale = document.getElementById('onlySale');
  const onlyFav = document.getElementById('onlyFavorites');
  renderChips(familiesRoot, allFamilies, state.selectedFamilies, (value) => { toggleSet(state.selectedFamilies, value); update(); });
  renderChips(tagsRoot, allTags, state.selectedTags, (value) => { toggleSet(state.selectedTags, value); update(); });

  const familiesDrawer = document.getElementById('filterFamiliesDrawer');
  const tagsDrawer = document.getElementById('filterTagsDrawer');
  if (familiesDrawer) renderChips(familiesDrawer, allFamilies, state.selectedFamilies, (v) => { toggleSet(state.selectedFamilies, v); });
  if (tagsDrawer) renderChips(tagsDrawer, allTags, state.selectedTags, (v) => { toggleSet(state.selectedTags, v); });

  onlySale.addEventListener('change', (e) => { state.onlySale = e.target.checked; update(); syncDrawerChecks(); });
  onlyFav.addEventListener('change', (e) => { state.onlyFavorites = e.target.checked; update(); syncDrawerChecks(); });

  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const priceRange = document.getElementById('priceRange');
  priceMin.addEventListener('input', () => { state.priceMin = clamp(Number(priceMin.value || 0), 0, 4990); update(); syncPriceInputs(); });
  priceMax.addEventListener('input', () => { state.priceMax = clamp(Number(priceMax.value || 4990), 0, 4990); update(); syncPriceInputs(); });
  priceRange.addEventListener('input', () => { state.priceMax = Number(priceRange.value); update(); syncPriceInputs(); });

  const openFilters = document.getElementById('openFilters');
  const openFilters2 = document.getElementById('openFilters2');
  openFilters.addEventListener('click', openFiltersDrawer);
  openFilters2.addEventListener('click', openFiltersDrawer);

  document.getElementById('resetFilters').addEventListener('click', () => { resetFilters(); update(); });
  document.getElementById('emptyReset').addEventListener('click', () => { resetFilters(); update(); });

  const d = {
    min: document.getElementById('priceMinD'),
    max: document.getElementById('priceMaxD'),
    range: document.getElementById('priceRangeD'),
    sale: document.getElementById('onlySaleD'),
    fav: document.getElementById('onlyFavoritesD'),
    apply: document.getElementById('applyFiltersD'),
    reset: document.getElementById('resetFiltersD')
  };
  d.min.addEventListener('input', () => state.priceMin = clamp(Number(d.min.value || 0), 0, 4990));
  d.max.addEventListener('input', () => state.priceMax = clamp(Number(d.max.value || 4990), 0, 4990));
  d.range.addEventListener('input', () => state.priceMax = Number(d.range.value));
  d.sale.addEventListener('change', () => state.onlySale = d.sale.checked);
  d.fav.addEventListener('change', () => state.onlyFavorites = d.fav.checked);
  d.apply.addEventListener('click', () => { closeDrawer('filtersDrawer'); update(); });
  d.reset.addEventListener('click', () => { resetFilters(); syncDrawerChecks(); syncPriceInputs(); update(); });

  syncPriceInputs();
  syncDrawerChecks();
}

function toggleSet(set, value) {
  if (set.has(value)) set.delete(value); else set.add(value);
  persistState();
}

function resetFilters() {
  state.query = '';
  state.selectedFamilies.clear();
  state.selectedTags.clear();
  state.priceMin = 0;
  state.priceMax = 4990;
  state.onlySale = false;
  state.onlyFavorites = false;
  document.getElementById('searchInput').value = '';
  document.getElementById('onlySale').checked = false;
  document.getElementById('onlyFavorites').checked = false;
  syncPriceInputs();
}

function syncDrawerChecks() {
  const saleD = document.getElementById('onlySaleD');
  const favD = document.getElementById('onlyFavoritesD');
  if (saleD) saleD.checked = state.onlySale;
  if (favD) favD.checked = state.onlyFavorites;
}

function attachSearchAndSort() {
  const search = document.getElementById('searchInput');
  search.addEventListener('input', debounce(() => { state.query = search.value.trim(); update(); }, 250));

  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; update(); });
}

function openQuickView(id) {
  const product = products.find(p => p.id === id);
  const root = document.getElementById('quickView');
  const panel = root.querySelector('[data-panel]');
  const body = document.getElementById('quickViewBody');
  body.innerHTML = '';
  const priceCurrent = product.salePrice ?? product.price;
  const stars = renderStars(product.rating);
  body.appendChild(createElement(`
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="overflow-hidden rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div class="aspect-[4/3] w-full bg-[linear-gradient(120deg,${product.colors?.[0] ?? '#e5e7eb'},${product.colors?.[1] ?? '#f5f5f4'})]"></div>
        <img src="${product.image}" alt="${product.name}" class="-mt-[66.66%] h-full w-full object-cover"/>
      </div>
      <div class="flex flex-col">
        <h3 class="text-2xl font-bold">${product.name}</h3>
        <p class="mt-1 text-sm text-zinc-500">${product.family} • ${stars}</p>
        <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-400">${product.description}</p>
        <div class="mt-5 flex items-baseline gap-3">
          <span class="text-xl font-extrabold">${formatPrice(priceCurrent)}</span>
          ${product.salePrice ? `<span class="text-sm text-zinc-400 line-through">${formatPrice(product.price)}</span>` : ''}
        </div>
        <div class="mt-5">
          <p class="mb-2 text-xs uppercase tracking-wide text-zinc-500">Основные ноты</p>
          <div class="flex flex-wrap gap-2">${product.notes.map(n => `<span class=\"rounded-lg bg-zinc-100 px-2 py-1 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300\">${n}</span>`).join('')}</div>
        </div>
        <div class="mt-6 flex flex-wrap gap-3">
          <button class="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900" data-add-qv="${product.id}">В корзину</button>
          <button class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm dark:border-zinc-800 dark:bg-zinc-900" data-fav-qv="${product.id}">${state.favorites.has(product.id) ? 'Убрать из избранного' : 'В избранное'}</button>
        </div>
      </div>
    </div>
  `));

  body.querySelector(`[data-add-qv="${id}"]`).addEventListener('click', () => addToCart(id));
  body.querySelector(`[data-fav-qv="${id}"]`).addEventListener('click', () => { toggleFavorite(id); openQuickView(id); });

  openDrawer('quickView');

  root.querySelector('[data-close]').onclick = () => closeDrawer('quickView');
  root.querySelector('[data-overlay]').onclick = () => closeDrawer('quickView');
}

function openDrawer(id) {
  const root = document.getElementById(id);
  const panel = root.querySelector('[data-panel]');
  root.classList.remove('hidden');
  requestAnimationFrame(() => {
    panel.style.transform = 'translateX(0)';
  });
}

function closeDrawer(id) {
  const root = document.getElementById(id);
  const panel = root.querySelector('[data-panel]');
  panel.style.transform = id === 'filtersDrawer' ? 'translateX(-100%)' : 'translateX(100%)';
  setTimeout(() => root.classList.add('hidden'), 200);
}

function openFiltersDrawer() { openDrawer('filtersDrawer'); }

function attachDrawers() {
  const cart = document.getElementById('cartDrawer');
  cart.querySelector('[data-close]').onclick = () => closeDrawer('cartDrawer');
  cart.querySelector('[data-overlay]').onclick = () => closeDrawer('cartDrawer');

  const qv = document.getElementById('quickView');
  qv.querySelector('[data-close]').onclick = () => closeDrawer('quickView');
  qv.querySelector('[data-overlay]').onclick = () => closeDrawer('quickView');

  const fd = document.getElementById('filtersDrawer');
  fd.querySelector('[data-close]').onclick = () => closeDrawer('filtersDrawer');
  fd.querySelector('[data-overlay]').onclick = () => closeDrawer('filtersDrawer');
}

function attachHeaderActions() {
  document.getElementById('openCart').addEventListener('click', () => openDrawer('cartDrawer'));
  document.getElementById('openFavorites').addEventListener('click', () => {
    state.onlyFavorites = !state.onlyFavorites;
    const onlyFav = document.getElementById('onlyFavorites');
    onlyFav.checked = state.onlyFavorites;
    syncDrawerChecks();
    update();
  });
  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    const mode = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
  });
}

function addToCart(id, qty = 1) {
  const item = state.cart.find(it => it.id === id);
  if (item) item.qty += qty; else state.cart.push({ id, qty });
  persistState();
  renderCart();
  showToast('Добавлено в корзину', 'success');
}

function removeFromCart(id) {
  state.cart = state.cart.filter(it => it.id !== id);
  persistState();
  renderCart();
}

function changeQty(id, delta) {
  const it = state.cart.find(i => i.id === id);
  if (!it) return;
  it.qty = clamp(it.qty + delta, 1, 99);
  persistState();
  renderCart();
}

function computeCartTotals() {
  const items = state.cart.map(it => {
    const p = products.find(pp => pp.id === it.id);
    const price = p.salePrice ?? p.price;
    return { ...it, product: p, price, line: price * it.qty };
  });
  const subtotal = Math.round(items.reduce((s, it) => s + it.line, 0));
  let discount = 0;
  const code = (state.coupon || '').trim().toUpperCase();
  if (code === 'AROMA10') discount = Math.round(subtotal * 0.1);
  if (code === 'WELCOME15' && subtotal >= 6000) discount = Math.round(subtotal * 0.15);
  const afterDiscount = Math.max(subtotal - discount, 0);
  const shipping = afterDiscount >= freeShippingThreshold || afterDiscount === 0 ? 0 : shippingFlat;
  const total = afterDiscount + shipping;
  return { items, subtotal, discount, shipping, total };
}

function renderCart() {
  const root = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const { items, subtotal, discount, shipping, total } = computeCartTotals();

  if (!items.length) {
    root.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    root.innerHTML = '';
    items.forEach(({ id, product, price, qty, line }) => {
      root.appendChild(createElement(`
        <div class="flex items-center gap-4 rounded-2xl border border-zinc-200/60 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div class="h-16 w-16 overflow-hidden rounded-xl bg-[linear-gradient(120deg,${product.colors?.[0] ?? '#e5e7eb'},${product.colors?.[1] ?? '#f5f5f4'})]"></div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">${product.name}</p>
            <p class="text-xs text-zinc-500">${formatPrice(price)} × ${qty}</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-900" data-dec="${id}">−</button>
            <span class="w-6 text-center text-sm">${qty}</span>
            <button class="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-900" data-inc="${id}">+</button>
          </div>
          <div class="w-20 text-right text-sm font-semibold">${formatPrice(line)}</div>
          <button class="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Удалить" data-del="${id}">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 18 18 6M6 6l12 12"/></svg>
          </button>
        </div>
      `));
    });
  }

  document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('cartDiscount').textContent = `−${formatPrice(discount)}`;
  document.getElementById('cartShipping').textContent = shipping === 0 ? 'Бесплатно' : formatPrice(shipping);
  document.getElementById('cartTotal').textContent = formatPrice(total);

  const left = Math.max(freeShippingThreshold - (subtotal - discount), 0);
  const msg = document.getElementById('freeShippingMsg');
  msg.textContent = left === 0 ? 'Бесплатная доставка' : `Добавьте ещё на ${formatPrice(left)} для бесплатной доставки`;

  root.querySelectorAll('[data-inc]').forEach(btn => btn.addEventListener('click', () => changeQty(btn.getAttribute('data-inc'), 1)));
  root.querySelectorAll('[data-dec]').forEach(btn => btn.addEventListener('click', () => changeQty(btn.getAttribute('data-dec'), -1)));
  root.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-del'))));

  const couponInput = document.getElementById('couponInput');
  couponInput.value = state.coupon || '';
}

function attachCartActions() {
  document.getElementById('openCart').addEventListener('click', renderCart);
  document.getElementById('applyCoupon').addEventListener('click', () => {
    const input = document.getElementById('couponInput');
    const code = input.value.trim().toUpperCase();
    if (!code) { state.coupon = ''; persistState(); renderCart(); return; }
    if (['AROMA10', 'WELCOME15'].includes(code)) {
      state.coupon = code;
      persistState();
      renderCart();
      showToast('Купон применён', 'success');
    } else {
      showToast('Неверный купон', 'error');
    }
  });
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    const { total } = computeCartTotals();
    if (total === 0) return;
    showToast('Заказ оформлен! Спасибо 💛', 'success');
    state.cart = [];
    state.coupon = '';
    persistState();
    renderCart();
    closeDrawer('cartDrawer');
  });
}

function heartSvg() {
  return '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.727-.715-1.6-2.377-2.727-4.313-2.727C5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>';
}

function heartFullSvg() {
  return '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.173 25.18 25.18 0 01-4.244-2.62C4.688 16.6 2.25 13.897 2.25 10.5A5.25 5.25 0 017.5 5.25a5.23 5.23 0 014.5 2.474 5.23 5.23 0 014.5-2.474 5.25 5.25 0 015.25 5.25c0 3.397-2.438 6.1-4.739 7.603a25.177 25.177 0 01-4.244 2.62 15.247 15.247 0 01-.383.173l-.022.01-.007.003a.75.75 0 01-.614 0z"/></svg>';
}

function attachHero() {
  const heroAdd = document.getElementById('heroAdd');
  heroAdd.addEventListener('click', () => addToCart('amber-noir'));
}

function attachNewsletter() {
  const form = document.getElementById('newsletterForm');
  const msg = document.getElementById('newsletterMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.classList.remove('hidden');
    showToast('Подписка оформлена', 'success');
    setTimeout(() => msg.classList.add('hidden'), 4000);
    form.reset();
  });
}

function syncFilterChips() {
  const familiesRoot = document.getElementById('filterFamilies');
  const tagsRoot = document.getElementById('filterTags');
  renderChips(familiesRoot, allFamilies, state.selectedFamilies, (value) => { toggleSet(state.selectedFamilies, value); update(); });
  renderChips(tagsRoot, allTags, state.selectedTags, (value) => { toggleSet(state.selectedTags, value); update(); });

  const familiesDrawer = document.getElementById('filterFamiliesDrawer');
  const tagsDrawer = document.getElementById('filterTagsDrawer');
  if (familiesDrawer) renderChips(familiesDrawer, allFamilies, state.selectedFamilies, (v) => { toggleSet(state.selectedFamilies, v); });
  if (tagsDrawer) renderChips(tagsDrawer, allTags, state.selectedTags, (v) => { toggleSet(state.selectedTags, v); });
}

function update() {
  syncFilterChips();
  renderActiveFilters();
  renderGrid();
  persistState();
}

function init() {
  attachHeaderActions();
  attachHero();
  attachFilters();
  attachSearchAndSort();
  attachDrawers();
  attachCartActions();
  attachNewsletter();
  renderCart();
  update();
}

document.addEventListener('DOMContentLoaded', init);