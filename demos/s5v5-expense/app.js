(function () {
  'use strict';

  const STORAGE_KEY = 'expense-records';

  let records = [];
  let currentId = null;
  let editingId = null;

  // --- 永続化 ---
  function loadRecords() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { records = JSON.parse(raw); } catch (e) { records = []; }
    } else {
      records = seedRecords();
      saveRecords();
    }
  }

  function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function seedRecords() {
    const now = new Date().toISOString();
    return [
      { id: uid(), date: '2026-04-20', category: '交通費', amount: 1280, memo: '顧客訪問 渋谷→新宿 往復', status: 'pending', createdAt: now },
      { id: uid(), date: '2026-04-18', category: '会議費', amount: 4500, memo: '外部ミーティング後のカフェ代', status: 'pending', createdAt: now },
      { id: uid(), date: '2026-04-15', category: '接待費', amount: 18600, memo: '取引先との会食（3名）', status: 'settled', createdAt: now },
      { id: uid(), date: '2026-04-10', category: '消耗品', amount: 3200, memo: '事務所の文具補充', status: 'settled', createdAt: now },
      { id: uid(), date: '2026-04-05', category: '通信費', amount: 7800, memo: 'モバイルルーター月額', status: 'settled', createdAt: now },
    ];
  }

  function uid() {
    return 'e-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  // --- 右ペインのモード切替 ---
  function showPane(mode) {
    document.querySelectorAll('.pane').forEach(p => p.classList.add('hidden'));
    document.getElementById('pane-' + mode).classList.remove('hidden');
  }

  // --- サマリ ---
  function renderSummary() {
    const total = records.reduce((sum, r) => sum + (r.amount || 0), 0);
    const pending = records.filter(r => r.status === 'pending').length;
    const settled = records.filter(r => r.status === 'settled').length;
    document.getElementById('sum-total').textContent = formatYen(total);
    document.getElementById('sum-pending').textContent = pending;
    document.getElementById('sum-settled').textContent = settled;
  }

  // --- 左ペインレンダリング ---
  function renderList(keyword = '') {
    const list = document.getElementById('card-list');
    const empty = document.getElementById('empty-list');
    const kw = keyword.trim().toLowerCase();

    const filtered = records
      .filter(r => {
        if (!kw) return true;
        return (
          (r.memo || '').toLowerCase().includes(kw) ||
          r.category.toLowerCase().includes(kw)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    list.innerHTML = '';
    filtered.forEach(r => list.appendChild(buildCardElement(r)));
    empty.classList.toggle('hidden', filtered.length !== 0);
  }

  function buildCardElement(r) {
    const el = document.createElement('div');
    const selected = r.id === currentId;
    el.className = 'card bg-white rounded-lg border p-4 flex gap-3 ' +
      (selected ? 'border-stone-900' : 'border-stone-200');
    el.dataset.id = r.id;
    const badgeClass = r.status === 'settled' ? 'badge-settled' : 'badge-pending';
    const badgeText = r.status === 'settled' ? '精算済' : '申請中';
    el.innerHTML = `
      <div class="w-1 rounded" style="background:#c15f3c"></div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <div class="text-xs text-stone-500">${escapeHtml(r.date)}</div>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="text-lg font-bold truncate">${formatYen(r.amount)}</div>
        <div class="text-xs text-stone-600 truncate">${escapeHtml(r.category)}${r.memo ? ' / ' + escapeHtml(r.memo) : ''}</div>
      </div>
    `;
    el.addEventListener('click', () => openDetail(r.id));
    return el;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
  }

  function formatYen(n) {
    return '¥' + Number(n || 0).toLocaleString('ja-JP');
  }

  // --- 詳細 ---
  function openDetail(id) {
    const r = records.find(x => x.id === id);
    if (!r) return;
    currentId = id;
    document.getElementById('d-amount').textContent = formatYen(r.amount);
    document.getElementById('d-category').textContent = r.category;
    document.getElementById('d-date').textContent = r.date;
    const badge = document.getElementById('d-status');
    const badgeClass = r.status === 'settled' ? 'badge-settled' : 'badge-pending';
    const badgeText = r.status === 'settled' ? '精算済' : '申請中';
    badge.className = 'badge ' + badgeClass;
    badge.textContent = badgeText;
    document.getElementById('d-memo').textContent = r.memo || '—';
    document.getElementById('d-created').textContent = formatDateTime(r.createdAt);
    const toggleBtn = document.getElementById('btn-toggle-status');
    toggleBtn.textContent = r.status === 'settled' ? '↩ 申請中に戻す' : '✓ 精算済にする';
    showPane('detail');
    renderList(document.getElementById('search-input').value);
  }

  function formatDateTime(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}`;
  }

  // --- フォーム ---
  function openFormNew() {
    editingId = null;
    document.getElementById('form-title').textContent = '新規登録';
    const form = document.getElementById('form');
    form.reset();
    form.date.value = todayStr();
    form.category.value = '交通費';
    showPane('form');
  }

  function todayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function openFormEdit(id) {
    const r = records.find(x => x.id === id);
    if (!r) return;
    editingId = id;
    document.getElementById('form-title').textContent = '経費を編集';
    const form = document.getElementById('form');
    form.date.value = r.date;
    form.category.value = r.category;
    form.amount.value = r.amount;
    form.memo.value = r.memo || '';
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
      date: form.date.value,
      category: form.category.value,
      amount: parseInt(form.amount.value, 10) || 0,
      memo: form.memo.value.trim(),
    };
    if (!data.date || !data.category || !data.amount) return;

    if (editingId) {
      const idx = records.findIndex(x => x.id === editingId);
      if (idx >= 0) records[idx] = { ...records[idx], ...data };
      currentId = editingId;
    } else {
      const created = { id: uid(), ...data, status: 'pending', createdAt: new Date().toISOString() };
      records.push(created);
      currentId = created.id;
    }
    saveRecords();
    renderSummary();
    renderList(document.getElementById('search-input').value);
    openDetail(currentId);
  }

  function deleteCurrent() {
    if (!currentId) return;
    if (!confirm('この経費を削除します。よろしいですか？')) return;
    records = records.filter(x => x.id !== currentId);
    saveRecords();
    currentId = null;
    renderSummary();
    renderList(document.getElementById('search-input').value);
    showPane('empty');
  }

  function toggleStatus() {
    if (!currentId) return;
    const idx = records.findIndex(x => x.id === currentId);
    if (idx < 0) return;
    records[idx].status = records[idx].status === 'settled' ? 'pending' : 'settled';
    saveRecords();
    renderSummary();
    openDetail(currentId);
  }

  // --- 初期化 ---
  function init() {
    loadRecords();
    renderSummary();
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
    document.getElementById('btn-toggle-status').addEventListener('click', toggleStatus);
    document.getElementById('form').addEventListener('submit', handleSubmit);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
