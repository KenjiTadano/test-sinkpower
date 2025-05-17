// ファイル: src/app/detail/[id]/page.jsx

import { fetchWhatDayData } from "@/lib/fetchData"; // 一覧取得用の関数を再利用
import Link from "next/link";

// 📝 詳細ページ（動的ルート）
// context.params.id にURLの [id] の値が入る（例: /detail/123 → id = 123）
export default async function ArticleDetail({ params }) {
  const { id } = params;

  // 🔐 トークン取得＋全データ取得（実際は1件取得APIがあればベター）
  const data = await fetchWhatDayData();

  // 該当記事を検索
  const article = data?.find((item) => item.id.toString() === id);

  // 該当記事がない場合の表示
  if (!article) {
    return (
      <main style={{ padding: "20px" }}>
        <h1>記事が見つかりません</h1>
        <Link href="/">← 一覧に戻る</Link>
      </main>
    );
  }

  // ✅ 該当記事の詳細表示
  return (
    <main style={{ padding: "20px" }}>
      <h1>{article.title}</h1>
      <p>
        <strong>日付:</strong> {article.date}
      </p>
      <p>
        <strong>種別:</strong> {article.article_type}
      </p>
      <p>
        <strong>本文:</strong> {article.body || "本文なし"}
      </p>

      {/* 🧭 一覧に戻るリンク */}
      <Link href="/">← 一覧に戻る</Link>
    </main>
  );
}
