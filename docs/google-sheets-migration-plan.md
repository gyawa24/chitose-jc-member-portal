# Google Sheets管理への移行案

## 目的

PWAのリンク一覧を、将来的にGoogle Sheetsで管理できるようにする。
これにより、コードを触らずに担当者がリンクを更新できます。

## 推奨シート構成

`data/link-inventory.csv` と同じ列を使います。

- page
- category
- title
- url
- status
- owner
- updateTiming
- notes

## 移行ステップ

1. Google Sheetsにリンク台帳を作る。
2. 編集権限を担当者に限定する。
3. 公開用データに含める列を決める。
4. 認証情報や非公開メモが公開データに混ざらないようにする。
5. PWA側でシート由来のJSONを読み込む。
6. 公開前にスマホ表示とリンクを確認する。

## 注意点

- シートをWeb公開する場合、公開範囲を必ず確認する。
- 管理用メモとPWA表示用データを同じ列に混ぜない。
- ログイン情報、個人情報、内部メモは公開用データに出さない。

## まずやるなら

最初はこのPWAの `data/portal-data.json` を手動更新で運用し、年度更新の負担が見えてからGoogle Sheets化するのが安全です。
