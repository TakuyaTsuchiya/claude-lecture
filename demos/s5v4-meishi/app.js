(function () {
  'use strict';

  const STORAGE_KEY = 'meishi-cards';

  let cards = [];
  let currentId = null;   // 詳細表示中の名刺
  let editingId = null;   // フォームが編集モードのときセット（新規時はnull）

  // --- 永続化 ---
  function loadCards() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { cards = JSON.parse(raw); } catch (e) { cards = []; }
    } else {
      cards = seedCards();
      saveCards();
    }
  }

  function saveCards() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }

  function seedCards() {
    const now = new Date().toISOString();
    return [
      {
        id: uid(),
        name: '山田 太郎',
        company: '株式会社サンプル商事',
        title: '代表取締役',
        email: 'yamada@example.com',
        phone: '03-1234-5678',
        memo: '2026-04-10 経営セミナーで交換。AI活用に興味あり。',
        createdAt: now,
      },
      {
        id: uid(),
        name: '佐藤 花子',
        company: 'クラウドワークス株式会社',
        title: 'マーケティング部長',
        email: 'sato@example.com',
        phone: '090-1111-2222',
        memo: 'BtoBマーケ施策について来月打ち合わせ予定。',
        createdAt: now,
      },
      {
        id: uid(),
        name: '鈴木 次郎',
        company: 'テックスタートアップ合同会社',
        title: 'CTO',
        email: 'suzuki@example.com',
        phone: '080-3333-4444',
        memo: '共通の知人：山田さん経由で紹介。',
        createdAt: now,
      },
    ];
  }

  function uid() {
    return 'c-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  // --- 右ペインのモード切替 ---
  function showPane(mode) {
    document.querySelectorAll('.pane').forEach(p => p.classList.add('hidden'));
    document.getElementById('pane-' + mode).classList.remove('hidden');
  }

  // --- 左ペインレンダリング ---
  function renderList(keyword = '') {
    const list = document.getElementById('card-list');
    const empty = document.getElementById('empty-list');
    const kw = keyword.trim().toLowerCase();

    const filtered = cards
      .filter(c => {
        if (!kw) return true;
        return (
          c.name.toLowerCase().includes(kw) ||
          c.company.toLowerCase().includes(kw) ||
          (c.title || '').toLowerCase().includes(kw)
        );
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    list.innerHTML = '';
    filtered.forEach(c => list.appendChild(buildCardElement(c)));
    empty.classList.toggle('hidden', filtered.length !== 0);
  }

  function buildCardElement(c) {
    const el = document.createElement('div');
    const selected = c.id === currentId;
    el.className = 'card bg-white rounded-lg border p-4 flex gap-3 ' +
      (selected ? 'border-stone-900' : 'border-stone-200');
    el.dataset.id = c.id;
    el.innerHTML = `
      <div class="w-1 rounded" style="background:#c15f3c"></div>
      <div class="flex-1 min-w-0">
        <div class="text-base font-bold truncate">${escapeHtml(c.name)}</div>
        <div class="text-xs text-stone-700 truncate">${escapeHtml(c.company)}</div>
        <div class="text-xs text-stone-500 truncate">${escapeHtml(c.title || '')}</div>
      </div>
    `;
    el.addEventListener('click', () => openDetail(c.id));
    return el;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
  }

  // --- 詳細 ---
  function openDetail(id) {
    const c = cards.find(x => x.id === id);
    if (!c) return;
    currentId = id;
    document.getElementById('d-name').textContent = c.name;
    document.getElementById('d-company').textContent = c.company;
    document.getElementById('d-title').textContent = c.title || '';
    document.getElementById('d-email').textContent = c.email || '—';
    document.getElementById('d-phone').textContent = c.phone || '—';
    document.getElementById('d-memo').textContent = c.memo || '—';
    document.getElementById('d-created').textContent = formatDate(c.createdAt);
    showPane('detail');
    renderList(document.getElementById('search-input').value);
  }

  function formatDate(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // --- フォーム ---
  function openFormNew() {
    editingId = null;
    document.getElementById('form-title').textContent = '新規登録';
    document.getElementById('form').reset();
    showPane('form');
  }

  function openFormEdit(id) {
    const c = cards.find(x => x.id === id);
    if (!c) return;
    editingId = id;
    document.getElementById('form-title').textContent = '名刺を編集';
    const form = document.getElementById('form');
    form.name.value = c.name;
    form.company.value = c.company;
    form.title.value = c.title || '';
    form.email.value = c.email || '';
    form.phone.value = c.phone || '';
    form.memo.value = c.memo || '';
    showPane('form');
  }

  function cancelForm() {
    if (currentId) openDetail(currentId);
    else showPane('empty');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      company: form.company.value.trim(),
      title: form.title.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      memo: form.memo.value.trim(),
    };
    if (!data.name || !data.company) return;

    if (editingId) {
      const idx = cards.findIndex(x => x.id === editingId);
      if (idx >= 0) cards[idx] = { ...cards[idx], ...data };
      currentId = editingId;
    } else {
      const created = { id: uid(), ...data, createdAt: new Date().toISOString() };
      cards.push(created);
      currentId = created.id;
    }
    saveCards();
    renderList(document.getElementById('search-input').value);
    openDetail(currentId);
  }

  function deleteCurrent() {
    if (!currentId) return;
    if (!confirm('この名刺を削除します。よろしいですか？')) return;
    cards = cards.filter(x => x.id !== currentId);
    saveCards();
    currentId = null;
    renderList(document.getElementById('search-input').value);
    showPane('empty');
  }

  // --- 初期化 ---
  function init() {
    loadCards();
    renderList();
    showPane('empty');

    document.getElementById('search-input').addEventListener('input', e => {
      renderList(e.target.value);
    });
    document.getElementById('btn-new').addEventListener('click', openFormNew);
    document.getElementById('btn-edit').addEventListener('click', () => {
      if (currentId) openFormEdit(currentId);
    });
    document.getElementById('btn-delete').addEventListener('click', deleteCurrent);
    document.getElementById('btn-cancel').addEventListener('click', cancelForm);
    document.getElementById('form').addEventListener('submit', handleSubmit);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
