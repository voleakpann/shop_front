-- Runs automatically the FIRST time the Postgres container initializes
-- (i.e. when the pgdata volume is empty). Creates the three service DBs.
CREATE DATABASE ministore_auth;
CREATE DATABASE ministore_products;
CREATE DATABASE ministore_orders;
