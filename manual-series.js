/**
 * manual-series.js — 系列 / 換皮偵測：人工校正資料層
 *
 * 這個檔案讓你不用改主程式就能補充人工判斷。
 * 編輯後只需重新執行 python dashboard.py，dashboard.html 就會套用新資料。
 *
 * ── 格式說明 ──────────────────────────────────────────────────────────────
 *
 *   series_id        任意唯一識別碼（英文、不含空格、不重複）
 *   seriesName       系列顯示名稱，必須與系列頁左側清單名稱完全一致
 *                    （例如「Le Slots 系列」、「Big Bass 系列」）
 *   seriesType       確定系列 | 命名套路 | 機制家族 | 題材群 | 待確認
 *   confidence       人工確認 | 推定 | 待確認
 *   researchValue    高 | 中 | 低
 *   note             系列層級備註（顯示在詳細面板頂部）
 *   games            個別遊戲的人工校正（key 必須與資料庫遊戲名稱完全一致）
 *     "Game Name"
 *       provider       廠商（僅作參考用，不影響邏輯）
 *       classification 核心模板 | 純換皮 | 強化換皮 | 機制變體 | 分支作品 | 待人工確認
 *       note           遊戲層級備註（顯示在時間軸）
 *       diffNote       差異備註（顯示在比較卡，說明與核心模板的差異點）
 *       source         固定填 "manual"
 *
 * ── 使用流程 ──────────────────────────────────────────────────────────────
 *   1. 直接在此檔案新增或修改系列 / 遊戲資料
 *   2. 執行 python dashboard.py（或 run_weekly.ps1）重新產生 dashboard.html
 *   3. 重新整理瀏覽器，系列頁的人工校正遊戲會出現「人工校正」綠色 badge
 *
 * ── 注意事項 ──────────────────────────────────────────────────────────────
 *   - seriesName 必須與系列頁左側清單中顯示的名稱完全一致（含「系列」、空格）
 *   - 若要新建一個系列（自動偵測沒有的），至少要填入 2 款遊戲，才會在頁面顯示
 *   - 人工分類優先於自動偵測，但自動偵測資訊仍保留作參考
 *   - 爬蟲資料（games.db）不受此檔案影響
 */

window.MANUAL_SERIES = {

  // ── 範例：Le Slots 系列補充備註 ───────────────────────────────────────────
  // 此系列已有自動規則，這裡只補充人工確認的差異備註。
  // 取消下方區塊的 /* */ 即可啟用。
  /*
  "le_slots": {
    seriesName: "Le Slots 系列",
    seriesType: "確定系列",
    confidence: "人工確認",
    researchValue: "高",
    note: "Hacksaw Gaming 旗艦系列，以 Le King 為核心模板，題材延伸廣，波動輪廓差異大。",
    games: {
      "Le King": {
        provider: "Hacksaw Gaming",
        classification: "核心模板",
        note: "系列基準款，6×4 Grid，Money Collect + Free Spins，高波動",
        diffNote: "",
        source: "manual"
      },
      "Le King Deluxe": {
        provider: "Hacksaw Gaming",
        classification: "核心模板",
        note: "Le King 加強版，畫面升級，機制架構相同",
        diffNote: "美術品質提升，核心機制不變",
        source: "manual"
      },
      "Le Santa": {
        provider: "Hacksaw Gaming",
        classification: "純換皮",
        note: "Le King 聖誕季節性包裝，機制完全相同",
        diffNote: "主題替換（聖誕），數值 / 機制完全未變",
        source: "manual"
      },
      "Le Bandit": {
        provider: "Hacksaw Gaming",
        classification: "強化換皮",
        note: "追加 Heist / Respin 層，波動率提升",
        diffNote: "基底 Money Collect 不變，新增 Heist 觸發層（額外彩金階段）",
        source: "manual"
      },
      "Le Cowboy": {
        provider: "Hacksaw Gaming",
        classification: "機制變體",
        note: "子彈收集 / 左輪機制，與 Le King 玩法節奏明顯不同",
        diffNote: "核心收集機制替換為子彈 / 左輪主題，Bonus 觸發路徑不同",
        source: "manual"
      }
    }
  },
  */

  // ── 在此新增更多系列 ──────────────────────────────────────────────────────
  // 複製上方範例格式，修改 series_id、seriesName 與遊戲清單。
  //
  // 常見系列名稱（複製貼上即可用）：
  //   "Big Bass 系列"
  //   "Sweet Bonanza 系列"
  //   "Gates of Olympus 系列"
  //   "Money Train 系列"
  //   "Tombstone 系列"
  //   "Book of … 命名套路"
  //   "Megaways 機制家族"

};
