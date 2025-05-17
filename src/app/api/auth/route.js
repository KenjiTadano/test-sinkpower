import { NextResponse } from "next/server";

export async function POST() {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const authUrl = process.env.NEXT_PUBLIC_API_TARGET;

  // ログ出力
  console.log("🔍 clientId:", clientId);
  console.log("🔍 clientSecret:", clientSecret ? "OK" : "MISSING");
  console.log("🔍 authUrl:", authUrl);
  if (!clientId || !clientSecret || !authUrl) {
    return NextResponse.json({ error: "環境変数が不足しています" }, { status: 500 });
  }

  try {
    // ✅ 認証APIに送信する form-urlencoded 形式のデータを作成
    const form = new URLSearchParams();
    form.append("client_id", clientId);
    form.append("client_secret", clientSecret);
    form.append("grant_type", "client_credentials");
    // 🔐 認証APIにリクエスト送信
    const authRes = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    // レスポンスをテキストで取得（ログ・パース両対応）
    const text = await authRes.text();
    // ❌ 認証失敗したとき
    if (!authRes.ok) {
      console.error("❌ APIから失敗レスポンス:", res.status, text);
      return NextResponse.json({ error: "API認証失敗", status: authRes.status, body: text }, { status: authRes.status });
    }
    // ✅ 成功時はJSONパースして返す
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    // 🛑 ネットワークエラーなど例外時の処理
    return NextResponse.json({ error: "API認証処理でエラー", message: err.message }, { status: 500 });
  }
}
