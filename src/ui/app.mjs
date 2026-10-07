// Generated frontend with auth (login/register) + generic data grid.
let META = null, USER = null;
const token = () => localStorage.getItem("token") || "";

async function api(p, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (opts.body) headers["Content-Type"] = "application/json";
  if (token()) headers["Authorization"] = "Bearer " + token();
  const r = await fetch(p, { ...opts, headers });
  if (r.status === 401 && !p.startsWith("/api/auth")) { localStorage.removeItem("token"); renderLogin(); throw new Error("401"); }
  return r.json();
}

const ROLE_ICON = {
  "Yönetici": "👔", "Muhasebeci": "🧮", "Şantiye Şefi": "👷", "Tekniker": "🔧",
  "Şantiye Güvenlik": "🛡️", "Sistem Yöneticisi": "🖥️", "Taşeron": "🤝",
};

async function quickLogin(email) {
  const err = document.getElementById("err");
  try {
    const r = await api("/api/auth/quick-login", { method: "POST", body: JSON.stringify({ email }) });
    if (r.token) { localStorage.setItem("token", r.token); boot(); }
    else if (err) err.textContent = r.error || "giriş başarısız";
  } catch (e) { if (err) err.textContent = "bağlantı hatası"; }
}

async function renderLogin() {
  document.getElementById("topbar").style.display = "none";
  const main = document.getElementById("main");
  main.innerHTML =
    "<div style='max-width:760px;margin:9vh auto;text-align:center'>" +
    "<h2 style='margin-bottom:4px'>EMG MUHASEBE</h2>" +
    "<p class=muted style='margin-bottom:4px'>Rolünü seç ve gir — şifre gerekmez</p>" +
    "<p style='display:inline-block;background:#3a2e00;color:#ffcf4d;font-size:11px;font-weight:700;letter-spacing:1px;padding:3px 10px;border-radius:999px;margin-bottom:18px'>TEST GİRİŞİ</p>" +
    "<div id='err' style='color:#ff6b6b;min-height:20px;font-size:13px'></div>" +
    "<div id='roles' style='display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:8px'></div>" +
    "</div>";
  let users = [];
  try { const d = await api("/api/auth/roles"); users = d.users || []; } catch (e) { /* yoksa boş */ }
  const grid = document.getElementById("roles");
  if (!users.length) { grid.innerHTML = "<p class=muted>Rol kullanıcısı bulunamadı.</p>"; return; }
  for (const u of users) {
    const b = document.createElement("button");
    b.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:6px;background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:18px 12px;cursor:pointer;color:inherit;transition:border-color .15s";
    b.onmouseover = () => b.style.borderColor = "var(--accent)";
    b.onmouseout = () => b.style.borderColor = "var(--border)";
    b.innerHTML = "<div style='font-size:30px'>" + (ROLE_ICON[u.role] || "👤") + "</div>" +
      "<div style='font-weight:700;font-size:14px'>" + (u.role || u.name) + "</div>" +
      "<div class=muted style='font-size:11px'>" + u.name + "</div>";
    b.onclick = () => quickLogin(u.email);
    grid.appendChild(b);
  }
}

function renderMenu() {
  document.getElementById("topbar").style.display = "";
  const el = document.getElementById("menu");
  el.innerHTML = "";
  // Dashboard + tüm sayfa linkleri yatay üst barda.
  const da = document.createElement("a"); da.textContent = "📊 Dashboard"; da.dataset.route = "__dashboard"; da.onclick = openDashboard; el.appendChild(da);
  for (const pg of META.pages) {
    const a = document.createElement("a"); a.textContent = pg.title; a.onclick = () => openPage(pg);
    a.dataset.route = pg.route; el.appendChild(a);
  }
  // Kullanıcı + Çıkış sağda.
  const acc = document.getElementById("account"); acc.innerHTML = "";
  const who = document.createElement("span"); who.className = "who"; who.textContent = (ROLE_ICON[USER?.role] || "👤") + " " + (USER?.name || USER?.email || "") + (USER?.role ? " · " + USER.role : ""); acc.appendChild(who);
  const lo = document.createElement("a"); lo.textContent = "Çıkış"; lo.onclick = async () => { await api("/api/auth/logout", { method: "POST" }).catch(()=>{}); localStorage.removeItem("token"); renderLogin(); }; acc.appendChild(lo);
  openDashboard();
}

const TRY = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 });
function tileGrid(tiles, min) {
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax("+(min||180)+"px,1fr));gap:12px;margin-top:14px";
  const toneColor = { pos: "#39d98a", neg: "#ff6b6b" };
  for (const t of tiles) {
    const c = document.createElement("div");
    c.style.cssText = "background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px";
    const val = t.money ? TRY.format(t.val) : t.val;
    const col = t.tone ? ";color:" + (toneColor[t.tone] || "inherit") : "";
    c.innerHTML = "<div style='color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:1px'>" + t.label +
      "</div><div style='font-size:" + (t.money ? "24" : "30") + "px;font-weight:800;margin-top:6px" + col + "'>" + val + "</div>";
    wrap.appendChild(c);
  }
  return wrap;
}

async function openDashboard() {
  document.querySelectorAll("#menu a").forEach((a)=>a.classList.toggle("active", a.dataset.route==="__dashboard"));
  const main = document.getElementById("main");
  main.innerHTML = "<h2>Dashboard</h2><p class=muted>"+META.modules.length+" modül · "+META.tables.length+" tablo</p>";

  // Finansal özet (türetilmiş para KPI'ları).
  try {
    const summary = await api("/api/_summary");
    if (Array.isArray(summary) && summary.length) {
      const h = document.createElement("div"); h.style.cssText = "margin-top:18px;font-size:13px;font-weight:700;color:var(--muted)"; h.textContent = "FİNANSAL ÖZET";
      main.appendChild(h);
      main.appendChild(tileGrid(summary, 200));
    }
  } catch (e) { /* özet opsiyonel */ }

  // Kayıt sayıları (modül widget'ları veya tablo başına).
  const stats = await api("/api/_stats");
  const byTable = Object.fromEntries(stats.map((s)=>[s.table, s.count]));
  const tiles = (META.widgets && META.widgets.length)
    ? META.widgets.map((w)=>({ label:w.title+" (adet)", val: byTable[w.table] ?? 0 }))
    : META.tables.map((t)=>({ label:t.name, val: byTable[t.name] ?? 0 }));
  const h2 = document.createElement("div"); h2.style.cssText = "margin-top:22px;font-size:13px;font-weight:700;color:var(--muted)"; h2.textContent = "KAYIT SAYILARI";
  main.appendChild(h2);
  main.appendChild(tileGrid(tiles, 160));
}

async function openPage(pg) {
  document.querySelectorAll("#menu a").forEach((a)=>a.classList.toggle("active", a.dataset.route===pg.route));
  const main = document.getElementById("main");
  if (!pg.table) { main.innerHTML = "<h2>"+pg.title+"</h2><p class=muted>Bu sayfa için tablo tanımlı değil.</p>"; return; }
  const tableMeta = META.tables.find((t)=>t.name===pg.table);
  const rows = await api("/api/t/"+pg.table);
  const cols = tableMeta.fields.map((f)=>f.name);
  const fieldDefs = tableMeta.fields.filter((f)=> f.name!=="id" && !f.name.startsWith("_"));
  main.innerHTML = "<h2>"+pg.title+"</h2><p class=muted>"+pg.table+" · "+rows.length+" kayıt</p>";
  const form = document.createElement("div"); form.className="row";
  const getters = {};
  for (const f of fieldDefs) {
    let el;
    const opts = f.options || [];
    if (f.type==="select" && opts.length) {
      el = document.createElement("select");
      el.innerHTML = "<option value=''>"+f.name+"…</option>" + opts.map((o)=>"<option>"+o+"</option>").join("");
      getters[f.name] = ()=> el.value;
    } else if (f.type==="multiselect" && opts.length) {
      el = document.createElement("div");
      el.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;align-items:center;border:1px solid var(--border);border-radius:6px;padding:6px 10px";
      const bs = opts.map((o)=>{ const l=document.createElement("label"); l.style.fontSize="12px"; const c=document.createElement("input"); c.type="checkbox"; c.value=o; l.appendChild(c); l.appendChild(document.createTextNode(" "+o)); el.appendChild(l); return c; });
      getters[f.name] = ()=> bs.filter((b)=>b.checked).map((b)=>b.value).join(", ");
    } else {
      el = document.createElement("input"); el.placeholder=f.name;
      getters[f.name] = ()=> el.value;
    }
    form.appendChild(el);
  }
  const add = document.createElement("button"); add.className="p"; add.textContent="+ Ekle";
  add.onclick = async ()=>{ const body={}; for(const n in getters){ const v=getters[n](); if(v) body[n]=v; } await api("/api/t/"+pg.table,{method:"POST",body:JSON.stringify(body)}); openPage(pg); };
  form.appendChild(add); main.appendChild(form);
  const tbl=document.createElement("table"); const thead="<tr>"+cols.map((c)=>"<th>"+c+"</th>").join("")+"<th></th></tr>";
  tbl.innerHTML="<thead>"+thead+"</thead>";
  const tb=document.createElement("tbody");
  for (const r of rows){ const tr=document.createElement("tr");
    tr.innerHTML=cols.map((c)=>"<td>"+(r[c]??"")+"</td>").join("");
    const td=document.createElement("td"); const del=document.createElement("button"); del.textContent="sil";
    del.onclick=async()=>{ await api("/api/t/"+pg.table+"/"+r.id,{method:"DELETE"}); openPage(pg); };
    td.appendChild(del); tr.appendChild(td); tb.appendChild(tr); }
  tbl.appendChild(tb); main.appendChild(tbl);
}

async function boot() {
  META = await api("/api/_meta");
  if (!token()) return renderLogin();
  try {
    const me = await fetch("/api/auth/me", { headers: { Authorization: "Bearer " + token() } });
    if (!me.ok) { localStorage.removeItem("token"); return renderLogin(); }
    USER = (await me.json()).user;
    renderMenu();
  } catch { renderLogin(); }
}
boot();
