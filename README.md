# 概要
Azure AIデモです。
Azure OpenAIやAzure Cognitive Servicesを利用して、注文のデモを含め、またそのサービスについてデモを含めています。

# 事前準備
- Azure Developer CLIのインストール
- Node.jsのインストール
- Azure OpenAIの利用申請

# セットアップ

```code
azd up
```
このコマンドでインフラとアプリケーションをデプロイします。

# ローカル環境
.env.exampleを参考に.env.localを作成してください。

# クラウド環境
App Serviceの構成情報にenvの情報を格納します。


# 課題
- [] デプロイ時に、Azure Cognitive Servicesの認証情報を設定する
- [] 様々な検証結果が雑に含まれるためTODO:の内容を含めたリファクタリングやバグ修正。特にブラウザにキーが露出するのは良くないのでサーバー側に移す
