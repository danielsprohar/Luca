SELECT
    c.id as customer_id,
    c.first_name,
    c.last_name,
    ra.recurring_due_date,
    ra.recurring_rate,
FROM customers AS c
INNER JOIN rental_agreements AS ra ON c.id = ra.customer_id
INNER JOIN invoices AS i ON i.rental_agreement_id = ra.id;