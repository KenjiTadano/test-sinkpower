// src/app/page.jsx

"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // 認証を行う処理
  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
        });

        const data = await response.json();

        if (data.token) {
          setToken(data.token);
        } else {
          setError("認証に失敗しました");
        }
      } catch (err) {
        setError("通信エラー");
      }
    }

    getToken();
  }, []);

  return (
    <main style={{ padding: "20px" }}>
      <h1>認証テスト</h1>
      {token ? (
        <>
          <p>✅ 認証しました</p>
          <p>token: {token}</p>
        </>
      ) : (
        <p>{error || "認証中..."}</p>
      )}
    </main>
  );
}
