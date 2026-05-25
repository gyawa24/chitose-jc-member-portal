# 千歳青年会議所 メンバーポータル PWA

千歳JCメンバーがスマートフォンからすぐ使える、引き継ぎ前提のポータル試作です。
Google Sitesで整理した内容を元に、PWAとしてホーム画面追加、スマホ下部ナビ、リンク検索、オフライン表示に対応しています。

## 方針

- 認証情報、パスワード、Cookie、トークンは保存しません。
- 外部資料の本文や画像は転載せず、短い説明文とリンクだけを掲載します。
- 4月AI例会コンテンツは既存Google Sitesに残し、このPWAからリンクします。
- 毎年の引き継ぎを優先し、画面コードと掲載データを分けています。

## ファイル構成

- `AGENTS.md`: 次の自動化エージェントや開発者への作業指示。
- `Design.md`: UI/UXとデザイン方針。
- `index.html`: アプリ本体の入口。
- `styles.css`: 見た目とスマホ/PC表示。
- `app.js`: ページ切り替え、検索、PWA追加ボタン。
- `data/portal-data.json`: 掲載するページ、説明文、リンク。通常の更新はここを編集します。
- `data/link-inventory.csv`: リンク台帳。年度更新や担当者確認に使います。
- `manifest.webmanifest`: PWA名、アイコン、ホーム画面追加の設定。
- `sw.js`: オフライン表示用のキャッシュ設定。
- `docs/handover-guide.md`: 次年度担当者向けの引き継ぎ手順。
- `docs/annual-update-checklist.md`: 年度更新時のチェックリスト。
- `docs/content-management.md`: コンテンツ管理ルール。
- `docs/operations-runbook.md`: 通常運用、公開前確認、障害時対応。
- `docs/decision-log.md`: 重要な判断の記録。
- `docs/publishing-options.md`: 公開先候補の整理。

## 更新方法

リンクや説明文を直すだけなら、`data/portal-data.json` を編集します。
ログインIDやパスワードは絶対に書き込まないでください。

## 確認方法

`pwa-portal/` で次を実行します。

```bash
npm run check
```

ローカルで見る場合は次です。

```bash
npm run serve
```

ブラウザで `http://127.0.0.1:4177/` を開きます。

## 公開候補

- GitHub Pages
- Vercel
- Netlify
- Firebase Hosting

Google Sheetsを更新元にしたい場合は、次の段階で `data/portal-data.json` をGoogle Sheetsから生成する仕組みにできます。

## GitHub Pages

このプロトタイプはGitHub Pagesで公開できる静的PWAです。
詳しくは `docs/github-pages.md` を参照してください。

- リポジトリ: https://github.com/gyawa24/chitose-jc-member-portal
- 公開URL: https://gyawa24.github.io/chitose-jc-member-portal/
