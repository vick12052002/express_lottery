## 抽獎 API 
以 node.js 與 express 建立抽獎API

BASE_URL : lottery.alirong.tw

功能     |Method | path
------- |-------|-----|
讀取單筆獎項 | GET | /get-lottery |
讀取所有獎項 | GET | /system/all-lottery |
新增獎項  | POST| /system/add | 
更新    | POST | /system/update/:id |
刪除    | GET | /system/delete/:id |