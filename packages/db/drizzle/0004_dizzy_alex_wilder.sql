ALTER TABLE "branches" ADD COLUMN "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN "ordering_methods" jsonb;--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN "payment_methods" jsonb;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "deliveryFee" numeric DEFAULT 0;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "salary" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" varchar(50) DEFAULT 'kasir';