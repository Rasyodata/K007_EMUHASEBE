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

function renderLogin(mode = "login") {
  document.querySelector("aside").style.display = "none";
  const main = document.getElementById("main");
  main.innerHTML =
    "<div style='max-width:360px;margin:12vh auto'>" +
    "<h2 style='text-align:center'>" + (mode === "login" ? "Giriş" : "Kayıt Ol") + "</h2>" +
    "<div id='err' style='color:#ff6b6b;min-height:20px;text-align:center;font-size:13px'></div>" +
    (mode === "register" ? "<input id='name' placeholder='Ad Soyad' style='margin-bottom:8px'/>" : "") +
    "<input id='email' placeholder='E-posta' value='" + (mode==='login'?'admin@local':'') + "' style='margin-bottom:8px'/>" +
    "<input id='pass' type='password' placeholder='Şifre' value='" + (mode==='login'?'admin123':'') + "' style='margin-bottom:12px'/>" +
    "<button class='p' id='go' style='width:100%'>" + (mode === "login" ? "Giriş Yap" : "Kayıt Ol") + "</button>" +
    "<p style='text-align:center;margin-top:12px'><a href='#' id='tog' style='color:var(--accent)'>" +
    (mode === "login" ? "Hesabın yok mu? Kayıt ol" : "Zaten üye misin? Giriş yap") + "</a></p>" +
    (mode === "login" ? "<p class=muted style='text-align:center;font-size:12px'>Varsayılan: admin@local / admin123</p>" : "") +
    "</div>";
  document.getElementById("tog").onclick = (e) => { e.preventDefault(); renderLogin(mode === "login" ? "register" : "login"); };
  document.getElementById("go").onclick = async () => {
    const body = { email: document.getElementById("email").value, password: document.getElementById("pass").value };
    if (mode === "register") body.name = document.getElementById("name").value;
    try {
      const r = await api("/api/auth/" + (mode === "login" ? "login" : "register"), { method: "POST", body: JSON.stringify(body) });
      if (r.token) { localStorage.setItem("token", r.token); boot(); }
      else document.getElementById("err").textContent = r.error || "hata";
    } catch (e) { document.getElementById("err").textContent = "bağlantı hatası"; }
  };
}

function renderMenu() {
  document.querySelector("aside").style.display = "";
  const el = document.getElementById("menu");
  el.innerHTML = "";
  const dh = document.createElement("div"); dh.className = "grp"; dh.textContent = "Panel"; el.appendChild(dh);
  const da = document.createElement("a"); da.textContent = "📊 Dashboard"; da.dataset.route = "__dashboard"; da.onclick = openDashboard; el.appendChild(da);

  const groups = {};
  for (const p of META.pages) { (groups[menuParent(p.route)] ||= []).push(p); }
  for (const [grp, pages] of Object.entries(groups)) {
    const h = document.createElement("div"); h.className = "grp"; h.textContent = grp; el.appendChild(h);
    for (const pg of pages) {
      const a = document.createElement("a"); a.textContent = pg.title; a.onclick = () => openPage(pg);
      a.dataset.route = pg.route; el.appendChild(a);
    }
  }
  // user + logout footer
  const uf = document.createElement("div"); uf.className = "grp"; uf.textContent = "Hesap"; el.appendChild(uf);
  const ui = document.createElement("div"); ui.style.cssText = "font-size:12px;color:var(--muted);padding:4px 8px"; ui.textContent = "👤 " + (USER?.name || USER?.email || ""); el.appendChild(ui);
  const lo = document.createElement("a"); lo.textContent = "Çıkış"; lo.onclick = async () => { await api("/api/auth/logout", { method: "POST" }).catch(()=>{}); localStorage.removeItem("token"); renderLogin(); }; el.appendChild(lo);
  openDashboard();
}
function menuParent(route){ const m = META.menu.find((x)=>x.route===route); return m?.parent || "Genel"; }

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
