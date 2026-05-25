# GitHub Pages公開メモ

## リポジトリ

想定リポジトリ名:

```text
chitose-jc-member-portal
```

リポジトリURL:

```text
https://github.com/gyawa24/chitose-jc-member-portal
```

## 公開方式

GitHub Pagesの `Deploy from a branch` を使い、`main` ブランチのルートを公開します。

このPWAは相対パスで作っているため、次のようなサブディレクトリURLでも動きます。

```text
https://gyawa24.github.io/chitose-jc-member-portal/
```

## 公開前に確認すること

```bash
npm run check
npm run links:check
```

## 更新の流れ

1. `data/portal-data.json` を編集する。
2. `data/link-inventory.csv` を必要に応じて更新する。
3. `npm run check` を実行する。
4. `npm run links:check` を実行する。
5. 変更をコミットして `main` にpushする。
6. GitHub Pagesの反映を待つ。

## 注意

- GitHub Pagesで公開した内容はインターネット上から閲覧できます。
- ログイン情報、パスワード、Cookie、トークン、個人情報は置かないでください。
- 実ファイルの閲覧権限はGoogle Drive/Sheets側で管理してください。
