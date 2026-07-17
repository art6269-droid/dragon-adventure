# Dragon Admin Studio

《龍的冒險》的本機設定、角色資料與抽卡檢查工具。伺服器只監聽 `127.0.0.1`，寫入功能不會部署到 GitHub Pages。

## 啟動

```powershell
cd tools/dragon-admin
npm install
npm run admin
```

開啟 `http://localhost:4173`。

## 安全與備份

- 寫入 API 同時檢查請求主機名稱與連線來源，只接受本機連線。
- 每次寫入 `game-config.json`、角色 `data.json` 或角色索引前，都會備份到專案的 `backups/dragon-admin/`。
- 一般備份最多保留最近 50 份。
- 後台不會讀取、修改或清除瀏覽器的玩家 `localStorage`。
- 「整理未分類素材」預設只複製原檔；只有再次明確確認時才會刪除來源。

## 發布

GitHub Pages 只會使用遊戲的靜態檔案與 `config/game-config.json`。`tools/dragon-admin/server.js` 是本機 Node.js 程式，不應在任何公開主機啟動。
