import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

let cards = [];
let currentId = null;
let editingId = null;

// --- データ層（Supabase） ---
async function fetchCards() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    cards = [];
    return;
  }
  cards = data ?? [];
}

async function insertCard(data) {
  const { data: inserted, error } = await supabase
    .from('contacts')
    .insert(data)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return inserted;
}

async function updateCard(id, data) {
  const { data: updated, error } = await supabase
    .from('contacts')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return updated;
}

async function deleteCard(id) {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
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

  const filtered = cards.filter(c => {
    if (!kw) return true;
    return (
      c.name.toLowerCase().includes(kw) ||
      c.company.toLowerCase().includes(kw) ||
      (c.title || '').toLowerCase().includes(kw)
    );
  });

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
  document.getElementById('d-created').textContent = formatDate(c.created_at);
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

async function handleSubmit(e) {
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

  let saved;
  if (editingId) {
    saved = await updateCard(editingId, data);
  } else {
    saved = await insertCard(data);
  }
  if (!saved) return;

  await fetchCards();
  currentId = saved.id;
  renderList(document.getElementById('search-input').value);
  openDetail(currentId);
}

async function deleteCurrent() {
  if (!currentId) return;
  if (!confirm('この名刺を削除します。よろしいですか？')) return;
  const ok = await deleteCard(currentId);
  if (!ok) return;
  currentId = null;
  await fetchCards();
  renderList(document.getElementById('search-input').value);
  showPane('empty');
}

// --- 初期化 ---
async function init() {
  await fetchCards();
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
