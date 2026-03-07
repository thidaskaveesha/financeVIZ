# FinanceVIZ – Personal Finance Visualization Platform

## Project Name
financeVIZ

## Instruction for Antigravity

Work **only inside the `financeVIZ` project**.

Do not create or modify any other project.

The goal is to build a **complete personal finance tracking and visualization web application**.

---

# 1. Project Overview

FinanceVIZ is a modern web application that helps users:

• Track financial transactions  
• Upload financial records from CSV  
• Manually record transactions  
• Visualize financial patterns using charts and dashboards  
• Compare financial statistics month-to-month  

The system should allow users to **understand their financial situation quickly through visual analytics**.

The dashboard must provide **clear insights into income, expenses, and spending patterns**.

---

# 2. Core Objectives

The application must help users answer questions like:

• Where does my money go?  
• What categories consume the most money?  
• Am I spending more this month compared to last month?  
• How much profit vs loss do I have?  
• What trends exist in my financial activity?

---

# 3. User Features

Users should be able to:

• Create an account  
• Login securely  
• Upload financial data via CSV  
• Add transactions manually  
• Edit or delete transactions  
• Create custom transaction categories  
• Visualize financial data using charts  
• Compare financial statistics month-to-month  
• Download their financial records as CSV

---

# 4. Authentication

Authentication should use **Supabase Auth**.

Required functionality:

• User signup  
• User login  
• User logout  
• Session management

Each user's financial data must be **fully isolated**.

No user should access another user's data.

---

# 5. Transaction Management

Users can create transactions using two methods.

---

## 5.1 CSV Upload

Users can upload a CSV file containing transaction records.

### Example CSV Format
date,time,type,description,category,amount
2026-03-01,10:20,profit,Salary,Salary,2500
2026-03-02,,loss,Groceries,Food,120
2026-03-03,18:10,loss,Restaurant,Food,45


### CSV Rules

Date is **required**.

Time is **optional**.

If time is missing, store `NULL`.

The system must validate:

• correct column names  
• numeric amount values  
• valid transaction type  
• non-empty required fields  

Invalid rows should be rejected.

Valid rows should be inserted into the database.

---

## 5.2 Manual Transaction Entry

Users should be able to manually create transactions.

### Transaction Fields

| Field | Description |
|------|-------------|
transaction_date | date (required)
transaction_time | time (optional)
transaction_type | profit or loss
description | description of the transaction
category | transaction category
amount | numeric value

---

# 6. Transaction Categories

Categories organize financial records.

---

## Default Categories

These are visible to **all users**.

Examples:

• Investment  
• Salary  
• Rent  
• Food  
• Travel  

---

## Custom Categories

Users can create custom categories.

Examples:

• Crypto  
• Gaming  
• Business  
• Education  

Custom categories belong only to the user who created them.

---

# 7. Dashboard Requirements

The dashboard should immediately show the user's **financial overview**.

The dashboard must contain:

• summary cards  
• financial charts  
• monthly comparison  
• recent transactions

---

# 8. Dashboard Summary Cards

The dashboard should show quick statistics.

Example cards:

• Total Income (this month)  
• Total Expenses (this month)  
• Net Balance  
• Number of Transactions

---

# 9. Financial Charts

The dashboard should include several charts.

---

## 9.1 Category Distribution

Shows how money is distributed across categories.

Example:

Food → $300  
Rent → $800  
Travel → $150  
Investment → $400  

Recommended chart:

Pie chart or doughnut chart.

---

## 9.2 Profit vs Loss

Shows total income vs total expenses.

Example:

Profit → $3200  
Loss → $1800  

Recommended chart:

Bar chart.

---

## 9.3 Financial Activity Over Time

Shows transaction activity over time.

Example grouping:

Daily  
Weekly  
Monthly  

Recommended chart:

Line chart.

---

## 9.4 Amount Trend

Shows how financial activity changes over time.

Recommended chart:

Area chart or line chart.

---

# 10. Monthly Comparison Feature

Users must be able to compare financial performance between months.

Example comparison:

| Metric | Last Month | This Month |
|------|------|------|
Income | $2500 | $3100
Expenses | $1700 | $1900
Balance | $800 | $1200

Charts or summary cards should display these comparisons.

---

# 11. Transaction List

The application must provide a full transaction list.

Users should be able to:

• view transactions  
• edit transactions  
• delete transactions  
• filter transactions  
• search transactions

Filters should include:

• date range  
• category  
• transaction type  
• amount range

---

# 12. Data Export

Users must be able to export their financial data.

Supported format:

CSV

Exported file should include all transaction columns.

---

# 13. Database Design

The system should use **PostgreSQL via Supabase**.

---

## Users

Managed by Supabase Auth.

---

## Transactions Table

| Column | Type |
|------|------|
id | uuid
user_id | uuid
transaction_date | date
transaction_time | time (nullable)
transaction_type | enum
description | text
category_id | uuid
amount | decimal
created_at | timestamp

---

## Categories Table

| Column | Type |
|------|------|
id | uuid
name | text
user_id | uuid (nullable)
is_default | boolean

### Rules

user_id = NULL → global category  
user_id != NULL → user-specific category

---

# 14. API Design

Recommended API structure.

---

## Transactions API

GET /api/transactions

Returns all transactions for logged-in user.

POST /api/transactions

Create new transaction.

PUT /api/transactions/{id}

Update transaction.

DELETE /api/transactions/{id}

Delete transaction.

---

## Categories API

GET /api/categories

Return all categories.

POST /api/categories

Create new category.

---

# 15. Frontend Pages

The system should contain the following pages.

---

## Login Page

Route:

/login

Allows users to log in.

---

## Signup Page

Route:

/signup

Allows new users to register.

---

## Dashboard

Route:

/dashboard

Displays financial overview and charts.

---

## Upload Page

Route:

/upload

Allows CSV file upload.

---

## Transactions Page

Route:

/transactions

Displays full transaction list.

Users can manage transactions here.

---

# 16. Tech Stack

Recommended stack.

Frontend:

• Next.js  
• React  
• TailwindCSS  

Charts:

• Recharts  
or  
• Chart.js  

Backend:

• Supabase  
• PostgreSQL  

---

# 17. UI Design Goals

The interface should focus on:

• simplicity  
• readability  
• clean financial visualization  

The dashboard should resemble **modern fintech applications**.

---

# 18. Performance Requirements

The application must:

• load dashboard charts quickly  
• support thousands of transactions  
• handle large CSV uploads

---

# 19. Security Requirements

The system must enforce:

• authenticated access  
• row-level security  
• user data isolation

Supabase **Row Level Security (RLS)** should ensure users access only their own data.

---

# 20. Optional Advanced Features

If time permits, additional features may include:

• budget planning  
• financial goal tracking  
• spending alerts  
• AI insights about spending patterns  
• dark mode dashboard

---

# Final Goal

FinanceVIZ should help users **instantly understand their financial health**.

The dashboard must provide meaningful insights and easy-to-read financial visualizations.