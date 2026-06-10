/* =========================================================================
 * テジュン食堂 発注書アプリ — STEP1
 * =========================================================================
 *
 * ★食材・業者を増やしたいときは、下の「設定」だけ書き換えればOKです。★
 *   - VENDORS … 業者（並び順＝表示順／色）
 *   - ITEMS   … 食材（name＝品名, vendor＝どの業者か, unit＝単位（任意））
 *
 * id は保存に使う「変わらない名札」です。一度決めたら変えない方が安全です
 *（変えると、その品目の当日入力がリセットされます）。
 * ========================================================================= */

/* ===== 設定：お店の情報 ===== */
const SHOP_NAME = "テジュン食堂";
const SHOP_TEL = ""; // 電話番号（任意）。例 "03-1234-5678" と入れるとPDFに表示されます。空ならPDFに出ません。

/* ===== 設定：業者（上から表示順・色は薄め） ===== */
const VENDORS = [
  { id: "manyu",  name: "万友",  bg: "#eaf6ec", soft: "#f2faf4", line: "#cfe7d4", accent: "#3f9c52" }, // 緑
  { id: "narita", name: "ナリタ", bg: "#eaf1fb", soft: "#f3f7fd", line: "#d2e0f3", accent: "#3f72b5" }, // 青
];

/* ===== 設定：食材 ===== */
const ITEMS = [
  // ───── 万友（緑）─────
  { id: "moyashi",   name: "もやし",       vendor: "manyu", unit: "袋" },
  { id: "shimeji",   name: "しめじ",       vendor: "manyu", unit: "袋" },
  { id: "zenmai",    name: "ぜんまい",     vendor: "manyu", unit: "袋" },
  { id: "egoma",     name: "えごま",       vendor: "manyu", unit: "袋" },
  { id: "lemon",     name: "レモン",       vendor: "manyu", unit: "個" },
  { id: "daikon",    name: "大根",         vendor: "manyu", unit: "本" },
  { id: "cabbage",   name: "キャベツ",     vendor: "manyu", unit: "個" },
  { id: "kyuri",     name: "きゅうり",     vendor: "manyu", unit: "袋" },
  { id: "sunny",     name: "サニーレタス", vendor: "manyu", unit: "玉" },
  { id: "piman",     name: "ピーマン",     vendor: "manyu", unit: "袋" },
  { id: "nasu",      name: "ナス",         vendor: "manyu", unit: "本" },
  { id: "potato",    name: "ジャガイモ",   vendor: "manyu", unit: "袋" },
  { id: "tamago",    name: "卵",           vendor: "manyu", unit: "pc" },
  { id: "tamanegi",  name: "玉ねぎ",       vendor: "manyu", unit: "袋" },
  { id: "sanchu",    name: "サンチュ",     vendor: "manyu", unit: "袋" },
  { id: "nira",      name: "ニラ",         vendor: "manyu", unit: "束" },
  // 万友（2日前発注の品）
  { id: "ninjin",    name: "人参",         vendor: "manyu", unit: "袋" },
  { id: "shironegi", name: "白ネギ",       vendor: "manyu", unit: "pc" },
  { id: "aonegi",    name: "青ネギ",       vendor: "manyu", unit: "pc" },
  // 万友（鍋具材）
  { id: "hakusai",   name: "白菜",         vendor: "manyu", unit: "玉" },
  { id: "enoki",     name: "えのき",       vendor: "manyu", unit: "袋" },
  { id: "seri",      name: "せり",         vendor: "manyu", unit: "束" },

  // ───── ナリタ（青）─────
  { id: "hakusai_kimchi", name: "白菜キムチ",     vendor: "narita", unit: "袋" },
  { id: "aotogarashi",    name: "青唐辛子",       vendor: "narita", unit: "袋" },
  { id: "tteokbokki",     name: "トッポギ",       vendor: "narita", unit: "袋" },
  { id: "kanjang",        name: "カンジャンタレ", vendor: "narita", unit: "袋" },
  { id: "yangnyeom",      name: "ヤンニョムタレ", vendor: "narita", unit: "袋" },
  { id: "honey_dare",     name: "ハニーだれ",     vendor: "narita", unit: "袋" },
  { id: "yangnyeonjang",  name: "ヤンニンジャン", vendor: "narita", unit: "個" },
  { id: "gochujang",      name: "コチュジャン",   vendor: "narita", unit: "個" },
  { id: "chige_miso",     name: "チゲ味噌",       vendor: "narita", unit: "個" },
  // ナリタ（冷凍庫）
  { id: "niku_gyoza",     name: "肉餃子",         vendor: "narita", unit: "袋" },
  { id: "kimchi_gyoza",   name: "キムチ餃子",     vendor: "narita", unit: "袋" },
  { id: "changja",        name: "チャンジャ",     vendor: "narita", unit: "袋" },
  { id: "gyukotsu",       name: "牛骨スープ",     vendor: "narita", unit: "個" },
  { id: "oden",           name: "おでん",         vendor: "narita", unit: "袋" },
  // ナリタ（奥棚）
  { id: "chijimi_ko",     name: "チヂミ粉",       vendor: "narita", unit: "袋" },
  { id: "nashi_juice",    name: "梨ジュース",     vendor: "narita", unit: "個" },
  { id: "momo_juice",     name: "桃ジュース",     vendor: "narita", unit: "個" },
  { id: "budou_juice",    name: "ブドウジュース", vendor: "narita", unit: "個" },
  // ナリタ（キッチン）
  { id: "reimen",         name: "冷麺",           vendor: "narita", unit: "袋" },
  { id: "reimen_soup",    name: "冷麺スープ",     vendor: "narita", unit: "袋" },
  { id: "kankoku_nori",   name: "韓国海苔",       vendor: "narita", unit: "袋" },
  { id: "harusame",       name: "春雨",           vendor: "narita", unit: "個" },
  { id: "sarimen",        name: "サリ麺",         vendor: "narita", unit: "袋" },
  { id: "jaban_nori",     name: "ジャバン海苔",   vendor: "narita", unit: "袋" },
];

/* ===== 設定：目安（在庫の目安）。上の切り替えで表示が変わります ===== */
// 「ベース」は写真の在庫欄の数を入れています。
// 「2日分」「月末」は数字が決まったら下に { id: 数 } を足すだけでOK（空なら「目安 —」と表示）。
const GUIDE_MODES = [
  { id: "base",  label: "ベース" },
  { id: "two",   label: "2日分" },
  { id: "month", label: "月末" },
];
const GUIDES = {
  base: {
    // 万友
    moyashi: 1, shimeji: 2, zenmai: 1, egoma: 2, lemon: 6, daikon: 2,
    cabbage: 1, kyuri: 2, sunny: 1, piman: 3, nasu: 4, potato: 2,
    tamago: 8, tamanegi: 4, sanchu: 20, nira: 8, ninjin: 4, shironegi: 2,
    aonegi: 2, hakusai: 1, enoki: 1, seri: 1,
    // ナリタ
    hakusai_kimchi: 4, aotogarashi: 2, tteokbokki: 5, kanjang: 2, yangnyeom: 1,
    honey_dare: 1, yangnyeonjang: 2, gochujang: 2, chige_miso: 2, niku_gyoza: 2,
    kimchi_gyoza: 2, changja: 1, gyukotsu: 2, oden: 2, chijimi_ko: 2,
    nashi_juice: 1, momo_juice: 1, budou_juice: 1, reimen: 5, reimen_soup: 10,
    kankoku_nori: 4, harusame: 5, sarimen: 6, jaban_nori: 2,
  },
  two: {}, // 2日分（あとで数字を追加）
  month: {}, // 月末（あとで数字を追加）
};

/* =========================================================================
 * ここから下はプログラム本体（通常は触らなくてOK）
 * ========================================================================= */

const KEY_PREFIX = "tejun-order:"; // localStorage キー（日付ごと）

/* ----- 小さなユーティリティ ----- */
const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  return n;
};
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function todayYmd() {
  return ymd(new Date());
}
function addDays(ymdStr, n) {
  const [y, m, d] = ymdStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return ymd(dt);
}
function formatJp(ymdStr) {
  if (!ymdStr) return "";
  const [y, m, d] = ymdStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${y}/${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}（${WEEK[dt.getDay()]}）`;
}
function clampQty(v) {
  v = Math.round(Number(v));
  if (!Number.isFinite(v) || v < 0) v = 0;
  if (v > 999) v = 999;
  return v;
}

/* ----- 状態（当日分） ----- */
let sessionDate = todayYmd();
let state = { orderDate: "", deliveryDate: "", qty: {} };

/* ----- 目安モード（ベース／2日分／月末）。表示のみ・端末に記憶 ----- */
const GUIDE_KEY = "tejun-guide-mode";
let guideMode = "base";
function loadGuideMode() {
  try {
    const m = localStorage.getItem(GUIDE_KEY);
    if (m && GUIDES[m]) return m;
  } catch (e) {}
  return "base";
}
function saveGuideMode() {
  try { localStorage.setItem(GUIDE_KEY, guideMode); } catch (e) {}
}
function getGuide(itemId) {
  const m = GUIDES[guideMode] || {};
  const v = m[itemId];
  return typeof v === "number" ? v : null;
}

function blankState() {
  const t = todayYmd();
  return { orderDate: t, deliveryDate: addDays(t, 1), qty: {} };
}
function normalize(s) {
  const base = blankState();
  if (!s || typeof s !== "object") return base;
  return {
    orderDate: typeof s.orderDate === "string" ? s.orderDate : base.orderDate,
    deliveryDate: typeof s.deliveryDate === "string" ? s.deliveryDate : base.deliveryDate,
    qty: s.qty && typeof s.qty === "object" ? s.qty : {},
  };
}
function loadState(dateKey) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + dateKey);
    if (raw) return normalize(JSON.parse(raw));
  } catch (e) {
    console.warn("読み込み失敗", e);
  }
  return blankState();
}

let saveTimer = null;
function scheduleSave() {
  setSaveStatus("saving");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 300);
}
function saveNow() {
  try {
    localStorage.setItem(KEY_PREFIX + sessionDate, JSON.stringify(state));
    setSaveStatus("saved");
  } catch (e) {
    console.error("保存失敗", e);
    setSaveStatus("error");
  }
}
function setSaveStatus(kind) {
  const pill = $("#savePill");
  if (!pill) return;
  pill.classList.remove("saving", "error");
  if (kind === "saving") {
    pill.classList.add("saving");
    pill.textContent = "保存中…";
  } else if (kind === "error") {
    pill.classList.add("error");
    pill.textContent = "保存エラー";
  } else {
    pill.textContent = "保存済み";
  }
}

/* ----- 参照テーブル ----- */
const vendorById = Object.fromEntries(VENDORS.map((v) => [v.id, v]));
const itemById = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
const itemsByVendor = (vid) => ITEMS.filter((i) => i.vendor === vid);
const refs = {}; // itemId -> { row, input }
const vendorEls = {}; // vendorId -> { section, countBadge, tocCount }

/* =========================================================================
 * 描画
 * ========================================================================= */
function buildUI() {
  buildTOC();
  buildGuideSwitch();
  buildVendors();
  // 日付入力
  $("#orderDate").value = state.orderDate;
  $("#deliveryDate").value = state.deliveryDate;
}

function buildTOC() {
  const toc = $("#toc");
  toc.innerHTML = "";
  VENDORS.forEach((v) => {
    const chip = el("button", "toc-chip");
    chip.type = "button";
    chip.style.setProperty("--chip-bg", v.bg);
    chip.style.setProperty("--chip-accent", v.accent);
    chip.style.setProperty("--chip-ink", v.accent);
    const name = el("span");
    name.textContent = v.name;
    const cnt = el("span", "chip-count zero");
    cnt.textContent = "0";
    chip.appendChild(name);
    chip.appendChild(cnt);
    chip.addEventListener("click", () =>
      safe(() => {
        const sec = vendorEls[v.id] && vendorEls[v.id].section;
        if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
      })
    );
    toc.appendChild(chip);
    vendorEls[v.id] = { tocChip: chip, tocCount: cnt };
  });
}

function buildVendors() {
  const wrap = $("#vendors");
  wrap.innerHTML = "";
  VENDORS.forEach((v) => {
    const sec = el("section", "vendor");
    sec.id = "sec-" + v.id;
    sec.style.setProperty("--v-bg", v.bg);
    sec.style.setProperty("--v-soft", v.soft);
    sec.style.setProperty("--v-line", v.line);
    sec.style.setProperty("--v-accent", v.accent);

    // 見出し
    const head = el("div", "vendor-head");
    const nameEl = el("span", "v-name");
    nameEl.textContent = v.name;
    const countBadge = el("span", "v-count zero");
    countBadge.textContent = "0品";
    head.appendChild(nameEl);
    head.appendChild(countBadge);
    sec.appendChild(head);

    // 食材行
    itemsByVendor(v.id).forEach((item) => sec.appendChild(buildItemRow(item, v)));

    // フッター：発注書を作る（プレビュー → 共有）
    const foot = el("div", "vendor-foot");
    const orderBtn = el("button", "order-btn");
    orderBtn.type = "button";
    orderBtn.textContent = "品目を入力してください";
    orderBtn.addEventListener("click", () => openPreview(v));
    foot.appendChild(orderBtn);
    sec.appendChild(foot);

    wrap.appendChild(sec);
    Object.assign(vendorEls[v.id], { section: sec, countBadge, orderBtn });
  });
}

function buildItemRow(item, vendor) {
  const row = el("div", "item");
  const main = el("div", "item-main");
  const nameEl = el("span", "item-name");
  nameEl.textContent = item.unit ? `${item.name}（${item.unit}）` : item.name;
  const guideEl = el("span", "item-guide");
  main.appendChild(nameEl);
  main.appendChild(guideEl);

  const stepper = el("div", "stepper");
  const minus = el("button", "step-btn minus");
  minus.type = "button";
  minus.textContent = "−";
  minus.setAttribute("aria-label", item.name + " を1減らす");

  const input = el("input", "qty-input");
  input.type = "text";
  input.inputMode = "numeric";
  input.setAttribute("pattern", "[0-9]*");
  input.setAttribute("aria-label", item.name + " の発注数");

  const plus = el("button", "step-btn plus");
  plus.type = "button";
  plus.textContent = "＋";
  plus.setAttribute("aria-label", item.name + " を1増やす");

  minus.addEventListener("click", () => safe(() => applyQty(item.id, getQty(item.id) - 1, false)));
  plus.addEventListener("click", () => safe(() => applyQty(item.id, getQty(item.id) + 1, false)));
  input.addEventListener("input", () =>
    safe(() => {
      const digits = input.value.replace(/[^0-9]/g, "");
      applyQty(item.id, digits === "" ? 0 : Number(digits), true);
    })
  );
  input.addEventListener("focus", () => input.select());
  input.addEventListener("blur", () =>
    safe(() => {
      input.value = String(getQty(item.id));
      refreshRowVisual(item.id);
    })
  );

  stepper.appendChild(minus);
  stepper.appendChild(input);
  stepper.appendChild(plus);
  row.appendChild(main);
  row.appendChild(stepper);

  refs[item.id] = { row, input, guide: guideEl };
  return row;
}

/* =========================================================================
 * 数量の操作
 * ========================================================================= */
function getQty(id) {
  return state.qty[id] || 0;
}
function applyQty(id, value, fromInput) {
  const v = clampQty(value);
  if (v <= 0) delete state.qty[id];
  else state.qty[id] = v;

  const ref = refs[id];
  if (ref && !fromInput) ref.input.value = String(v);
  refreshRowVisual(id);
  updateVendorCount(itemById[id].vendor);
  scheduleSave();
}
function refreshRowVisual(id) {
  const ref = refs[id];
  if (!ref) return;
  const v = getQty(id);
  ref.row.classList.toggle("active", v > 0);
  ref.input.classList.toggle("zero", v <= 0);
}
function updateVendorCount(vid) {
  const items = itemsByVendor(vid);
  const n = items.reduce((acc, it) => acc + (getQty(it.id) > 0 ? 1 : 0), 0);
  const v = vendorEls[vid];
  if (!v) return;
  if (v.countBadge) {
    v.countBadge.textContent = n + "品";
    v.countBadge.classList.toggle("zero", n === 0);
  }
  if (v.tocCount) {
    v.tocCount.textContent = String(n);
    v.tocCount.classList.toggle("zero", n === 0);
  }
  if (v.orderBtn) {
    v.orderBtn.textContent = n > 0 ? `📄 発注書を作る（${n}品）` : "品目を入力してください";
    v.orderBtn.disabled = n === 0;
  }
  updateGrandTotal();
}

function updateGrandTotal() {
  const elTotal = $("#grandTotal");
  if (!elTotal) return;
  let items = 0;
  let vendors = 0;
  VENDORS.forEach((v) => {
    const n = itemsByVendor(v.id).reduce((a, it) => a + (getQty(it.id) > 0 ? 1 : 0), 0);
    if (n > 0) {
      items += n;
      vendors += 1;
    }
  });
  elTotal.textContent =
    items > 0 ? `本日の発注：合計 ${items} 品 / ${vendors} 業者` : "本日の発注：まだ入力がありません";
  elTotal.classList.toggle("has-items", items > 0);
}
function refreshAllValues() {
  ITEMS.forEach((it) => {
    const ref = refs[it.id];
    if (ref) ref.input.value = String(getQty(it.id));
    refreshRowVisual(it.id);
  });
  VENDORS.forEach((v) => updateVendorCount(v.id));
  updateAllGuides();
}

/* ----- 目安（在庫の目安）の表示 ----- */
function updateItemGuide(id) {
  const ref = refs[id];
  if (!ref || !ref.guide) return;
  const v = getGuide(id);
  ref.guide.textContent = v != null ? `目安 ${v}` : "目安 —";
  ref.guide.classList.toggle("none", v == null);
}
function updateAllGuides() {
  ITEMS.forEach((it) => updateItemGuide(it.id));
}

function buildGuideSwitch() {
  const wrap = $("#guideSwitch");
  if (!wrap) return;
  wrap.innerHTML = "";
  const label = el("span", "guide-switch-label");
  label.textContent = "目安";
  const seg = el("div", "seg");
  GUIDE_MODES.forEach((m) => {
    const b = el("button", "seg-btn");
    b.type = "button";
    b.textContent = m.label;
    b.dataset.mode = m.id;
    b.setAttribute("aria-pressed", String(m.id === guideMode));
    if (m.id === guideMode) b.classList.add("active");
    b.addEventListener("click", () => safe(() => setGuideMode(m.id)));
    seg.appendChild(b);
  });
  wrap.appendChild(label);
  wrap.appendChild(seg);
}

function setGuideMode(mode) {
  if (!GUIDES[mode]) return;
  guideMode = mode;
  saveGuideMode();
  const seg = $("#guideSwitch");
  if (seg) {
    seg.querySelectorAll(".seg-btn").forEach((b) => {
      const on = b.dataset.mode === mode;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }
  updateAllGuides();
}

/* =========================================================================
 * PDF生成（業者ごと・端末内・共有シートへ）
 * ========================================================================= */
function orderedItems(vendor) {
  return itemsByVendor(vendor.id)
    .map((it) => ({ name: it.name, unit: it.unit, qty: getQty(it.id) }))
    .filter((it) => it.qty > 0);
}

function buildOrderFormHTML(vendor, list) {
  const rows = list
    .map(
      (it, i) => `
      <tr style="background:${i % 2 ? "#f3f3f3" : "#ffffff"};">
        <td style="border:1px solid #bbbbbb;padding:12px 4px;text-align:center;color:#999999;font-size:14px;">${i + 1}</td>
        <td style="border:1px solid #bbbbbb;padding:12px 16px;font-size:17px;">${escapeHtml(it.name)}</td>
        <td style="border:1px solid #bbbbbb;padding:12px 8px;text-align:center;font-size:22px;font-weight:800;line-height:1.1;">${it.qty}${
          it.unit ? `<span style="font-size:12px;font-weight:500;color:#555;"> ${escapeHtml(it.unit)}</span>` : ""
        }</td>
      </tr>`
    )
    .join("");

  const telLine = SHOP_TEL
    ? `<div style="font-size:13px;color:#333;margin-top:2px;">TEL：${escapeHtml(SHOP_TEL)}</div>`
    : "";

  return `
  <div class="order-form" style="width:680px;background:#fff;color:#1a1a1a;
       font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Yu Gothic',sans-serif;
       box-sizing:border-box;border:1px solid #bbbbbb;">
    <div style="height:6px;background:#1a1a1a;"></div>
    <div style="padding:34px 40px 38px;">

      <div style="text-align:center;margin-bottom:22px;">
        <span style="font-size:30px;font-weight:800;letter-spacing:0.5em;padding:0 4px 8px 24px;
              border-bottom:3px double #1a1a1a;">発注書</span>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:25px;font-weight:800;border-bottom:2px solid #1a1a1a;
               padding-bottom:7px;display:inline-block;">${escapeHtml(vendor.name)}　様</div>
          <div style="font-size:13px;color:#555;margin-top:14px;">発注日：${formatJp(state.orderDate)}</div>
        </div>
        <div style="flex:0 0 auto;border:1px solid #bbbbbb;border-radius:8px;padding:12px 16px;min-width:224px;">
          <div style="font-size:11px;color:#888888;letter-spacing:0.08em;">発注元</div>
          <div style="font-size:17px;font-weight:800;">${escapeHtml(SHOP_NAME)}</div>
          ${telLine}
          <div style="margin-top:9px;padding-top:9px;border-top:1px dashed #cccccc;">
            <div style="font-size:11px;color:#888888;letter-spacing:0.08em;">納品希望日</div>
            <div style="font-size:18px;font-weight:800;border-bottom:2px solid #1a1a1a;display:inline-block;padding-bottom:1px;">${formatJp(state.deliveryDate)}</div>
          </div>
        </div>
      </div>

      <div style="font-size:14px;margin-bottom:12px;">下記のとおり発注いたします。ご確認のほど、よろしくお願いいたします。</div>

      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#1a1a1a;color:#fff;">
            <th style="border:1px solid #1a1a1a;padding:11px 4px;width:46px;font-size:13px;font-weight:700;">No.</th>
            <th style="border:1px solid #1a1a1a;padding:11px 16px;text-align:left;font-size:14px;font-weight:700;">品名</th>
            <th style="border:1px solid #1a1a1a;padding:11px 8px;width:104px;font-size:14px;font-weight:700;">数量</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div style="text-align:right;font-size:15px;font-weight:800;margin-top:12px;">合計　${list.length} 品目</div>

      <div style="margin-top:22px;">
        <div style="font-size:11px;color:#888888;letter-spacing:0.08em;margin-bottom:5px;">備考</div>
        <div style="border:1px solid #bbbbbb;border-radius:8px;height:56px;"></div>
      </div>

      <div style="text-align:right;font-size:14px;margin-top:24px;">以上、よろしくお願いいたします。</div>
    </div>
  </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

async function generatePdf(vendor, btn) {
  const list = orderedItems(vendor);
  if (list.length === 0) {
    toast(`${vendor.name}：発注する品目がありません`);
    return;
  }
  if (btn) {
    btn.disabled = true;
    btn.dataset.label = btn.textContent;
    btn.textContent = "作成中…";
  }
  try {
    if (!window.jspdf || !window.html2canvas) {
      throw new Error("PDFライブラリが読み込まれていません");
    }
    const stage = $("#pdfStage");
    stage.innerHTML = buildOrderFormHTML(vendor, list);
    const node = stage.firstElementChild;

    const canvas = await window.html2canvas(node, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
    stage.innerHTML = "";

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;

    let imgW = usableW;
    let imgH = (canvas.height * imgW) / canvas.width;
    if (imgH > usableH) {
      imgH = usableH;
      imgW = (canvas.width * imgH) / canvas.height;
    }
    const x = (pageW - imgW) / 2;
    // PNG＋圧縮（可逆・文字くっきり・約60KB）。無圧縮だと約5MBになり共有が重いため必須。
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, margin, imgW, imgH, undefined, "FAST");

    const filename = `発注書_${vendor.name}_${state.orderDate}.pdf`;
    const blob = pdf.output("blob");
    return await sharePdf(blob, filename, vendor);
  } catch (e) {
    console.error("PDF生成エラー", e);
    toast("PDF作成に失敗しました。『テキストで送る』をお試しください。");
    return false;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = btn.dataset.label || "📄 発注書を作る";
    }
    $("#pdfStage").innerHTML = "";
  }
}

async function sharePdf(blob, filename, vendor) {
  const file = new File([blob], filename, { type: "application/pdf" });
  // 1) 共有シート（LINE・メール等）
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `発注書 ${vendor.name}`,
      });
      return "shared";
    } catch (e) {
      if (e && e.name === "AbortError") return "canceled"; // ユーザーが共有をキャンセル
      console.warn("共有に失敗→ダウンロードに切替", e);
    }
  }
  // 2) フォールバック：ダウンロード保存
  const url = URL.createObjectURL(blob);
  const a = el("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
  toast("PDFを保存しました");
  return "downloaded";
}

/* =========================================================================
 * テキストで共有（LINE貼り付け用・最も確実なフォールバック）
 * ========================================================================= */
function buildOrderText(vendor, list) {
  const lines = [];
  lines.push(`【発注書】${vendor.name} 御中`);
  lines.push(`発注元：${SHOP_NAME}`);
  lines.push(`発注日：${formatJp(state.orderDate)}`);
  lines.push(`納品希望日：${formatJp(state.deliveryDate)}`);
  lines.push("");
  list.forEach((it) => {
    lines.push(`・${it.name}　${it.qty}${it.unit ? it.unit : ""}`);
  });
  lines.push("");
  lines.push("よろしくお願いいたします。");
  return lines.join("\n");
}

async function shareText(vendor) {
  await safeAsync(async () => {
    const list = orderedItems(vendor);
    if (list.length === 0) {
      toast(`${vendor.name}：発注する品目がありません`);
      return;
    }
    const text = buildOrderText(vendor, list);
    if (navigator.share) {
      try {
        await navigator.share({ title: `発注書 ${vendor.name}`, text });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }
    // 共有APIが無い場合：クリップボードへコピー
    try {
      await navigator.clipboard.writeText(text);
      toast("コピーしました。LINEに貼り付けてください");
    } catch (e) {
      window.prompt("コピーしてLINEに貼り付けてください", text);
    }
  });
}

/* =========================================================================
 * 送信前プレビュー（この内容で送ります → 共有）
 * ========================================================================= */
let previewVendor = null;

function openPreview(vendor) {
  safe(() => {
    const list = orderedItems(vendor);
    if (list.length === 0) {
      toast(`${vendor.name}：発注する品目がありません`);
      return;
    }
    previewVendor = vendor;
    const frame = $("#previewFrame");
    frame.innerHTML = `<div class="pv-holder">${buildOrderFormHTML(vendor, list)}</div>`;
    const modal = $("#preview");
    modal.hidden = false;
    document.body.classList.add("modal-open");
    fitPreview(); // 同期（レイアウト確定）
    requestAnimationFrame(() => requestAnimationFrame(fitPreview)); // フォント反映後の保険
  });
}

function fitPreview() {
  const frame = $("#previewFrame");
  if (!frame) return;
  const form = frame.querySelector(".order-form");
  const holder = form && form.parentElement;
  if (!form || !holder) return;
  form.style.transform = "none";
  const avail = frame.clientWidth - 32; // 左右パディング分
  const scale = Math.min(1, avail / 680);
  form.style.transformOrigin = "top left";
  form.style.transform = `scale(${scale})`;
  holder.style.width = Math.round(680 * scale) + "px";
  holder.style.height = Math.round(form.offsetHeight * scale) + "px";
}

function closePreview() {
  const modal = $("#preview");
  if (modal) modal.hidden = true;
  document.body.classList.remove("modal-open");
  previewVendor = null;
}

/* =========================================================================
 * 本日分クリア
 * ========================================================================= */
function clearToday() {
  safe(() => {
    const n = ITEMS.reduce((a, it) => a + (getQty(it.id) > 0 ? 1 : 0), 0);
    if (n === 0) {
      toast("入力はありません");
      return;
    }
    if (!window.confirm("本日分の発注数をすべて 0 に戻します。よろしいですか？")) return;
    state.qty = {};
    refreshAllValues();
    saveNow();
    toast("本日分をクリアしました");
  });
}

/* =========================================================================
 * 日付の切り替わり（翌日になったら新しい発注へ）
 * ========================================================================= */
function checkDateRollover() {
  const t = todayYmd();
  if (t === sessionDate) return;
  saveNow(); // 念のため前日分を保存
  sessionDate = t;
  state = loadState(sessionDate);
  $("#orderDate").value = state.orderDate;
  $("#deliveryDate").value = state.deliveryDate;
  refreshAllValues();
  setSaveStatus("saved");
  toast("日付が変わりました。新しい発注を開始します");
}

/* =========================================================================
 * 補助：トースト・current目次・エラー保護
 * ========================================================================= */
let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

function safe(fn) {
  try {
    return fn();
  } catch (e) {
    console.error(e);
    toast("エラーが発生しました（データは保持されています）");
  }
}
async function safeAsync(fn) {
  try {
    return await fn();
  } catch (e) {
    console.error(e);
    toast("エラーが発生しました（データは保持されています）");
  }
}

function setupTocHighlight() {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id.replace("sec-", "");
        const chip = vendorEls[id] && vendorEls[id].tocChip;
        if (chip && entry.isIntersecting) {
          Object.values(vendorEls).forEach((v) => v.tocChip && v.tocChip.classList.remove("current"));
          chip.classList.add("current");
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
  );
  VENDORS.forEach((v) => {
    const sec = vendorEls[v.id] && vendorEls[v.id].section;
    if (sec) io.observe(sec);
  });
}

function updateTocHeightVar() {
  const bar = $("#topbar");
  if (bar) document.documentElement.style.setProperty("--toc-h", bar.offsetHeight + "px");
}

/* =========================================================================
 * 初期化
 * ========================================================================= */
function init() {
  sessionDate = todayYmd();
  state = loadState(sessionDate);
  guideMode = loadGuideMode();

  buildUI();
  refreshAllValues();
  setSaveStatus("saved");
  updateTocHeightVar();
  setupTocHighlight();

  // 日付入力
  $("#orderDate").addEventListener("change", (e) =>
    safe(() => {
      state.orderDate = e.target.value || todayYmd();
      scheduleSave();
    })
  );
  $("#deliveryDate").addEventListener("change", (e) =>
    safe(() => {
      state.deliveryDate = e.target.value || "";
      scheduleSave();
    })
  );

  // クリア
  $("#clearBtn").addEventListener("click", clearToday);

  // プレビュー（送信前確認）
  $("#previewClose").addEventListener("click", closePreview);
  $("#previewBackdrop").addEventListener("click", closePreview);
  $("#previewText").addEventListener("click", () =>
    safe(() => {
      if (previewVendor) shareText(previewVendor);
    })
  );
  $("#previewShare").addEventListener("click", () =>
    safeAsync(async () => {
      if (!previewVendor) return;
      const result = await generatePdf(previewVendor, $("#previewShare"));
      if (result && result !== "canceled") closePreview();
    })
  );

  // 目次へ戻る
  const toTop = $("#toTopBtn");
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener(
    "scroll",
    () => {
      toTop.hidden = window.scrollY < 320;
    },
    { passive: true }
  );

  // 復帰時：日付切替チェック＋レイアウト再計算
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkDateRollover();
  });
  window.addEventListener("focus", checkDateRollover);
  window.addEventListener("resize", () => {
    updateTocHeightVar();
    const modal = $("#preview");
    if (modal && !modal.hidden) fitPreview();
  });

  // 想定外エラーでも画面を壊さない（リロードしない）
  window.addEventListener("error", (e) => {
    console.error("global error", e.error || e.message);
  });
  window.addEventListener("unhandledrejection", (e) => {
    console.error("unhandled rejection", e.reason);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
