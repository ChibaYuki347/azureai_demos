# 概要

Azure AIデモです。
Azure OpenAIやAzure Cognitive Servicesを利用して、注文のデモを含め、またそのサービスについてデモを含めています。

# 事前準備

- [Azure Developer CLIのインストール](https://learn.microsoft.com/ja-jp/azure/developer/azure-developer-cli/install-azd)
- [Node.jsのインストール](https://nodejs.org/en)
- [Azure OpenAIの利用申請](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUNTZBNzRKNlVQSFhZMU9aV09EVzYxWFdORCQlQCN0PWcu)

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

で実行可能

このコマンドでインフラとアプリケーションをデプロイします。

# ローカル環境

``.env.example`を参考に`.env.local`を作成してください。

その上で
`npm install`
`npm run dev`を実行すると起動できます。

# クラウド環境

App Serviceの構成情報にenvの情報を格納します。

# 各ユースケースの説明

[AI 商品注文について](./docs/ja/call-center-order.md)

# 課題

- [] デプロイ時に、Azure Cognitive Servicesの認証情報を設定する
- [] 様々な検証結果が雑に含まれるためTODO:の内容を含めたリファクタリングやバグ修正。特にブラウザにキーが露出するのは良くないのでサーバー側に移す
