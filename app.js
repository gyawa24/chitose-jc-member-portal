const iconPaths = {
  home: "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zm2 14h13",
  check: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  folder: "M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z",
  archive: "M4 4h16v4H4V4zm2 4v12h12V8M10 12h4",
  link: "M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11 4.93M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 19.07",
  external: "M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5",
  chevron: "M9 18l6-6-6-6",
  search: "M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
  download: "M12 3v12M7 10l5 5 5-5M5 21h14",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6",
  warning: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
};

const state = {
  data: null,
  pageId: "home",
  query: "",
  deferredInstallPrompt: null,
};

const pageMount = document.querySelector("#pageMount");
const bottomNav = document.querySelector("#bottomNav");
const desktopNav = document.querySelector("#desktopNav");
const searchInput = document.querySelector("#searchInput");
const installButton = document.querySelector("#installButton");
const appFooter = document.querySelector("#appFooter");

function icon(name) {
  const path = iconPaths[name] || iconPaths.link;
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="${path}"></path>
    </svg>
  `;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderIconSpans() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = icon(node.dataset.icon);
  });
}

function getPageIdFromHash() {
  return window.location.hash.replace(/^#/, "") || "home";
}

function setPage(pageId) {
  const exists = state.data?.pages?.[pageId];
  state.pageId = exists ? pageId : "home";
  render();
}

function navMarkup(mode = "bottom") {
  const items = state.data.navigation.filter((item) => (mode === "bottom" ? item.primary !== false : true));
  const links = items
    .map(
      (item) => `
        <a class="nav-link ${item.id === state.pageId ? "is-active" : ""}" href="#${escapeHtml(item.id)}">
          ${icon(item.icon)}
          <span>${escapeHtml(item.shortLabel || item.label)}</span>
        </a>
      `,
    )
    .join("");
  return mode === "desktop" ? `<div class="desktop-nav">${links}</div>` : links;
}

function cardMeta(item) {
  const chips = [];
  if (item.kind) chips.push(`<span class="chip">${escapeHtml(item.kind)}</span>`);
  if (item.status) chips.push(`<span class="chip warning">${escapeHtml(item.status)}</span>`);
  return chips.length ? `<div class="card-meta">${chips.join("")}</div>` : "";
}

function linkTarget(item) {
  if (item.pageId) return `#${item.pageId}`;
  return item.url || "#";
}

function cardMarkup(item, variant = "link-card") {
  const external = item.url && !item.pageId;
  const colorClass = item.color || "";
  const target = linkTarget(item);
  return `
    <a class="${variant}" href="${escapeHtml(target)}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}>
      <span class="icon-tile ${escapeHtml(colorClass)}">${icon(item.icon || (external ? "external" : "link"))}</span>
      <span class="card-body">
        <span class="card-title">${escapeHtml(item.title)}</span>
        <span class="card-desc">${escapeHtml(item.description || "")}</span>
        ${cardMeta(item)}
      </span>
      <span class="chevron">${icon(external ? "external" : "chevron")}</span>
    </a>
  `;
}

function cardsBlock(block) {
  const density = block.columns === 3 ? " three" : "";
  return `
    <section class="section">
      ${sectionHeader(block)}
      <div class="card-grid${density}">
        ${block.items.map((item) => cardMarkup(item, block.variant || "link-card")).join("")}
      </div>
    </section>
  `;
}

function listBlock(block) {
  return `
    <section class="section">
      ${sectionHeader(block)}
      <div class="list-panel">
        <ul class="plain-list">
          ${block.items
            .map(
              (item) => `
                <li>
                  <span class="bullet">${icon(item.icon || "check")}</span>
                  <span>${escapeHtml(item.text || item)}</span>
                </li>
              `,
            )
            .join("")}
        </ul>
      </div>
    </section>
  `;
}

function stepsBlock(block) {
  return `
    <section class="section">
      ${sectionHeader(block)}
      <div class="steps-panel">
        <ol class="steps-list">
          ${block.items
            .map(
              (item, index) => `
                <li>
                  <span class="step-no">${index + 1}</span>
                  <span>${escapeHtml(item)}</span>
                </li>
              `,
            )
            .join("")}
        </ol>
      </div>
    </section>
  `;
}

function rulesBlock(block) {
  return `
    <section class="section">
      ${sectionHeader(block)}
      <div class="rules-panel">
        <ul class="rules-list">
          ${block.items
            .map(
              (item) => `
                <li>
                  <span class="rule-label">${escapeHtml(item.label)}</span>
                  <span>${escapeHtml(item.description)}</span>
                </li>
              `,
            )
            .join("")}
        </ul>
      </div>
    </section>
  `;
}

function noteBlock(block) {
  return `
    <section class="section">
      <div class="note-card">
        <h3>${escapeHtml(block.title)}</h3>
        <p>${escapeHtml(block.text)}</p>
      </div>
    </section>
  `;
}

function sectionHeader(block) {
  return `
    <div class="section-header">
      <div>
        <h2 class="section-title">${escapeHtml(block.title)}</h2>
        ${block.note ? `<p class="section-note">${escapeHtml(block.note)}</p>` : ""}
      </div>
    </div>
  `;
}

function blockMarkup(block) {
  if (block.type === "cards") return cardsBlock(block);
  if (block.type === "list") return listBlock(block);
  if (block.type === "steps") return stepsBlock(block);
  if (block.type === "rules") return rulesBlock(block);
  if (block.type === "note") return noteBlock(block);
  return "";
}

function pageHero(page) {
  return `
    <section class="page-hero">
      <p class="page-eyebrow">${escapeHtml(page.kicker || state.data.site.kicker)}</p>
      <h1 class="page-title">${escapeHtml(page.title)}</h1>
      <p class="page-lead">${escapeHtml(page.lead)}</p>
      ${
        page.body?.length
          ? `<div class="body-copy">${page.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>`
          : ""
      }
    </section>
  `;
}

function flattenSearchItems() {
  const pages = Object.entries(state.data.pages).map(([id, page]) => ({
    pageId: id,
    title: page.title,
    description: page.lead,
    icon: state.data.navigation.find((item) => item.id === id)?.icon || "link",
    kind: "ページ",
  }));

  const blockItems = Object.values(state.data.pages).flatMap((page) =>
    (page.blocks || [])
      .filter((block) => block.type === "cards")
      .flatMap((block) => block.items.map((item) => ({ ...item, kind: item.kind || block.title }))),
  );

  return [...pages, ...state.data.featuredLinks, ...blockItems];
}

function renderSearchResults(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return "";

  const results = flattenSearchItems()
    .filter((item) =>
      [item.title, item.description, item.kind, item.url]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    )
    .slice(0, 18);

  return `
    <section class="section">
      <div class="section-header">
        <div>
          <h2 class="section-title">検索結果</h2>
          <p class="section-note">${results.length}件</p>
        </div>
      </div>
      <div class="card-grid">
        ${
          results.length
            ? results.map((item) => cardMarkup(item)).join("")
            : `<div class="note-card"><h3>見つかりませんでした</h3><p>別の言葉で検索してください。</p></div>`
        }
      </div>
    </section>
  `;
}

function renderFooter() {
  const updatedAt = state.data.updatedAt || "未設定";
  appFooter.innerHTML = `
    <p>最終更新: ${escapeHtml(updatedAt)}</p>
    <p>資料の本文や認証情報は掲載せず、必要な場所への入口として運用します。</p>
  `;
}

function render() {
  if (!state.data) return;
  const page = state.data.pages[state.pageId] || state.data.pages.home;
  bottomNav.innerHTML = navMarkup("bottom");
  desktopNav.innerHTML = navMarkup("desktop");

  const featuredBlock =
    state.pageId === "home"
      ? cardsBlock({
          title: "重要リンク",
          note: "日常業務でよく使うリンクです",
          type: "cards",
          items: state.data.featuredLinks,
        })
      : "";

  pageMount.innerHTML = `
    ${renderSearchResults(state.query)}
    ${state.query.trim() ? "" : pageHero(page)}
    ${state.query.trim() ? "" : featuredBlock}
    ${state.query.trim() ? "" : (page.blocks || []).map(blockMarkup).join("")}
  `;
  renderFooter();
  renderIconSpans();
}

async function loadData() {
  pageMount.append(document.querySelector("#loadingTemplate").content.cloneNode(true));
  const response = await fetch("./data/portal-data.json", { cache: "no-store" });
  state.data = await response.json();
  setPage(getPageIdFromHash());
}

window.addEventListener("hashchange", () => {
  setPage(getPageIdFromHash());
  window.scrollTo({ top: 0, behavior: "smooth" });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!state.deferredInstallPrompt) return;
  state.deferredInstallPrompt.prompt();
  await state.deferredInstallPrompt.userChoice;
  state.deferredInstallPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

loadData().catch(() => {
  pageMount.innerHTML = `
    <section class="empty-state">
      <h1 class="page-title">読み込みできませんでした</h1>
      <p class="page-lead">通信状態を確認して、もう一度開いてください。</p>
    </section>
  `;
});
