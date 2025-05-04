-- DDL.sql

-- 1. users
create table users (
  user_id int primary key auto_increment,
  name varchar(100),
  email varchar(100) unique,
  password_hash varchar(255),
  currency_preference varchar(10),
  created_at datetime default current_timestamp
) engine=innodb;

-- 2. accounts
create table accounts (
  account_id int primary key auto_increment,
  user_id int,
  account_name varchar(100),
  account_type varchar(20),
  currency varchar(10),
  balance decimal(15,2) default 0,
  created_at datetime default current_timestamp,
  foreign key (user_id) references users(user_id)
) engine=innodb;

-- 3. categories
create table categories (
  category_id int primary key auto_increment,
  user_id int,
  name varchar(50),
  type varchar(10),
  color_tag varchar(10),
  foreign key (user_id) references users(user_id)
) engine=innodb;

-- 4. transactions
create table transactions (
  transaction_id int primary key auto_increment,
  user_id int,
  account_id int,
  category_id int,
  amount decimal(15,2),
  type varchar(10),
  note text,
  tags json,
  transaction_date date,
  created_at datetime default current_timestamp,
  recurring_id int,
  foreign key (user_id) references users(user_id),
  foreign key (account_id) references accounts(account_id),
  foreign key (category_id) references categories(category_id)
) engine=innodb;

-- 5. recurring_transactions
create table recurring_transactions (
  recurring_id int primary key auto_increment,
  user_id int,
  account_id int,
  category_id int,
  amount decimal(15,2),
  type varchar(10),
  note text,
  frequency varchar(10),
  start_date date,
  end_date date,
  next_occurrence date,
  foreign key (user_id) references users(user_id),
  foreign key (account_id) references accounts(account_id),
  foreign key (category_id) references categories(category_id)
) engine=innodb;

-- 6. budgets
create table budgets (
  budget_id int primary key auto_increment,
  user_id int,
  category_id int,
  amount decimal(15,2),
  period varchar(10),
  start_date date,
  end_date date,
  foreign key (user_id) references users(user_id),
  foreign key (category_id) references categories(category_id)
) engine=innodb;

-- 7. savings_goals
create table savings_goals (
  goal_id int primary key auto_increment,
  user_id int,
  name varchar(100),
  target_amount decimal(15,2),
  current_amount decimal(15,2) default 0,
  target_date date,
  note text,
  foreign key (user_id) references users(user_id)
) engine=innodb;

-- 8. statements
create table statements (
  statement_id int primary key auto_increment,
  user_id int,
  account_id int,
  file_name varchar(255),
  uploaded_at datetime default current_timestamp,
  status varchar(20),
  parsed_data json,
  foreign key (user_id) references users(user_id),
  foreign key (account_id) references accounts(account_id)
) engine=innodb;

-- 9. notifications
create table notifications (
  notification_id int primary key auto_increment,
  user_id int,
  type varchar(20),
  message text,
  is_read boolean default false,
  created_at datetime default current_timestamp,
  foreign key (user_id) references users(user_id)
) engine=innodb;

-- 10. advice_logs
create table advice_logs (
  advice_id int primary key auto_increment,
  user_id int,
  content text,
  suggestion_type varchar(20),
  created_at datetime default current_timestamp,
  foreign key (user_id) references users(user_id)
) engine=innodb;

