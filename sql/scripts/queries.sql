-- ===========================================================================
-- Get a customer's rental agreements
-- ===========================================================================

SELECT 
	c.id AS customer_id, 
	c.first_name, 
	c.last_name,
	ra.recurring_due_date,
	ra.recurring_rate,
	ra.created_at
FROM 
	rental_agreements ra
INNER JOIN customers c ON c.id = ra.customer_id
WHERE c.id = 1;


-- ===========================================================================
-- Get the customer with the most rental agreements
-- ===========================================================================
-- get_customers_with_most_rental_agreements

-- ===============================================================
-- Create a temporary table
-- ===============================================================

SELECT 
    c.id AS customer_id,	
    COUNT(c.id) AS number_of_rental_agreements
INTO TEMPORARY TABLE temp
FROM customers c
INNER JOIN rental_agreements ra ON c.id = ra.customer_id
GROUP BY c.id
ORDER BY number_of_rental_agreements DESC;

-- ===============================================================
-- Now find the customer with the most rental agreements.
-- ===============================================================

SELECT
	c.id,
	c.first_name,
	c.middle_name,
	c.last_name,
	t.number_of_rental_agreements
FROM customers c
INNER JOIN temp t ON c.id = t.customer_id
WHERE t.number_of_rental_agreements = (
	SELECT MAX(number_of_rental_agreements) FROM temp
);
