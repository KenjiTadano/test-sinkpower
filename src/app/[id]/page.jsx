"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchData } from "../../lib/fetchData";

export default function WhatDayDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDetail() {
      try {
        const today = new Date();
        const mmdd = `${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
        const result = await fetchData({
          day: mmdd,
          article_type: 3,
          offset: 0,
          limit: 100,
        });

        const found = result.data.find((d) => d.what_day_id === id);
        if (found) {
          setItem(found);
        } else {
          setError("データが見つかりません");
        }
      } catch (err) {
        setError("詳細データ取得失敗");
      }
    }

    loadDetail();
  }, [id]);

  return (
    <main style={{ padding: "20px" }}>
      <button onClick={() => router.back()} style={{ marginBottom: "20px" }}>
        ← 戻る
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {item && (
        <>
          <h1>{item.title}</h1>
          <div>📝 article_note: {item.article_note}</div>
          <div>🗂 type: {item.article_type}</div>
          <div>🕒 更新日: {item.modified_at}</div>
        </>
      )}
    </main>
  );
}
