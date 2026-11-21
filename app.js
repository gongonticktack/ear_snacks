// 仕組みを基礎から（ITAIST） — /api/episodes から取得し、失敗時は Supabase REST へ直接フォールバック

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

init();
