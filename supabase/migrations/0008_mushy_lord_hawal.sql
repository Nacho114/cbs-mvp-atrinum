CREATE TYPE "public"."payment_file_types" AS ENUM('confirmation', 'additional_info');--> statement-breakpoint
CREATE TABLE "payment_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" uuid NOT NULL,
	"created_date" timestamp DEFAULT now() NOT NULL,
	"bucket_name" text NOT NULL,
	"file_path" text NOT NULL,
	"payment_id" uuid NOT NULL,
	"payment_file_type" "payment_file_types" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_files" ADD CONSTRAINT "payment_files_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_files" ADD CONSTRAINT "payment_files_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;