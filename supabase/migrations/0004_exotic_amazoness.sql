ALTER TABLE "payments" RENAME COLUMN "destination_name" TO "recipient";--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "iban" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "swift_bic" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "public"."payments" ALTER COLUMN "payment_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_statuses";--> statement-breakpoint
CREATE TYPE "public"."payment_statuses" AS ENUM('pending', 'executed', 'failed');--> statement-breakpoint
ALTER TABLE "public"."payments" ALTER COLUMN "payment_status" SET DATA TYPE "public"."payment_statuses" USING "payment_status"::"public"."payment_statuses";