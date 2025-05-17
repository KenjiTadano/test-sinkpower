// src/app/api/proxy/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const authUrl = process.env.NEXT_PUBLIC_API_TARGET;

  // ログ出力
  console.log("🔍 clientId:", clientId);
  console.log("🔍 clientSecret:", clientSecret ? "OK" : "MISSING");
  console.log("🔍 authUrl:", authUrl);
  // 必要な環境変数が設定されていない場合は、500エラーを返す
  if (!clientId || !clientSecret || !authUrl) {
    console.error("❌ 環境変数の読み込みに失敗しています");
    return NextResponse.json({ error: "環境変数が不足しています" }, { status: 500 });
  }

  try {
    // 🔽 ここで、フォーム送信形式 (application/x-www-form-urlencoded) のデータを作成
    const form = new URLSearchParams(); // URLSearchParams はフォーム形式のデータを作れるオブジェクト
    form.append("client_id", clientId); // クライアントIDを追加
    form.append("client_secret", clientSecret); // クライアントシークレットを追加
    form.append("grant_type", "client_credentials"); // 多くのAPIで必要なパラメータ

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(), // curlの -d と同じ
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("❌ APIから失敗レスポンス:", res.status, text);
      return NextResponse.json({ error: "API認証失敗", status: response.status, body: text }, { status: response.status });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ API呼び出し中にエラー:", err);
    return NextResponse.json({ error: "サーバーエラー", message: err.message }, { status: 500 });
  }
}
