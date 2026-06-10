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

/* ===== 設定：お店の名前 ===== */
const SHOP_NAME = "テジュン食堂";

/* ===== 設定：業者（上から表示順・色は薄め） ===== */
const VENDORS = [
  { id: "yaoya",   name: "八百屋",   bg: "#eaf6ec", soft: "#f2faf4", line: "#cfe7d4", accent: "#3f9c52" }, // 薄緑
  { id: "kankoku", name: "韓国食材", bg: "#fdecec", soft: "#fdf3f3", line: "#f3d2d2", accent: "#d9534f" }, // 薄赤
  { id: "narita",  name: "成田さん", bg: "#eaf1fb", soft: "#f3f7fd", line: "#d2e0f3", accent: "#3f72b5" }, // 薄青
  { id: "sakatsu", name: "サカツ",   bg: "#fff7df", soft: "#fffbee", line: "#f0e3b8", accent: "#b78a14" }, // 薄黄
  { id: "askul",   name: "アスクル", bg: "#f1f2f3", soft: "#f7f8f8", line: "#dddfe1", accent: "#6c757d" }, // 薄グレー
];

/* ===== 設定：食材 ===== */
const ITEMS = [
  // 八百屋
  { id: "shimeji",   name: "しめじ",   vendor: "yaoya",   unit: "" },
  { id: "enoki",     name: "えのき",   vendor: "yaoya",   unit: "" },
  { id: "daikon",    name: "大根",     vendor: "yaoya",   unit: "" },
  { id: "nira",      name: "ニラ",     vendor: "yaoya",   unit: "" },
  { id: "negi",      name: "ネギ",     vendor: "yaoya",   unit: "" },
  { id: "tamanegi",  name: "玉ねぎ",   vendor: "yaoya",   unit: "" },
  // 韓国食材
  { id: "tteok",     name: "トッポギ", vendor: "kankoku", unit: "" },
  { id: "kimchi",    name: "キムチ",   vendor: "kankoku", unit: "" },
  { id: "harusame",  name: "春雨",     vendor: "kankoku", unit: "" },
  // 成田さん
  { id: "baniku",    name: "馬肉",     vendor: "narita",  unit: "" },
  // サカツ
  { id: "sake",      name: "酒類",     vendor: "sakatsu", unit: "" },
  // アスクル
  { id: "paper",     name: "ペーパー類", vendor: "askul", unit: "" },
];

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

    // フッター（PDF・テキスト）
    const foot = el("div", "vendor-foot");
    const pdfBtn = el("button", "pdf-btn");
    pdfBtn.type = "button";
    pdfBtn.textContent = "📄 PDF出力";
    pdfBtn.addEventListener("click", () => generatePdf(v, pdfBtn));
    const textBtn = el("button", "text-btn");
    textBtn.type = "button";
    textBtn.textContent = "テキスト";
    textBtn.addEventListener("click", () => shareText(v));
    foot.appendChild(pdfBtn);
    foot.appendChild(textBtn);
    sec.appendChild(foot);

    wrap.appendChild(sec);
    Object.assign(vendorEls[v.id], { section: sec, countBadge });
  });
}

function buildItemRow(item, vendor) {
  const row = el("div", "item");
  const nameEl = el("span", "item-name");
  nameEl.textContent = item.unit ? `${item.name}（${item.unit}）` : item.name;

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
  row.appendChild(nameEl);
  row.appendChild(stepper);

  refs[item.id] = { row, input };
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
}
function refreshAllValues() {
  ITEMS.forEach((it) => {
    const ref = refs[it.id];
    if (ref) ref.input.value = String(getQty(it.id));
    refreshRowVisual(it.id);
  });
  VENDORS.forEach((v) => updateVendorCount(v.id));
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
      (it) => `
      <tr>
        <td style="border:1px solid #333;padding:11px 14px;font-size:17px;">${escapeHtml(it.name)}</td>
        <td style="border:1px solid #333;padding:11px 14px;font-size:18px;font-weight:700;text-align:center;width:96px;">
          ${it.qty}${it.unit ? `<span style="font-size:12px;font-weight:400;"> ${escapeHtml(it.unit)}</span>` : ""}
        </td>
      </tr>`
    )
    .join("");

  return `
  <div style="width:680px;padding:34px 38px;background:#fff;color:#111;
              font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Yu Gothic',sans-serif;
              box-sizing:border-box;">
    <div style="text-align:center;font-size:28px;font-weight:800;letter-spacing:0.34em;margin-bottom:22px;">発 注 書</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:18px;gap:16px;">
      <div style="font-size:23px;font-weight:800;border-bottom:2px solid #111;padding:0 8px 5px 2px;">
        ${escapeHtml(vendor.name)}　御中
      </div>
      <div style="font-size:13.5px;text-align:right;line-height:1.85;white-space:nowrap;">
        <div>発注元：${escapeHtml(SHOP_NAME)}</div>
        <div>発注日：${formatJp(state.orderDate)}</div>
        <div>納品希望日：${formatJp(state.deliveryDate)}</div>
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="border:1px solid #333;padding:9px 14px;background:#eee;font-size:14px;text-align:left;">品名</th>
          <th style="border:1px solid #333;padding:9px 14px;background:#eee;font-size:14px;text-align:center;width:96px;">数量</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:16px;font-size:13px;color:#444;">合計 ${list.length} 品目</div>
    <div style="margin-top:30px;font-size:15px;">以上、よろしくお願いいたします。</div>
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
    await sharePdf(blob, filename, vendor);
  } catch (e) {
    console.error("PDF生成エラー", e);
    toast("PDF作成に失敗しました。『テキスト』で送れます。");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = btn.dataset.label || "📄 PDF出力";
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
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return; // ユーザーが共有をキャンセル
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
  window.addEventListener("resize", updateTocHeightVar);

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
