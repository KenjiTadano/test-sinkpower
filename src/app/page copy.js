"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  // 認証トークンを保持するステート
  const [token, setToken] = useState(null);
  // エラーメッセージを保持するステート
  const [error, setError] = useState(null);
  // 認証処理中かどうかを示すステート
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証APIを呼び出してトークンを取得する非同期関数
    async function getToken() {
      try {
        // POSTメソッドで/api/authエンドポイントにリクエスト
        const res = await fetch("/api/auth", { method: "POST" });

        // レスポンスが失敗の場合はエラーを投げる
        if (!res.ok) throw new Error("認証に失敗しました");

        // レスポンスのJSONをパース
        const data = await res.json();

        // トークンがレスポンスに含まれているか確認
        if (data.access_token) {
          // トークンがあればstateにセット
          setToken(data.access_token);
        } else {
          // トークンがなければエラーを投げる
          throw new Error("トークンが取得できませんでした");
        }
      } catch (err) {
        // エラーが発生したらエラーステートにセット
        setError(err.message);
      } finally {
        // 認証処理が終わったのでローディングをfalseにする
        setLoading(false);
      }
    }

    // コンポーネント初回レンダリング時に認証処理を実行
    getToken();
  }, []);

  return (
    <main style={{ padding: "20px" }}>
      <h1>🔐 認証テストページ</h1>

      {/* 認証処理中はローディングメッセージ表示 */}
      {loading && <p>🔄 認証中...</p>}

      {/* ローディング終了後、トークンがあれば表示 */}
      {!loading && token && (
        <>
          <p>✅ 認証しました</p>
          <p>
            <strong>token:</strong> {token}
          </p>
        </>
      )}

      {/* ローディング終了後、エラーがあれば赤文字で表示 */}
      {!loading && error && <p style={{ color: "red" }}>❌ {error}</p>}
    </main>
  );
}
