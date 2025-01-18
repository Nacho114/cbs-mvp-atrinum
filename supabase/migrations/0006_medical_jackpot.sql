CREATE TYPE "public"."move_statuses" AS ENUM('pending', 'executed', 'failed');--> statement-breakpoint
CREATE TABLE "moves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"user_id" uuid NOT NULL,
	"from_account" uuid NOT NULL,
	"destination_account" uuid NOT NULL,
	"amount" double precision NOT NULL,
	"exchangeRate" double precision NOT NULL,
	"fee" double precision DEFAULT 0 NOT NULL,
	"create_date" timestamp DEFAULT now() NOT NULL,
	"execution_date" timestamp,
	"move_status" "move_statuses" NOT NULL,
	"last_modified_by" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "moves" ADD CONSTRAINT "moves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moves" ADD CONSTRAINT "moves_from_account_accounts_id_fk" FOREIGN KEY ("from_account") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moves" ADD CONSTRAINT "moves_destination_account_accounts_id_fk" FOREIGN KEY ("destination_account") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moves" ADD CONSTRAINT "moves_last_modified_by_users_id_fk" FOREIGN KEY ("last_modified_by") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;