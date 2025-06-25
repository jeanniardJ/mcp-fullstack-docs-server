# Fonctions de Fenêtre - MySQL 8.0

> Source: Documentation MySQL 8.0
> Généré le 25/06/2025

---

## Fonctions de rang

```sql
-- ROW_NUMBER(): Numérotation unique
SELECT 
    name, 
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as rank_number
FROM employees;

-- RANK(): Rangs avec égalités
SELECT 
    name, 
    salary,
    RANK() OVER (ORDER BY salary DESC) as rank_position,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank
FROM employees;

-- Partition par département
SELECT 
    department,
    name, 
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank
FROM employees;
```

## Fonctions d'agrégation sur fenêtre

```sql
-- SUM cumulatif
SELECT 
    order_date,
    amount,
    SUM(amount) OVER (
        ORDER BY order_date 
        ROWS UNBOUNDED PRECEDING
    ) as running_total
FROM orders;

-- Moyenne mobile sur 7 jours
SELECT 
    date,
    revenue,
    AVG(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7_days
FROM daily_sales;

-- Comparaison avec valeurs précédentes/suivantes
SELECT 
    month,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY month) as prev_month,
    LEAD(revenue, 1) OVER (ORDER BY month) as next_month,
    revenue - LAG(revenue, 1) OVER (ORDER BY month) as month_diff
FROM monthly_sales;
```

## Fonctions de valeur

```sql
-- FIRST_VALUE et LAST_VALUE
SELECT 
    employee_id,
    department,
    salary,
    FIRST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
        ROWS UNBOUNDED PRECEDING
    ) as highest_salary_in_dept,
    LAST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as lowest_salary_in_dept
FROM employees;

-- NTILE pour créer des quartiles
SELECT 
    name,
    salary,
    NTILE(4) OVER (ORDER BY salary) as salary_quartile
FROM employees;
```

## CTE avec Window Functions

```sql
-- Analyse des ventes avec CTE
WITH sales_analysis AS (
    SELECT 
        product_id,
        month,
        sales,
        LAG(sales, 1) OVER (PARTITION BY product_id ORDER BY month) as prev_month_sales,
        AVG(sales) OVER (
            PARTITION BY product_id 
            ORDER BY month 
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) as avg_3_months
    FROM product_sales
)
SELECT 
    product_id,
    month,
    sales,
    prev_month_sales,
    avg_3_months,
    CASE 
        WHEN sales > avg_3_months * 1.2 THEN 'Excellent'
        WHEN sales > avg_3_months THEN 'Good'
        ELSE 'Below Average'
    END as performance
FROM sales_analysis;
```