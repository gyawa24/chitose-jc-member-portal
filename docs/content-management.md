# コンテンツ管理ルール

## 基本

このPWAでは、リンク先の資料そのものを保管しません。
Google Drive、Google Sheets、Google Sites、外部公式サイトへの入口を整理します。

## 通常更新

通常は `data/portal-data.json` を編集します。
編集前に `data/link-inventory.csv` を見ると、どのリンクを誰が確認するか分かります。

## Google Sheets管理へ移行する場合

将来的に、`data/link-inventory.csv` と同じ列構成でGoogle Sheetsを作ると、担当者がブラウザ上で更新できるようになります。

推奨列:

- page
- category
- title
- url
- status
- owner
- updateTiming
- notes

まずはGoogle Sheetsを「編集できる人だけ」に限定し、PWAへ公開するデータには認証情報を含めない運用にしてください。

## 情報の置き場所

- PWA: 入口、説明、検索、スマホ導線
- Google Sites: 例会アーカイブ、長い説明、デモコンテンツ
- Google Drive: 議事録、議案、事業資料、マニュアル
- Google Sheets: 出欠、発番、リンク一覧

## 迷ったときの判断

メンバーが毎月開くものはPWAの上部に置きます。
年に数回見るものは各カテゴリページに置きます。
説明が長いもの、画像や埋め込みが多いものはGoogle Sitesに残します。
