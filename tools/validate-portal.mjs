import fs from "node:fs";

const dataPath = new URL("../data/portal-data.json", import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const forbiddenPatterns = [
  /password/i,
  /pass\s*[:=]/i,
  /token/i,
  /cookie/i,
  /secret/i,
  /パスワード/,
  /暗証番号/,
  /ログインID/,
  /ログイン情報[:：]\s*\S+/,
];

const urls = [];
const issues = [];

function walk(value, path = "root") {
  if (typeof value === "string") {
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(value)) {
        issues.push(`${path}: 認証情報に見える文字列があります`);
      }
    }
    if (/^https?:\/\//.test(value)) urls.push({ path, url: value });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => walk(item, `${path}.${key}`));
  }
}

walk(data);

for (const [pageId, page] of Object.entries(data.pages || {})) {
  if (!page.title || !page.lead) {
    issues.push(`pages.${pageId}: title と lead を確認してください`);
  }
}

const navigationIds = new Set((data.navigation || []).map((item) => item.id));
for (const pageId of Object.keys(data.pages || {})) {
  if (!navigationIds.has(pageId)) {
    issues.push(`navigation: ${pageId} がナビゲーションにありません`);
  }
}

if (issues.length) {
  console.error("確認が必要です:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("PWAデータ確認 OK");
console.log(`ページ数: ${Object.keys(data.pages || {}).length}`);
console.log(`外部リンク数: ${urls.length}`);
