import fs from "node:fs";

const dataPath = new URL("../data/portal-data.json", import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const seen = new Set();
const urls = [];

function collect(value) {
  if (typeof value === "string" && /^https?:\/\//.test(value) && !seen.has(value)) {
    seen.add(value);
    urls.push(value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(collect);
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach(collect);
  }
}

async function request(url, method) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Chitose-JC-Portal-LinkCheck/1.0",
      },
    });
    return { ok: response.ok, status: response.status, finalUrl: response.url };
  } finally {
    clearTimeout(timeout);
  }
}

async function check(url) {
  try {
    let result = await request(url, "HEAD");
    if ([403, 405, 429].includes(result.status) || !result.ok) {
      result = await request(url, "GET");
    }
    return { url, ...result };
  } catch (error) {
    return { url, ok: false, status: "ERROR", error: error.name || String(error) };
  }
}

collect(data);

const results = [];
for (const url of urls) {
  results.push(await check(url));
}

const failures = results.filter((result) => !result.ok);
for (const result of results) {
  const mark = result.ok ? "OK" : "要確認";
  console.log(`${mark} ${result.status} ${result.url}`);
}

if (failures.length) {
  console.error(`リンク要確認: ${failures.length}件`);
  process.exit(1);
}

console.log(`リンク確認 OK: ${results.length}件`);
