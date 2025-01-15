CREATE TYPE "public"."currencies" AS ENUM('USD', 'EUR', 'GBP', 'CHF', 'JPY');--> statement-breakpoint
CREATE TYPE "public"."payment_statuses" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"currency" "currencies" NOT NULL,
	"balance" double precision DEFAULT 0 NOT NULL,
	"create_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"amount" double precision NOT NULL,
	"destination_name" text NOT NULL,
	"payment_status" "payment_statuses" NOT NULL,
	"create_date" timestamp DEFAULT now() NOT NULL,
	"last_modified_date" timestamp DEFAULT now() NOT NULL,
	"last_modified_by" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_last_modified_by_users_id_fk" FOREIGN KEY ("last_modified_by") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;