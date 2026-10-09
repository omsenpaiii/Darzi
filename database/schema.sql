-- DARZI application schema. Apply to the application's isolated Neon development branch.
-- Managed identity belongs to neon_auth; staff access is controlled by darzi.staff.
CREATE SCHEMA IF NOT EXISTS darzi;
CREATE TABLE IF NOT EXISTS darzi.customers (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.orders (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.items (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.leads (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.activity (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.shipments (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.staff (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.appointments (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.attendance (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.invoices (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.credentials (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.sessions (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.uploads (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.file_bytes (id text PRIMARY KEY, bytes bytea NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.settings (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.requests (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.submission_windows (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS darzi.legacy_archive (id text PRIMARY KEY, data jsonb NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS darzi_items_qr_token ON darzi.items ((data->>'qrToken'));
CREATE INDEX IF NOT EXISTS darzi_orders_customer ON darzi.orders ((data->>'customerId'));
CREATE INDEX IF NOT EXISTS darzi_items_order ON darzi.items ((data->>'orderId'));
CREATE INDEX IF NOT EXISTS darzi_items_stage ON darzi.items ((data->>'stage'));
CREATE INDEX IF NOT EXISTS darzi_activity_item ON darzi.activity ((data->>'itemId'), (data->>'createdAt'));
CREATE INDEX IF NOT EXISTS darzi_leads_status ON darzi.leads ((data->>'status'));
CREATE UNIQUE INDEX IF NOT EXISTS darzi_staff_email ON darzi.staff (lower(data->>'email'));
CREATE UNIQUE INDEX IF NOT EXISTS darzi_attendance_staff_day ON darzi.attendance ((data->>'staffId'), (data->>'date'));
