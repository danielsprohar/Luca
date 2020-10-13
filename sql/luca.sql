DROP DATABASE luca;

CREATE DATABASE luca
	WITH 
		OWNER = postgres
		ENCODING = 'UTF8'
		LC_COLLATE = 'English_United States.1252'
		LC_CTYPE = 'English_United States.1252'
		TABLESPACE = pg_default
		CONNECTION LIMIT = -1;

\connect luca;

-- m:n
DROP TABLE IF EXISTS parking_space_occupants;
DROP TABLE IF EXISTS invoice_payments;

-- entities
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS rental_agreements;
DROP TABLE IF EXISTS customer_vehicles;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS parking_spaces;

-- ref tables
DROP TABLE IF EXISTS rental_agreement_types;
DROP TABLE IF EXISTS payment_methods;
DROP TABLE IF EXISTS invoice_statuses;
DROP TABLE IF EXISTS parking_space_types;

-- ============================================================
-- Reference Tables
-- ============================================================
CREATE TABLE IF NOT EXISTS parking_space_types
(
	id serial PRIMARY KEY,
	name varchar(32) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

-- ============================================================

CREATE TABLE IF NOT EXISTS rental_agreement_types
(
	id serial PRIMARY KEY,
	name varchar(32) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

-- ============================================================

CREATE TABLE IF NOT EXISTS invoice_statuses
(
	id serial PRIMARY KEY,
	name varchar(32) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

-- ============================================================

CREATE TABLE IF NOT EXISTS payment_methods
(
	id serial PRIMARY KEY,
	name varchar(32) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

-- ============================================================
-- Domain entities
-- ============================================================

CREATE TABLE IF NOT EXISTS parking_spaces
(
	id serial PRIMARY KEY,
	name varchar(32) NOT NULL,
	description varchar(32),
	is_occupied boolean NOT NULL DEFAULT FALSE,
	amperage_capacity integer,
	parking_space_type_id integer NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	FOREIGN KEY (parking_space_type_id) REFERENCES parking_space_types (id) ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS customers
(
	id serial PRIMARY KEY,
	first_name varchar(32) NOT NULL,
	middle_name varchar(32),
	last_name varchar(32) NOT NULL,
	phone varchar(32),
	email varchar(255),
	normalized_email varchar(255) GENERATED ALWAYS AS (UPPER(email)) STORED,
	gender varchar(2),
	dl_number varchar(32),
	dl_state varchar(32),
	dl_photo_url varchar(2048),
	is_active boolean NOT NULL DEFAULT TRUE,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS customer_vehicles
(
	id serial PRIMARY KEY,
	year INTEGER NOT NULL,
	make varchar(32) NOT NULL,
	model varchar(32) NOT NULL,
	license_plate_no varchar(32) NOT NULL,
	license_plate_state varchar(32) NOT NULL,
	photo_url varchar(2048),
	customer_id integer NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS rental_agreements
(
	id serial PRIMARY KEY,
	recurring_due_date integer,
	recurring_rate money NOT NULL,
	is_active boolean DEFAULT TRUE,
	customer_id integer NOT NULL,
	parking_space_id integer NOT NULL,
	rental_agreement_type_id integer NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE cascade,
	FOREIGN KEY (parking_space_id) REFERENCES parking_spaces (id) ON DELETE cascade,
	FOREIGN KEY (rental_agreement_type_id) REFERENCES rental_agreement_types (id) ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS invoices
(
	id serial PRIMARY KEY,
	customer_id integer NOT NULL,
	invoice_status_id integer NOT NULL,
	rental_agreement_id integer NOT NULL,
	payment_due_date timestamptz NOT NULL,
	billing_period_start timestamptz NOT NULL,
	billing_period_end timestamptz NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE cascade,
	FOREIGN KEY (invoice_status_id) REFERENCES invoice_statuses (id) ON DELETE cascade,
	FOREIGN KEY (rental_agreement_id) REFERENCES rental_agreements (id) ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS payments
(
	id serial PRIMARY KEY,
	amount money NOT NULL,
	payment_method_id integer NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	FOREIGN KEY (payment_method_id) REFERENCES payment_methods (id) ON DELETE cascade
);

-- ============================================================
-- Join/Bridge tables for m:n relationships
-- ============================================================

CREATE TABLE IF NOT EXISTS invoice_payments
(
	invoice_id int NOT NULL,
	payment_id int NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	PRIMARY KEY (invoice_id, payment_id),
	FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE cascade,
	FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE cascade
);

-- ============================================================

CREATE TABLE IF NOT EXISTS parking_space_occupants
(
	customer_id integer NOT NULL,
	parking_space_id integer NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	PRIMARY KEY (customer_id, parking_space_id),
	FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE cascade,
	FOREIGN KEY (parking_space_id) REFERENCES parking_spaces (id) ON DELETE cascade
);

INSERT INTO parking_space_types (id, name) values (1, 'rv');
INSERT INTO parking_space_types (id, name) values (2, 'mobile home');
INSERT INTO parking_space_types (id, name) values (3, 'storage');

INSERT INTO payment_methods (name) values('debit');
INSERT INTO payment_methods (name) values('cash');
INSERT INTO payment_methods (name) values('check');
INSERT INTO payment_methods (name) values('credit');
INSERT INTO payment_methods (name) values('money order');

INSERT INTO invoice_statuses (name) values('awaiting payment');
INSERT INTO invoice_statuses (name) values('partially paid');
INSERT INTO invoice_statuses (name) values('paid');
INSERT INTO invoice_statuses (name) values('bad credit');

INSERT INTO rental_agreement_types (name) values('monthly');
INSERT INTO rental_agreement_types (name) values('weekly');
INSERT INTO rental_agreement_types (name) values('daily');


INSERT INTO
	parking_spaces (name, amperage_capacity, parking_space_type_id) 
VALUES
	('1', 50, 1), ('2', 30, 1), ('3', 50, 1), ('4', 30, 1), ('5', 50, 1),
    ('6', 30, 1), ('7', 50, 1), ('8', 50, 1), ('9', 50, 1), ('10', 30, 1),
    ('11', 30, 1), ('12', 30, 1), ('13', 30, 1), ('14', 50, 1), ('15', 50, 1),
    ('16', 50, 1), ('17', 30, 1), ('18', 30, 1), ('19', 30, 1), ('20', 50, 1),
    ('21', 30, 1), ('22', 50, 1), ('23', 50, 1), ('24', 30, 1), ('25', 30, 1),
    ('26', 30, 1), ('27', 30, 1), ('28', 30, 1), ('29',30, 1) , ('30',30, 1),
    ('31',50, 1), ('32',50, 1), 
    ('A', 0, 2), ('B', 0, 2), ('C', 0, 2),('D', 0, 2),('E', 0, 2),('F', 0, 2),('G', 0, 2);