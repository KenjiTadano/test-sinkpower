// src/app/api/whatday/route.js
import { NextResponse } from "next/server";

// サーバー起動中のみ保持されるトークンキャッシュ
let cachedToken = null;
let tokenExpiry = null;

export async function POST(request) {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const authUrl = process.env.NEXT_PUBLIC_API_TARGET;

  if (!clientId || !clientSecret || !authUrl) {
    return NextResponse.json({ error: "環境変数が不足しています" }, { status: 500 });
  }

  try {
    // 🔍 トークンがまだ有効なら再利用
    const now = Date.now();
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
      console.log("✅ キャッシュされたトークンを使用");
    } else {
      console.log("🔑 新しいトークンを取得中...");

      const form = new URLSearchParams();
      form.append("client_id", clientId);
      form.append("client_secret", clientSecret);
      form.append("grant_type", "client_credentials");

      const authRes = await fetch(authUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });

      const authText = await authRes.text();
      if (!authRes.ok) {
        console.error("❌ 認証API失敗:", authRes.status, authText);
        return NextResponse.json({ error: "認証失敗", detail: authText }, { status: authRes.status });
      }

      const authData = JSON.parse(authText);
      cachedToken = authData.token;

      if (!cachedToken) {
        throw new Error("トークンが取得できませんでした");
      }

      // トークンの有効期限（例：1日＝86400秒）
      const expiresIn = authData.expires_in || 86400; // デフォルト1日
      tokenExpiry = now + expiresIn * 1000;
      console.log("✅ 新しいトークン取得:", cachedToken);
    }


    
    // クライアントからのパラメータ取得
    const { day, article_type, offset, limit } = await request.json();

    const query = new URLSearchParams({
      day,
      article_type: article_type.toString(),
      offset: offset?.toString() || "0",
      limit: limit?.toString() || "20",
    });

    const url = `https://md.syncpower.jp/api/v1/data/what_day?${query}`;

    const apiRes = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cachedToken}`,
      },
    });

    const apiText = await apiRes.text();
    if (!apiRes.ok) {
      console.error("❌ 外部APIエラー:", apiRes.status, apiText);
      return NextResponse.json({ error: "外部API取得失敗", detail: apiText }, { status: apiRes.status });
    }

    return new NextResponse(apiText, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ サーバーエラー:", err);
    return NextResponse.json({ error: "サーバーエラー", message: err.message }, { status: 500 });
  }
}
