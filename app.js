/* 
  CONFIG
 */
const API = 'http://localhost:5142/api';

/* 
  APP STATE
 */
let JWT = null;
let USEREMAIL = null;
let ALL_HIST = [];

/* 
  UNIT DATA  (mirrors your C# enums)
 */
const UNITS = {
  Length: ['FEET', 'INCH', 'YARD', 'CENTIMETERS'],
  Weight: ['MILLIGRAM', 'GRAM', 'KILOGRAM', 'POUND', 'TONNE'],
  Volume: ['LITRE', 'MILLILITRE', 'GALLON'],
  Temperature: ['CELSIUS', 'FAHRENHEIT', 'KELVIN']
};

/* 
  INIT
 */
window.addEventListener('load', initUnits);

/* 
  NAVIGATION
 */
function go(page, sub) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));

  document.getElementById('page-' + page).classList.add('active');
  const nl = document.getElementById('nl-' + page);
  if (nl) nl.classList.add('active');

  window.scrollTo(0, 0);

  if (page === 'auth') switchAuth(sub || 'login');
  if (page === 'ops') switchTab(sub || 'convert');
  if (page === 'history') renderHistory();
}

/* 
  OPERATION TABS
 */
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.op-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('tp-' + tab).classList.add('active');
}

/* 
  UNIT SELECT HELPERS
 */
function fillSel(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = arr.map(u => `<option value="${u}">${u}</option>`).join('');
}

function typeChange(prefix) {
  const type = document.getElementById(prefix + '-type').value;
  const units = UNITS[type] || [];
  if (prefix === 'cv') {
    fillSel('cv-from', units);
    fillSel('cv-to', units);
  } else if (prefix === 'add') {
    fillSel('add-u1', units);
    fillSel('add-u2', units);
    fillSel('add-tg', units);
  } else if (prefix === 'sub') {
    fillSel('sub-u1', units);
    fillSel('sub-u2', units);
    fillSel('sub-tg', units);
  } else if (prefix === 'div') {
    fillSel('div-u1', units);
    fillSel('div-u2', units);
  }
}

function initUnits() {
  ['cv', 'add', 'sub', 'div'].forEach(typeChange);
}

/* 
  RESULT DISPLAY
 */
function showResult(prefix, data, ok) {
  const box = document.getElementById(prefix + '-res');
  const rvEl = document.getElementById(prefix + '-rv');
  const rmEl = document.getElementById(prefix + '-rm');

  box.className = 'result-box show' + (ok ? '' : ' error');

  if (ok) {
    const val = data.value !== undefined ? Number(data.value).toFixed(4) : JSON.stringify(data);
    const unit = data.unit || '';
    rvEl.className = 'result-value';
    rvEl.textContent = val + (unit ? ' ' + unit : '');
    rmEl.textContent = data.measurementType ? 'Type: ' + data.measurementType : '';
  } else {
    rvEl.className = 'result-value error-text';
    rvEl.textContent = String(data);
    rmEl.textContent = '';
  }
}

/* button loading state */
function setBtnLoading(id, loading, label) {
  const b = document.getElementById(id);
  if (loading) {
    b.disabled = true;
    b.innerHTML = '<span class="spinner"></span>Processing…';
  } else {
    b.disabled = false;
    b.textContent = label;
  }
}

/* 
  HTTP HELPERS
 */
function hdrs() {
  const h = { 'Content-Type': 'application/json' };
  if (JWT) h['Authorization'] = 'Bearer ' + JWT;
  return h;
}

const gv = id => document.getElementById(id)?.value;

/* 
  OPERATIONS
  All hit your ASP.NET endpoints on port 5142
 */

/* POST /api/quantities/convert  →  ConvertRequest */
async function runConvert() {
  const v = parseFloat(gv('cv-val'));
  if (isNaN(v)) { showResult('cv', 'Please enter a valid number.', false); return; }

  setBtnLoading('cv-btn', true, 'Convert');
  try {
    const body = {
      source: { value: v, unit: gv('cv-from'), measurementType: gv('cv-type') },
      targetUnit: gv('cv-to')
    };
    const r = await fetch(`${API}/quantities/convert`,
      { method: 'POST', headers: hdrs(), body: JSON.stringify(body) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.title || d.message || JSON.stringify(d));
    showResult('cv', d, true);
  } catch (e) { showResult('cv', e.message, false); }
  finally { setBtnLoading('cv-btn', false, 'Convert'); }
}

/* POST /api/quantities/add  →  ArithmeticRequest */
async function runAdd() {
  const v1 = parseFloat(gv('add-v1'));
  const v2 = parseFloat(gv('add-v2'));
  if (isNaN(v1) || isNaN(v2)) {
    showResult('add', 'Please enter valid numbers for both quantities.', false);
    return;
  }

  setBtnLoading('add-btn', true, 'Add Quantities');
  const tp = gv('add-type');
  try {
    const body = {
      q1: { value: v1, unit: gv('add-u1'), measurementType: tp },
      q2: { value: v2, unit: gv('add-u2'), measurementType: tp },
      targetUnit: gv('add-tg')
    };
    const r = await fetch(`${API}/quantities/add`,
      { method: 'POST', headers: hdrs(), body: JSON.stringify(body) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.title || d.message || JSON.stringify(d));
    showResult('add', d, true);
  } catch (e) { showResult('add', e.message, false); }
  finally { setBtnLoading('add-btn', false, 'Add Quantities'); }
}

/* POST /api/quantities/subtract  →  ArithmeticRequest */
async function runSubtract() {
  const v1 = parseFloat(gv('sub-v1'));
  const v2 = parseFloat(gv('sub-v2'));
  if (isNaN(v1) || isNaN(v2)) {
    showResult('sub', 'Please enter valid numbers for both quantities.', false);
    return;
  }

  setBtnLoading('sub-btn', true, 'Subtract Quantities');
  const tp = gv('sub-type');
  try {
    const body = {
      q1: { value: v1, unit: gv('sub-u1'), measurementType: tp },
      q2: { value: v2, unit: gv('sub-u2'), measurementType: tp },
      targetUnit: gv('sub-tg')
    };
    const r = await fetch(`${API}/quantities/subtract`,
      { method: 'POST', headers: hdrs(), body: JSON.stringify(body) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.title || d.message || JSON.stringify(d));
    showResult('sub', d, true);
  } catch (e) { showResult('sub', e.message, false); }
  finally { setBtnLoading('sub-btn', false, 'Subtract Quantities'); }
}

/* POST /api/quantities/divide  →  ArithmeticRequest (no targetUnit) */
async function runDivide() {
  const v1 = parseFloat(gv('div-v1'));
  const v2 = parseFloat(gv('div-v2'));
  if (isNaN(v1) || isNaN(v2)) {
    showResult('div', 'Please enter valid numbers for both quantities.', false);
    return;
  }

  setBtnLoading('div-btn', true, 'Divide');
  const tp = gv('div-type');
  try {
    const body = {
      q1: { value: v1, unit: gv('div-u1'), measurementType: tp },
      q2: { value: v2, unit: gv('div-u2'), measurementType: tp }
    };
    const r = await fetch(`${API}/quantities/divide`,
      { method: 'POST', headers: hdrs(), body: JSON.stringify(body) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.title || d.message || JSON.stringify(d));
    showResult('div', typeof d === 'object' ? d : { value: d, unit: '' }, true);
  } catch (e) { showResult('div', e.message, false); }
  finally { setBtnLoading('div-btn', false, 'Divide'); }
}

/* 
  AUTH
  POST /api/auth/login    — email & password as query params
  POST /api/auth/register — same
 */
function switchAuth(mode) {
  const isLogin = mode === 'login';
  document.getElementById('atab-login').classList.toggle('active', isLogin);
  document.getElementById('atab-register').classList.toggle('active', !isLogin);
  document.getElementById('af-login').style.display = isLogin ? 'flex' : 'none';
  document.getElementById('af-register').style.display = isLogin ? 'none' : 'flex';
  document.getElementById('auth-h2').textContent =
    isLogin ? 'Welcome back' : 'Create account';
  document.getElementById('auth-p').textContent =
    isLogin ? 'Sign in to access your history' : 'Register to start tracking operations';

  /* clear any old messages */
  ['l-msg', 'r-msg'].forEach(id => {
    const el = document.getElementById(id);
    el.className = 'auth-msg';
    el.textContent = '';
  });
}

async function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const pass = document.getElementById('l-pass').value;
  const msgEl = document.getElementById('l-msg');
  if (!email || !pass) { setMsg(msgEl, 'error', 'Please fill in both fields.'); return; }

  setBtnLoading('l-btn', true, 'Sign In');
  try {
    const r = await fetch(
      `${API}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );
    if (!r.ok) throw new Error('Invalid email or password.');
    let token = await r.text();
    JWT = token.replace(/^"|"$/g, '');   
    USEREMAIL = email;
    renderNavUser(true);
    showToast('Signed in successfully!', 'ok');
    go('home');
  } catch (e) { setMsg(msgEl, 'error', e.message); }
  finally { setBtnLoading('l-btn', false, 'Sign In'); }
}

async function doRegister() {
  const email = document.getElementById('r-email').value.trim();
  const pass = document.getElementById('r-pass').value;
  const msgEl = document.getElementById('r-msg');
  if (!email || !pass) { setMsg(msgEl, 'error', 'Please fill in both fields.'); return; }

  setBtnLoading('r-btn', true, 'Create Account');
  try {
    const r = await fetch(
      `${API}/auth/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    );
    if (!r.ok) throw new Error('Registration failed. Email may already be in use.');
    setMsg(msgEl, 'success', 'Account created! Signing you in…');
    /* auto-login after short delay */
    setTimeout(async () => {
      document.getElementById('l-email').value = email;
      document.getElementById('l-pass').value = pass;
      switchAuth('login');
      await doLogin();
    }, 900);
  } catch (e) { setMsg(msgEl, 'error', e.message); }
  finally { setBtnLoading('r-btn', false, 'Create Account'); }
}

function doLogout() {
  JWT = null; USEREMAIL = null; ALL_HIST = [];
  renderNavUser(false);
  showToast('Signed out.', '');
  go('home');
}

function renderNavUser(loggedIn) {
  const area = document.getElementById('nav-auth-area');
  if (loggedIn) {
    const initials = (USEREMAIL || 'U').slice(0, 2).toUpperCase();
    const shortName = (USEREMAIL || '').split('@')[0];
    area.innerHTML = `
      <div class="user-chip">
        <div class="user-av">${initials}</div>
        <span class="user-name">${shortName}</span>
      </div>
      <button class="btn btn-danger" onclick="doLogout()">Sign Out</button>`;
  } else {
    area.innerHTML = `
      <button class="btn"             onclick="go('auth','login')">Log In</button>
      <button class="btn btn-primary" onclick="go('auth','register')">Sign Up</button>`;
  }
}

/* 
  HISTORY
  GET /api/quantities/history       — QuantityHistoryRecord[]
  GET /api/quantities/HistoryCount  — integer
 */
function renderHistory() {
  if (!JWT) {
    document.getElementById('hist-lock').style.display = 'block';
    document.getElementById('hist-data').style.display = 'none';
  } else {
    document.getElementById('hist-lock').style.display = 'none';
    document.getElementById('hist-data').style.display = 'block';
    loadHistory();
  }
}

async function loadHistory() {
  if (!JWT) return;
  const tbody = document.getElementById('hist-tbody');
  tbody.innerHTML = '<tr><td colspan="7" class="empty-row">Loading…</td></tr>';

  try {
    const [hRes, cRes] = await Promise.all([
      fetch(`${API}/quantities/history`, { headers: hdrs() }),
      fetch(`${API}/quantities/HistoryCount`, { headers: hdrs() })
    ]);
    if (!hRes.ok) throw new Error(`Server error ${hRes.status}`);

    ALL_HIST = await hRes.json();
    const count = await cRes.json();

    if (!Array.isArray(ALL_HIST)) throw new Error('Unexpected response format.');

    /* stat cards */
    document.getElementById('hs-total').textContent =
      count ?? ALL_HIST.length;
    document.getElementById('hs-conv').textContent =
      ALL_HIST.filter(h => h.operationType === 'Convert').length;
    document.getElementById('hs-arith').textContent =
      ALL_HIST.filter(h => ['Add', 'Subtract', 'Divide'].includes(h.operationType)).length;
    const cats = new Set(ALL_HIST.map(h => h.category).filter(Boolean));
    document.getElementById('hs-cats').textContent = cats.size;

    renderTable(ALL_HIST);
  } catch (e) {
    tbody.innerHTML =
      `<tr><td colspan="7" class="empty-row">Error: ${e.message}</td></tr>`;
  }
}

function filterHist(filter, el) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderTable(
    filter === 'All'
      ? ALL_HIST
      : ALL_HIST.filter(h => h.operationType === filter)
  );
}

function renderTable(rows) {
  const tbody = document.getElementById('hist-tbody');
  if (!rows || rows.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="empty-row">No operations found.</td></tr>';
    return;
  }

  const badgeCls = {
    Convert: 'badge-convert',
    Add: 'badge-add',
    Subtract: 'badge-subtract',
    Divide: 'badge-divide'
  };

  tbody.innerHTML = [...rows].reverse().map(r => {
    const cls = badgeCls[r.operationType] || 'badge-unknown';
    const inputStr = r.secondValue != null
      ? `${r.firstValue} ${r.firstUnit} &amp; ${r.secondValue} ${r.secondUnit}`
      : `${r.firstValue ?? '–'} ${r.firstUnit ?? ''}`;
    const resultStr = r.errorMessage
      ? `<span style="color:#dc2626;font-size:.78rem">${r.errorMessage}</span>`
      : `<span class="mono-val">${r.resultValue != null ? Number(r.resultValue).toFixed(4) : '–'
      } ${r.resultUnit ?? ''}</span>`;
    const dateStr = r.createdAt
      ? new Date(r.createdAt).toLocaleString('en-IN',
        { dateStyle: 'short', timeStyle: 'short' })
      : '–';

    return `<tr>
      <td style="color:#aaa;font-size:.78rem">${r.id}</td>
      <td><span class="badge ${cls}">${r.operationType || '–'}</span></td>
      <td style="color:#888">${r.category || '–'}</td>
      <td class="mono-val" style="font-size:.8rem">${inputStr}</td>
      <td>${resultStr}</td>
      <td style="color:#aaa;font-size:.78rem">${r.executionTimeMs != null ? r.executionTimeMs + ' ms' : '–'
      }</td>
      <td style="color:#aaa;font-size:.76rem;white-space:nowrap">${dateStr}</td>
    </tr>`;
  }).join('');
}


  //UTILITIES

function setMsg(el, type, text) {
  el.className = 'auth-msg ' + type;
  el.textContent = text;
}

let _toastTimer;
function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type || ''} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}