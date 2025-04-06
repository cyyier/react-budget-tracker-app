# react-native-budget-tracker-app（おうち家計簿）

ペア向けの家計管理アプリです。  
収支・送金の記録、カテゴリごとの分類、月別の統計表示、貢献度（支出割合）の自動計算など、日常的な支出管理を簡潔に行うことができます。

---

## 主な機能

- ユーザー登録・ログイン（メールアドレス＋パスワード認証）
- 支出・収入・送金の記録（カテゴリ・相手・メモ・定期支出対応）
- 月ごとの統計情報表示（カテゴリ別 / 支払い相手別 / 金額順）
- 支出の貢献度（支出割合）自動計算
- 定期支出の自動追加（Firebase Functions による月初実行）
- フィルター機能（カテゴリ / タイプ / 金額範囲など）
- グラフ表示（棒グラフ / 円グラフ）
- データの編集・削除機能

---

## 技術スタック

- フレームワーク：React Native（Expo）
- UIライブラリ：React Native Paper
- 認証：Firebase Authentication（メールアドレス＋パスワード方式）
- データベース：Firebase Realtime Database
- バックエンド処理：Firebase Cloud Functions（定期実行）
- グラフ描画：react-native-chart-kit
---

## 学んだこと

- Firebase Authentication による認証フローの構築
- Realtime Database を用いたデータ構造設計と CRUD 処理
- Firebase Cloud Functions を使った定期実行ロジック（月初支出の自動追加）
- React Native Paper による UI 実装
- react-native-chart-kit を使ったグラフ描画と集計ロジックの構築
- Expo を用いたクロスプラットフォーム開発とビルドフローの習得
- ユーザーごとの支出集計・割合計算など、ロジックと UI の連動実装
---


## 今後追加予定の機能

- 複数グループへの対応（グループごとのデータ分離）
- 支払い証憑の画像アップロード機能
- 通知機能（定期支出のお知らせなど）

---

## スクリーンショット
<img src="https://github.com/user-attachments/assets/99db1840-4eef-4f17-80c7-bc0ff445482f" width="200" />
<img src="https://github.com/user-attachments/assets/d79ae0eb-320b-4002-bc1b-07d89fd5d796" width="200" />
<img src="https://github.com/user-attachments/assets/e1fb3d33-bcae-4b0b-b352-5986390dd14c" width="200" />
<img src="https://github.com/user-attachments/assets/5716eeff-a2fe-482c-adf1-aaa1ec497b7b" width="200" />
<img src="https://github.com/user-attachments/assets/e1f5af8d-2330-443e-bfdb-6b8e38c975f6" width="200" />


