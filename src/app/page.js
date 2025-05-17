"use client";

import { useEffect, useState } from "react";
import { fetchData } from "../lib/fetchData";
import Link from "next/link";

export default function WhatDayListPage() {
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState(3); // デフォルト article_type = 3
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const today = new Date();
        const mmdd = `${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

        const result = await fetchData({
          day: mmdd,
          article_type: sortType,
          offset: 0,
          limit: 100,
        });

        // modified_at 降順でソート
        const sorted = result.data.sort((a, b) => new Date(b.modified_at) - new Date(a.modified_at));
        setData(sorted);
      } catch (err) {
        setError("データ取得に失敗しました");
      }
    }

    loadData();
  }, [sortType]);

  return (
    <main style={{ padding: "20px" }}>
      <h1>📅 What Day データ一覧</h1>

      <label>
        article_type:
        <select value={sortType} onChange={(e) => setSortType(Number(e.target.value))}>
          <option value={1}>1(Old今日は何の日)</option>
          <option value={2}>2(ビートルズ365)</option>
          <option value={3}>3 (New今日は何の日)</option>
          <option value={4}>4 (映画365)</option>
          <option value={5}>5 (アニメ365)</option>
        </select>
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {data.map((item) => (
          <li key={item.what_day_id} style={{ margin: "10px 0" }}>
            <strong>
              <Link href={`/${item.what_day_id}`}>{item.title}</Link>
            </strong>
            <div>🎤 {item.artist}</div>
            <div>
              📅 {item.day} ({item.year})
            </div>
            <div>
              📝 type: {item.article_type} / 更新日: {item.modified_at}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
