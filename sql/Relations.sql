-- Relations.sql：測試資料插入

-- 1. users
INSERT INTO users (name, email, password_hash, currency_preference) VALUES
('王小明', 'ming@example.com', 'hashedpassword1', 'TWD'),
('李小美', 'mei@example.com', 'hashedpassword2', 'USD');

-- 2. accounts
INSERT INTO accounts (user_id, account_name, account_type, currency, balance) VALUES
(1, '現金包', 'cash', 'TWD', 5000.00),
(1, '銀行帳戶', 'bank', 'TWD', 32000.00),
(2, '信用卡', 'credit', 'USD', -120.50);

-- 3. categories
INSERT INTO categories (user_id, name, type, color_tag) VALUES
(1, '食品', 'expense', '#FF0000'),
(1, '薪水', 'income', '#00AA00'),
(2, '娛樂', 'expense', '#0000FF'),
(1, '交通', 'expense', '#FFA500');

-- 4. transactions
INSERT INTO transactions (user_id, account_id, category_id, amount, type, note, transaction_date) VALUES
(1, 1, 1, 120.00, 'expense', '午餐便當', '2025-04-25'),
(1, 2, 2, 30000.00, 'income', '四月薪水', '2025-04-20'),
(2, 3, 3, 50.00, 'expense', 'Netflix 月費', '2025-04-23'),
(1, 1, 1, 85.00, 'expense', '早餐豆漿', '2025-05-01'),
(1, 1, 1, 130.00, 'expense', '晚餐拉麵', '2025-05-02'),
(1, 2, 4, 200.00, 'expense', '捷運加值', '2025-05-03'),
(1, 2, 4, 180.00, 'expense', '計程車資', '2025-05-04'),
(1, 1, 1, 95.00, 'expense', '午餐便當', '2025-05-05'),
(2, 3, 3, 60.00, 'expense', 'Spotify 月費', '2025-04-24'),
(2, 3, 3, 100.00, 'expense', 'Uber Eats 外送', '2025-04-25');

-- 5. recurring_transactions
INSERT INTO recurring_transactions (user_id, account_id, category_id, amount, type, note, frequency, start_date, next_occurrence) VALUES
(1, 2, 2, 30000.00, 'income', '每月薪水', 'monthly', '2025-01-01', '2025-05-01');

-- 6. budgets
INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date) VALUES
(1, 1, 5000.00, 'monthly', '2025-04-01', '2025-04-30'),
(2, 3, 100.00, 'monthly', '2025-04-01', '2025-04-30');

-- 7. savings_goals
INSERT INTO savings_goals (user_id, name, target_amount, current_amount, target_date, note) VALUES
(1, '出國旅遊基金', 50000.00, 10000.00, '2025-12-31', '預計年底出國玩'),
(2, '緊急預備金', 2000.00, 500.00, '2025-08-01', '應急用');

-- 8. statements
INSERT INTO statements (user_id, account_id, file_name, status, parsed_data) VALUES
(1, 2, 'bank_apr.csv', 'processed', '[{"date":"2025-04-10", "amount":1000}]'),
(2, 3, 'credit_apr.csv', 'pending', NULL);

-- 9. notifications
INSERT INTO notifications (user_id, type, message) VALUES
(1, 'budget', '您的「食品」支出已超過預算的 90%'),
(2, 'goal', '您的「緊急預備金」已達成 25%');

-- 10. advice_logs
INSERT INTO advice_logs (user_id, content, suggestion_type) VALUES
(1, '本月娛樂支出高於預算，建議下月調整預算或減少開銷。', 'budget'),
(2, '考慮設定新的儲蓄目標，例如年度旅遊。', 'saving');
