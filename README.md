# SlotAnalytics — 靜態網站版

這個資料夾是由上層專案的 `dashboard.py` 自動產生的，**不要手動編輯這裡的檔案**——
下次重新產生就會被覆蓋。

## 內容

- `index.html` — 網頁殼（UI 邏輯、CSS），資料量不大，只有在程式邏輯改動時才會變
- `data.js` — 實際遊戲資料（`const D = {...}`），每次爬蟲跑完重新產生 dashboard 時會更新
- `manual-series.js` — 人工標記的系列/生態系補充資料

## 如何更新

在上層專案資料夾執行：

```
py dashboard.py --site-dir site
```

確認沒問題後：

```
cd site
git add -A
git commit -m "更新資料 YYYY-MM-DD"
git push
```

## 為什麼分成三個檔案

`index.html` 幾乎不太會變動，`data.js` 會隨著爬蟲資料量成長。分開之後，瀏覽器可以各自快取，
不需要每次都整包重新下載；對外分享時給的是一個網址，而不是一個要重新傳送的檔案。
