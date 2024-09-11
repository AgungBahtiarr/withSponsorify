CREATE TABLE IF NOT EXISTS "events" (
	"id" serial NOT NULL,
	"name" text,
	"description" text,
	"location" text,
	"proposal" text,
	"start_date" date,
	"end_date" date,
	"user_id" serial NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
