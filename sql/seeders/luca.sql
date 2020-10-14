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
DROP TABLE IF EXISTS customer_accounts;
DROP TABLE IF EXISTS invoice_payments;
DROP TABLE IF EXISTS user_roles;

-- entities
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS rental_agreements;
DROP TABLE IF EXISTS customer_vehicles;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS parking_spaces;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;


-- ============================================================
-- Custom types
-- ============================================================
CREATE TYPE public.space_type AS ENUM (
	'rv', 
	'mobile home', 
	'storage'
);

CREATE TYPE public.payment_status AS ENUM (
	'not paid', 
	'paid', 
	'bad credit'
);

CREATE TYPE public.rental_agreement_type AS ENUM (
	'daily', 
	'monthly', 
	'weekly'
);

CREATE TYPE public.payment_method AS ENUM (
	'cash', 
	'check',
	'credit', 
	'debit', 
	'money order'
);

CREATE DOMAIN public.year AS integer
	CONSTRAINT year_check CHECK (VALUE >= 1901);

-- ============================================================
-- Domain entities
-- ============================================================

CREATE TABLE users
(
	id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	username varchar(255) not null,
	normalized_username varchar(255) GENERATED ALWAYS AS (UPPER(username)) STORED,
	email varchar(255) not null unique,
	normalized_email varchar(255) GENERATED ALWAYS AS (UPPER(email)) STORED,
	hashed_password varchar(64) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE roles
(
	id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	name varchar(64) not null,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE user_roles
(
	user_id int not null,
	role_id int not null,
	PRIMARY KEY (user_id, role_id),
	FOREIGN KEY (user_id) REFERENCES users (id),
	FOREIGN KEY (role_id) REFERENCES roles (id),
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS parking_spaces
(
	id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	name varchar(32) NOT NULL,
	description varchar(128),
	is_occupied boolean NOT NULL DEFAULT FALSE,
	amperage_capacity integer,
	space_type public.space_type NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS customers
(
	id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
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

CREATE INDEX customer_full_name
    ON customers USING btree
    (first_name ASC NULLS LAST, last_name ASC NULLS LAST)
;

-- Weak entity type
CREATE TABLE IF NOT EXISTS customer_vehicles
(
	customer_id integer NOT NULL,
	year public.year NOT NULL,
	make varchar(32) NOT NULL,
	model varchar(32) NOT NULL,
	license_plate_no varchar(32) NOT NULL,
	license_plate_state varchar(32) NOT NULL,
	photo_url varchar(2048),
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS rental_agreements
(
	id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	recurring_due_date integer,
	recurring_rate money NOT NULL,
	is_active boolean DEFAULT TRUE,
	customer_id integer NOT NULL,
	parking_space_id integer NOT NULL,
	agreement_type public.rental_agreement_type NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	FOREIGN KEY (customer_id) REFERENCES customers (id),
	FOREIGN KEY (parking_space_id) REFERENCES parking_spaces (id)
);

-- The invoice amount is determined by the 
-- 	"recurring_rate" attribute of the `rental_agreement` entity.
CREATE TABLE IF NOT EXISTS invoices
(
	id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	payment_status public.payment_status NOT NULL,
	payment_due_date date NOT NULL,
	billing_period_start date NOT NULL,
	billing_period_end date NOT NULL,
	rental_agreement_id integer NOT NULL,
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp,
	FOREIGN KEY (rental_agreement_id) REFERENCES rental_agreements (id)
);

CREATE TABLE IF NOT EXISTS payments
(
	id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	amount money NOT NULL,
	payment_method public.payment_method NOT NULL,
	details varchar(2048),
	created_at timestamptz NOT NULL DEFAULT current_timestamp,
	updated_at timestamptz NOT NULL DEFAULT current_timestamp
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

-- ===========================================================================
-- Seed data
-- ===========================================================================

INSERT INTO
	parking_spaces (name, amperage_capacity, space_type) 
VALUES
	('1', 50, 'rv'), ('2', 30, 'rv'), ('3', 50, 'rv'), ('4', 30, 'rv'), ('5', 50, 'rv'),
    ('6', 30, 'rv'), ('7', 50, 'rv'), ('8', 50, 'rv'), ('9', 50, 'rv'), ('10', 30, 'rv'),
    ('11', 30, 'rv'), ('12', 30, 'rv'), ('13', 30, 'rv'), ('14', 50, 'rv'), ('15', 50, 'rv'),
    ('16', 50, 'rv'), ('17', 30, 'rv'), ('18', 30, 'rv'), ('19', 30, 'rv'), ('20', 50, 'rv'),
    ('21', 30, 'rv'), ('22', 50, 'rv'), ('23', 50, 'rv'), ('24', 30, 'rv'), ('25', 30, 'rv'),
    ('26', 30, 'rv'), ('27', 30, 'rv'), ('28', 30, 'rv'), ('29',30, 'rv') , ('30',30, 'rv'),
    ('31',50, 'rv'), ('32',50, 'rv'), 
    ('A', 0, 'mobile home'), ('B', 0, 'mobile home'), 
	('C', 0, 'mobile home'), ('D', 0, 'mobile home'),
	('E', 0, 'mobile home'), ('F', 0, 'mobile home'), 
	('G', 0, 'mobile home');

-- ===========================================================================

INSERT INTO 
	roles (id, name)
VALUES
	(1, 'user'), (2, 'admin');

-- ===========================================================================