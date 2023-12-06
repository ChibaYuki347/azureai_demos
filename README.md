# 概要

Azure AIデモです。
Azure OpenAIやAzure Cognitive Servicesを利用して、注文のデモを含め、またそのサービスについてデモを含めています。

# 事前準備

- [Azure Developer CLIのインストール](https://learn.microsoft.com/ja-jp/azure/developer/azure-developer-cli/install-azd)
- [Node.jsのインストール](https://nodejs.org/en)
- [Azure OpenAIの利用申請](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUNTZBNzRKNlVQSFhZMU9aV09EVzYxWFdORCQlQCN0PWcu)

# プロジェクト構造

ReactのWebフレームワークであるNext.js(Version14)のApp Routerを使用しています。

Next.jsではサーバーサイドの実装、フロントエンドの実装を１つのフレームワーク内で実現可能です。

WebのUI,API,サーバーアクション（Version14以降正式機能）といったバックエンド、フロントエンドの挙動を１つのフレームワークで実装可能のため採用しています。

基本的にフォルダベースのルーティングを実現できるため、フォルダベースでルーティングを管理できます。
例えば`app/services/openai-chat/page.tsx`は
`localhost:3000/services/openai-chat`というルーティングに対応します。

参考情報として、`app/(home)/services/openai-chat`における
`(home)`はルートグループといってURLには反映されないがその中で論理的にまとめるものになります。ルートグループで人間がわかりやすいようにまとめたり独自のレイアウトの管理が可能です。

従って`app/(home)/services/openai-chat/page.tsx`の内容は
`app/services/openai-chat/page.tsx`と変わらない
`localhost:3000/services/openai-chat`というルーティングに対応しています。

# セットアップ

```bash
azd up
```

インフラだけ整備したい場合は

```bash
azd provision
```

コードのデプロイだけをしたい場合は

```bash
azd deploy
```

で実行可能です。

このコマンドでインフラとアプリケーションをデプロイします。

# ローカル環境

``.env.example`を参考に`.env.local`を作成してください。

その上でアプリケーションルートディレクトリで
`npm install`
`npm run dev`を実行すると起動できます。

記載例は下記のようになります。

`.env.local`

```
# Set this to `azure`
OPENAI_API_TYPE=azure
AZURE_OPENAI_API_INSTANCE_NAME=cog-f347sjzunr3li-openai
AZURE_OPENAI_API_DEPLOYMENT_NAME=chat
AZURE_OPENAI_API_KEY=241353c667924d54jh74c97fdf53f028

# SPEECH SERVICE
NEXT_PUBLIC_SPEECH_KEY=3162ed6ad8d149b98a1c497bf301bbfb
NEXT_PUBLIC_SPEECH_REGION=japaneast

```

# クラウド環境

App Serviceの構成情報にenvの情報を格納します。

# 各ユースケースの説明

[AI 商品注文について](./docs/ja/call-center-order.md)

# トラブルシューティング

追加予定

# 課題

- [] デプロイ時に、Azure Cognitive Servicesの認証情報を設定する
- [] 様々な検証結果が雑に含まれるためTODO:の内容を含めたリファクタリングやバグ修正。特にブラウザにキーが露出するのは良くないのでサーバー側に移す
- デプロイするとSpeechサービスについてWebソケットエラーが出ることの修正
