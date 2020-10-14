-- ===========================================================================
-- Calculate the total revenue brought in by each parking space type.
-- Add a WHERE clause to specify a date range.

-- For example:
-- WHERE i.created_at >= @start_date AND i.created_at <= @end_date

-- NOTE: Utilize the YEAR() or MONTH() functions.
-- ===========================================================================

SELECT
	ps.space_type,
	SUM(ra.recurring_rate) AS revenue
FROM rental_agreements ra
    INNER JOIN invoices i ON i.rental_agreement_id = i.id
    INNER JOIN parking_spaces ps ON ra.parking_space_id = ps.id 
GROUP BY ps.space_type 

-- ===========================================================================
-- Uncomment to calculate the total revenue
-- ===========================================================================

-- SELECT 
-- 	SUM(metadata.revenue) AS total_revenue
-- FROM (
-- 	SELECT 
-- 		ps.space_type,
-- 		SUM(ra.recurring_rate) AS revenue
-- 	FROM rental_agreements ra
-- 	    INNER JOIN invoices i ON i.rental_agreement_id = i.id
-- 	    INNER JOIN parking_spaces ps ON ra.parking_space_id = ps.id 
-- 	GROUP BY ps.space_type 
-- ) metadata;