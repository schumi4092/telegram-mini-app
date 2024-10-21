const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// 創建 MySQL 連接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'wheel_game_user',
  password: 'lowhe88mm',
  database: 'wheel_game_db'
});

// 連接到數據庫
connection.connect(err => {
  if (err) {
    console.error('錯誤：無法連接到數據庫');
    console.error('錯誤代碼:', err.code);
    console.error('錯誤號:', err.errno);
    console.error('SQL狀態:', err.sqlState);
    console.error('錯誤消息:', err.sqlMessage);
    process.exit(1); // 終止程序
  }
  console.log('成功連接到 MySQL 數據庫');
});

app.use(bodyParser.json());

// 設置靜態文件目錄
app.use(express.static(__dirname));

// 處理根路徑請求
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index_game.html'));
});

// 處理 favicon.ico 請求
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // 返回無內容狀態碼
});

// 獲取用戶數據
app.get('/api/user_data', (req, res) => {
  const telegramId = req.query.telegram_id;
  const query = 'SELECT * FROM users WHERE telegram_id = ?';
  connection.query(query, [telegramId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

// 更新用戶數據
app.post('/api/update_user_data', (req, res) => {
  const { telegram_id, coupon_value } = req.body;
  const query = `
    UPDATE users 
    SET balance = balance - 10, 
        coupon_${coupon_value} = coupon_${coupon_value} + 1 
    WHERE telegram_id = ?
  `;
  connection.query(query, [telegram_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    // 獲取更新後的用戶數據
    connection.query('SELECT * FROM users WHERE telegram_id = ?', [telegram_id], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results[0]);
    });
  });
});

// 404 錯誤處理
app.use((req, res, next) => {
  console.log(`404 錯誤：${req.url}`);
  res.status(404).send('找不到該頁面');
});

// 通用錯誤處理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服務器內部錯誤');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
