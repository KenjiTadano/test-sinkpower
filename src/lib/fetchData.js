/**
 * what_day データを取得するクライアント関数
 * @param {Object} params - APIに送るパラメータ
 * @param {string} params.day - mmdd形式の日付（例："0517"）
 * @param {number} params.article_type - 記事タイプ（例：3）
 * @param {number} [params.offset=0] - 開始位置（デフォルト: 0）
 * @param {number} [params.limit=20] - 最大取得件数（デフォルト: 20）
 * @returns {Promise<Object>} - APIから返ってくるJSONデータ
 */

// 📌 外部APIへデータを送るための共通関数
export async function fetchData(postData) {
  try {
    // 🔽 APIルート (/api/proxy) にPOSTリクエスト
    const res = await fetch("/api/whatday", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON形式で送信
      },
      body: JSON.stringify(postData), // データを文字列に変換して送信
    });

    // 🔽 ステータスコードが200番台以外の場合はエラーを投げる
    if (!res.ok) {
      const errorText = await res.text(); // エラーメッセージ詳細取得
      console.error("❌ レスポンスエラー詳細:", errorText);
      throw new Error(`API呼び出し失敗: ${res.status}`);
    }

    // 🔽 JSONとしてレスポンスを返す
    const data = await res.json();
    return data;
  } catch (err) {
    // 🔽 ネットワークやサーバーエラーのときにここに来る
    console.error("❌ fetchData エラー:", err);
    throw err; // 呼び出し元に再通知
  }
}
