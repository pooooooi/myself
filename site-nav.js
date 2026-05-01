const PAGE_LABELS = {
  ja: {
    app: "Self Map",
    articles: "読みもの",
    about: "About",
    guide: "使い方",
    examples: "例",
    smallAction: "小さく動く",
    development: "設計メモ",
    privacy: "Privacy",
    back: "← 1つ前へ",
  },
  en: {
    app: "Self Map",
    articles: "Articles",
    about: "About",
    guide: "Guide",
    examples: "Examples",
    smallAction: "Small actions",
    development: "Design notes",
    privacy: "Privacy",
    back: "← Back",
  },
  zh: {
    app: "Self Map",
    articles: "文章",
    about: "关于",
    guide: "用法",
    examples: "例子",
    smallAction: "小行动",
    development: "设计笔记",
    privacy: "隐私",
    back: "← 返回上一页",
  },
};

const PAGE_GROUPS = [
  { pattern: /^article-/, key: "articles", href: { ja: "articles.html", en: "articles-en.html", zh: "articles-zh.html" } },
  { pattern: /^articles/, key: "articles", href: { ja: "articles.html", en: "articles-en.html", zh: "articles-zh.html" } },
  { pattern: /^about/, key: "about", href: { ja: "about.html", en: "about-en.html", zh: "about-zh.html" } },
  { pattern: /^guide/, key: "guide", href: { ja: "guide.html", en: "guide-en.html", zh: "guide-zh.html" } },
  { pattern: /^examples/, key: "examples", href: { ja: "examples.html", en: "examples-en.html", zh: "examples-zh.html" } },
  { pattern: /^small-action/, key: "smallAction", href: { ja: "small-action.html", en: "small-action-en.html", zh: "small-action-zh.html" } },
  { pattern: /^development-notes/, key: "development", href: { ja: "development-notes.html", en: "development-notes-en.html", zh: "development-notes-zh.html" } },
  { pattern: /^privacy/, key: "privacy", href: { ja: "privacy.html", en: "privacy-en.html", zh: "privacy-zh.html" } },
];

function getPageLanguage() {
  const lang = document.documentElement.lang || "ja";
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("en")) return "en";
  return "ja";
}

function getCurrentFile() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function findPageGroup(file) {
  return PAGE_GROUPS.find((group) => group.pattern.test(file)) || null;
}

function createTrailLink(href, text) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = text;
  return link;
}

function createSeparator() {
  const separator = document.createElement("span");
  separator.textContent = ">";
  separator.setAttribute("aria-hidden", "true");
  return separator;
}

function buildPageTrail(lang, group, currentTitle) {
  const labels = PAGE_LABELS[lang];
  const trail = document.createElement("div");
  trail.className = "page-trail";
  trail.setAttribute("aria-label", lang === "ja" ? "現在位置" : lang === "zh" ? "当前位置" : "Current location");

  trail.append(
    createTrailLink("index.html", labels.app),
    createSeparator(),
  );

  if (group) {
    const groupHref = group.href[lang] || group.href.ja;
    const groupLabel = labels[group.key] || labels.app;
    const isGroupPage = getCurrentFile() === groupHref;
    if (isGroupPage) {
      const current = document.createElement("strong");
      current.textContent = groupLabel;
      trail.append(current);
      return trail;
    }
    trail.append(createTrailLink(groupHref, groupLabel), createSeparator());
  }

  const current = document.createElement("strong");
  current.textContent = currentTitle;
  trail.append(current);
  return trail;
}

function buildBackButton(lang, group) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "page-back";
  button.textContent = PAGE_LABELS[lang].back;
  button.addEventListener("click", () => {
    const referrer = document.referrer ? new URL(document.referrer) : null;
    const cameFromSameSite = referrer?.origin === window.location.origin;
    if (window.history.length > 1 && cameFromSameSite) {
      window.history.back();
      return;
    }
    window.location.href = group?.href?.[lang] || "index.html";
  });
  return button;
}

function enhanceContentNavigation() {
  const header = document.querySelector(".content-hero, .legal-header");
  if (!header || header.querySelector(".page-trail")) return;

  const lang = getPageLanguage();
  const file = getCurrentFile();
  if (file === "index.html") return;

  const group = findPageGroup(file);
  const currentTitle = header.querySelector("h1")?.textContent?.trim() || document.title || PAGE_LABELS[lang].app;
  const nav = header.querySelector("nav");
  const anchor = nav || header.firstElementChild;
  const trailRow = document.createElement("div");
  trailRow.className = "page-nav-row";
  trailRow.append(buildPageTrail(lang, group, currentTitle), buildBackButton(lang, group));

  if (anchor) {
    anchor.after(trailRow);
    return;
  }
  header.prepend(trailRow);
}

enhanceContentNavigation();
