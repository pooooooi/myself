# Web 公開メモ

対象ドメイン: `infobeginer.com`

## こちらで準備したもの

- `CNAME`: GitHub Pages の独自ドメイン設定用
- `privacy.html`: Webで表示できるプライバシーポリシー
- `ads.txt`: AdSense 承認後に publisher ID を入れる場所
- `index.html`: OGP / canonical / privacy 導線を追加

## GitHub Pages 設定

GitHub のリポジトリ画面で以下を設定します。

1. `Settings` を開く
2. `Pages` を開く
3. Source を `Deploy from a branch` にする
4. Branch を `main`、Folder を `/ (root)` にする
5. Custom domain に `infobeginer.com` を入れる
6. DNS反映後に `Enforce HTTPS` を有効にする

## DNS 設定

ドメイン管理画面で以下を設定します。

### Apex domain

`infobeginer.com` 用に A レコードを4つ設定します。

```text
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

IPv6 に対応する場合は AAAA レコードも設定します。

```text
Type: AAAA
Name: @
Value: 2606:50c0:8000::153

Type: AAAA
Name: @
Value: 2606:50c0:8001::153

Type: AAAA
Name: @
Value: 2606:50c0:8002::153

Type: AAAA
Name: @
Value: 2606:50c0:8003::153
```

### www subdomain

```text
Type: CNAME
Name: www
Value: pooooooi.github.io
```

## 確認URL

- `https://infobeginer.com/`
- `https://infobeginer.com/privacy.html`
- `https://infobeginer.com/ads.txt`

## AdSense

AdSense の審査コードや publisher ID が出たら、以下を更新します。

- 審査用の `<script>`: `index.html` の `<head>` に追加
- `ads.txt`: `google.com, pub-xxxxxxxxxxxxxxxx, DIRECT, f08c47fec0942fa0` を追加

アプリの入力画面には、まず広告を置かない方針です。広告を入れる場合は、説明ページや記事ページ側から始めるのがおすすめです。

## Xserver を使う場合

既存の `infobeginer.com` をXserverで運用しているなら、以下の構成が扱いやすいです。

```text
app.infobeginer.com
  GitHub Pages の Self Map 本体。広告なし。

infobeginer.com/self-map/
  Xserver 側の説明ページ。広告あり。
```

このリポジトリで作った `guide.html`、`examples.html`、`small-action.html` は静的HTMLなので、Xserverへ置く場合も本文を流用できます。

広告を貼る場合は、まず説明ページや記事ページに限定します。Self Map 本体の入力画面には貼らない方針です。

