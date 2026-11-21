// 仕組みを基礎から（ITAIST） — /api/episodes から取得し、失敗時は Supabase REST へ直接フォールバック

// カラーパレット（Color Hunt の人気パレットから選定、現行・他サイト使用分は除外）
// テーマは音声・夜・集中に合うクール系／深めの色を中心に系統がバラけるよう選んだ。
// colors: パレット本来の4色（ストライプ表示用、比重 41/26/18/15）
// vars:   役割（メイン/サブ/ライト/アクセント）と、パレットから導出した
//         背景・面・文字色。暗いパレットは暗背景＋明文字、明るいパレットは
//         明背景＋暗文字になるよう各パレットごとに定義する。
const PALETTES = [
  {
    name: "Plum Noir",
    colors: ["#200F21", "#5A1846", "#9C1D64", "#F8615A"],
    vars: {
      main: "#5A1846", sub: "#9C1D64", light: "#F8615A", accent: "#9C1D64",
      accentText: "#E88BB8",
      bg: "#180A18", surface: "#271228", surfaceMuted: "#331A34",
      text: "#F6EAF2", muted: "#C4A3BC", border: "#47264A",
      onMain: "#FFFFFF", headerSub: "#E3B7D4",
    },
  },
  {
    name: "Deep Space",
    colors: ["#070F2B", "#1B1A55", "#535C91", "#9290C3"],
    vars: {
      main: "#1B1A55", sub: "#535C91", light: "#9290C3", accent: "#535C91",
      accentText: "#B9B7DC",
      bg: "#070F2B", surface: "#171740", surfaceMuted: "#23234D",
      text: "#ECECF6", muted: "#A3A1C7", border: "#2E2E5C",
      onMain: "#FFFFFF", headerSub: "#9290C3",
    },
  },
  {
    name: "Violet Abyss",
    colors: ["#635985", "#443C68", "#393053", "#18122B"],
    vars: {
      main: "#393053", sub: "#635985", light: "#443C68", accent: "#635985",
      accentText: "#B3A6D9",
      bg: "#18122B", surface: "#241C40", surfaceMuted: "#2E2450",
      text: "#EFEAF8", muted: "#ADA3C9", border: "#3A2F5E",
      onMain: "#FFFFFF", headerSub: "#C4B9E2",
    },
  },
  {
    name: "Abyss Teal",
    colors: ["#040D12", "#183D3D", "#5C8374", "#93B1A6"],
    vars: {
      main: "#183D3D", sub: "#5C8374", light: "#93B1A6", accent: "#5C8374",
      accentText: "#93C4B2",
      bg: "#040D12", surface: "#0D2224", surfaceMuted: "#173638",
      text: "#E6F2EE", muted: "#93B1A6", border: "#23484A",
      onMain: "#FFFFFF", headerSub: "#93B1A6",
    },
  },
  {
    name: "Arctic Slate",
    colors: ["#27374D", "#526D82", "#9DB2BF", "#DDE6ED"],
    vars: {
      main: "#27374D", sub: "#526D82", light: "#DDE6ED", accent: "#526D82",
      accentText: "#3D5A74",
      bg: "#EDF1F5", surface: "#FFFFFF", surfaceMuted: "#DDE6ED",
      text: "#1E2C3E", muted: "#526D82", border: "#C3D0DB",
      onMain: "#FFFFFF", headerSub: "#C7D5E2",
    },
  },
  {
    name: "Ocean Depth",
    colors: ["#0A2647", "#144272", "#205295", "#2C74B3"],
    vars: {
      main: "#0A2647", sub: "#2C74B3", light: "#205295", accent: "#2C74B3",
      accentText: "#7FB0DE",
      bg: "#061A33", surface: "#0A2647", surfaceMuted: "#103763",
      text: "#E9F1F9", muted: "#9DB8D6", border: "#1D4470",
      onMain: "#FFFFFF", headerSub: "#A9C6E4",
    },
  },
  {
    name: "Lavender Haze",
    colors: ["#F4EEFF", "#DCD6F7", "#A6B1E1", "#424874"],
    vars: {
      main: "#424874", sub: "#7A6FC0", light: "#F4EEFF", accent: "#A6B1E1",
      accentText: "#5A4E9E",
      bg: "#F7F4FD", surface: "#FFFFFF", surfaceMuted: "#E9E2F7",
      text: "#2E2A4A", muted: "#6B6390", border: "#DCD6F7",
      onMain: "#FFFFFF", headerSub: "#D8D2F0",
    },
  },
  {
    name: "Neon Pulse",
    colors: ["#212121", "#323232", "#0D7377", "#14FFEC"],
    vars: {
      main: "#212121", sub: "#0D7377", light: "#323232", accent: "#14FFEC",
      accentText: "#14FFEC",
      bg: "#121212", surface: "#212121", surfaceMuted: "#2B2B2B",
      text: "#F0F0F0", muted: "#A8A8A8", border: "#3A3A3A",
      onMain: "#FFFFFF", headerSub: "#BDBDBD",
    },
  },
  {
    name: "Ultraviolet",
    colors: ["#000000", "#52057B", "#892CDC", "#BC6FF1"],
    vars: {
      main: "#52057B", sub: "#892CDC", light: "#BC6FF1", accent: "#BC6FF1",
      accentText: "#D3A1F5",
      bg: "#0D0214", surface: "#1D0730", surfaceMuted: "#2A0E42",
      text: "#F4EBFC", muted: "#BFA3D9", border: "#3B1660",
      onMain: "#FFFFFF", headerSub: "#D9BFF2",
    },
  },
  {
    name: "Mint Studio",
    colors: ["#E4F9F5", "#A6E3E9", "#71C9CE", "#11999E"],
    vars: {
      main: "#11999E", sub: "#71C9CE", light: "#E4F9F5", accent: "#71C9CE",
      accentText: "#0B7A7E",
      bg: "#F2FAF8", surface: "#FFFFFF", surfaceMuted: "#E0F2EE",
      text: "#173F3D", muted: "#527A76", border: "#C4E2DC",
      onMain: "#FFFFFF", headerSub: "#DFF5EF",
    },
  },
];

const PALETTE_VAR_KEYS = {
  main: "--main",
  sub: "--sub",
  light: "--light",
  accent: "--accent",
  accentText: "--accent-text",
  bg: "--bg",
  surface: "--surface",
  surfaceMuted: "--surface-muted",
  text: "--text",
  muted: "--muted",
  border: "--border",
  onMain: "--on-main",
  headerSub: "--header-sub",
};

function applyPalette(palette) {
  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(PALETTE_VAR_KEYS)) {
    root.style.setProperty(cssVar, palette.vars[key]);
  }
  // ストライプはパレット本来の4色をそのまま使う
  const stripe = document.querySelectorAll(".palette-stripe > span");
  stripe.forEach((span, i) => {
    if (palette.colors[i]) span.style.background = palette.colors[i];
  });
}

// パレットの4色ストライプ（41/26/18/15）サンプルを作る
function buildSwatch(colors) {
  const swatch = el("span", "palette-swatch");
  swatch.setAttribute("aria-hidden", "true");
  colors.forEach((c) => {
    const seg = document.createElement("span");
    seg.style.background = c;
    swatch.appendChild(seg);
  });
  return swatch;
}

function initPalette() {
  const dropdown = document.getElementById("palette-dropdown");
  const button = document.getElementById("palette-button");
  const menu = document.getElementById("palette-menu");
  const currentSwatch = document.getElementById("palette-current-swatch");
  const currentName = document.getElementById("palette-current-name");
  let current = -1;

  function renderMenu() {
    menu.innerHTML = "";
    PALETTES.forEach((p, i) => {
      const item = el("button", "palette-item");
      item.type = "button";
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", String(i === current));
      if (i === current) item.classList.add("is-selected");
      const head = el("span", "palette-item-head");
      head.appendChild(el("span", "palette-item-name", p.name));
      head.appendChild(
        el("span", "palette-item-check", i === current ? "✓" : "")
      );
      item.appendChild(head);
      item.appendChild(buildSwatch(p.colors));
      item.addEventListener("click", () => {
        select(i);
        closeMenu();
        button.focus();
      });
      menu.appendChild(item);
    });
  }

  function select(i) {
    current = i;
    try {
      sessionStorage.setItem("appPaletteIndex", String(i));
    } catch (e) {}
    applyPalette(PALETTES[i]);
    currentName.textContent = PALETTES[i].name;
    currentSwatch.querySelectorAll("span").forEach((seg, j) => {
      if (PALETTES[i].colors[j]) seg.style.background = PALETTES[i].colors[j];
    });
    renderMenu();
  }

  function openMenu() {
    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
  }

  button.addEventListener("click", () => {
    if (menu.hidden) openMenu();
    else closeMenu();
  });
  document.addEventListener("click", (e) => {
    if (!menu.hidden && !dropdown.contains(e.target)) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      closeMenu();
      button.focus();
    }
  });

  // パレットの決め方:
  // - 新規アクセス（外部から開いた）か、このページのリロードのときだけランダムに選び直す
  // - アプリ内移動では sessionStorage に保存した選択（手動変更含む）を引き継ぐ
  const navEntry = performance.getEntriesByType("navigation")[0];
  const navType = navEntry ? navEntry.type : "navigate";
  const fromSameApp =
    !!document.referrer && document.referrer.startsWith(location.origin);
  let savedPalette = null;
  try {
    savedPalette = sessionStorage.getItem("appPaletteIndex");
  } catch (e) {}
  if (navType === "reload" || !fromSameApp) savedPalette = null;
  const savedIndex =
    savedPalette === null ? NaN : parseInt(savedPalette, 10);
  if (
    Number.isInteger(savedIndex) &&
    savedIndex >= 0 &&
    savedIndex < PALETTES.length
  ) {
    select(savedIndex);
  } else {
    select(Math.floor(Math.random() * PALETTES.length));
  }
}
let allEpisodes = [];

async function fetchEpisodes() {
  try {
    const res = await fetch("/api/episodes");
    if (!res.ok) throw new Error("api " + res.status);
    return await res.json();
  } catch (e) {
    // フォールバック: config.json の Supabase REST を直接読む
    const cfgRes = await fetch("config.json");
    const cfg = await cfgRes.json();
    const url =
      cfg.supabase.url +
      "/rest/v1/podcast_episodes?select=*&order=number.desc";
    const res = await fetch(url, {
      headers: {
        apikey: cfg.supabase.key,
        authorization: "Bearer " + cfg.supabase.key,
        accept: "application/json",
      },
    });
    if (!res.ok) throw new Error("supabase " + res.status);
    return await res.json();
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function formatDuration(sec) {
  if (sec == null) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m + ":" + String(s).padStart(2, "0");
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function buildCard(ep) {
  const card = el("article", "card");

  const head = el("div", "card-head");
  head.appendChild(el("span", "ep-num", "第" + ep.number + "回"));
  const marks = el("div", "card-marks");
  if (ep.listened) marks.appendChild(el("span", "badge badge-listened", "✓ 聴いた"));
  if (ep.favorite) marks.appendChild(el("span", "badge badge-favorite", "★ お気に入り"));
  head.appendChild(marks);
  card.appendChild(head);

  card.appendChild(el("h3", "card-title", ep.title));

  const meta = el("div", "card-meta");
  const date = formatDate(ep.published_at);
  if (date) meta.appendChild(el("span", null, date));
  const dur = formatDuration(ep.duration_sec);
  if (dur) meta.appendChild(el("span", null, "再生時間 " + dur));
  card.appendChild(meta);

  if (ep.description) card.appendChild(el("p", "card-desc", ep.description));
  if (ep.memo) card.appendChild(el("p", "card-memo", ep.memo));

  if (ep.audio_url) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.src = ep.audio_url;
    audio.className = "card-audio";
    card.appendChild(audio);
  }
  return card;
}

function currentControls() {
  return {
    q: document.getElementById("search").value.trim().toLowerCase(),
    order: document.getElementById("sort-order").value,
  };
}

function matches(ep, q) {
  if (!q) return true;
  const hay = [ep.title, ep.description, ep.memo]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function render() {
  const { q, order } = currentControls();
  const shown = allEpisodes
    .filter((ep) => matches(ep, q))
    .sort((a, b) => (order === "asc" ? a.number - b.number : b.number - a.number));

  document.getElementById("count-shown").textContent = shown.length;

  const list = document.getElementById("episodes");
  list.innerHTML = "";
  for (const ep of shown) list.appendChild(buildCard(ep));

  const msg = document.getElementById("status-msg");
  if (shown.length === 0) {
    msg.textContent = "該当するエピソードがありません。";
    msg.hidden = false;
  } else {
    msg.hidden = true;
  }
}

function initSummary() {
  document.getElementById("count-total").textContent = allEpisodes.length;
  document.getElementById("count-listened").textContent = allEpisodes.filter(
    (ep) => ep.listened
  ).length;
}

async function init() {
  const msg = document.getElementById("status-msg");
  try {
    allEpisodes = await fetchEpisodes();
  } catch (e) {
    msg.textContent = "データの取得に失敗しました。";
    msg.hidden = false;
    return;
  }
  initSummary();
  render();

  document.getElementById("search").addEventListener("input", render);
  document.getElementById("sort-order").addEventListener("change", render);
}

initPalette();
init();
