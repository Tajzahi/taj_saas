CREATE TABLE "custom_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"is_off" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "prod_plan_items_menuItemId_idx";--> statement-breakpoint
DROP INDEX "promos_code_idx";--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN "operational_hours" text DEFAULT '08:00 - 22:00';--> statement-breakpoint
ALTER TABLE "inventory" ADD COLUMN "expiry_date" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "branch_id" uuid;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "bank_account" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "shift" text DEFAULT 'Pagi';--> statement-breakpoint
ALTER TABLE "custom_roles" ADD CONSTRAINT "custom_roles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_types" ADD CONSTRAINT "shift_types_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "custom_roles_tenantId_idx" ON "custom_roles" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_roles_tenant_code_idx" ON "custom_roles" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "shift_types_tenantId_idx" ON "shift_types" USING btree ("tenant_id");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profiles_branchId_idx" ON "profiles" USING btree ("branch_id");--> statement-breakpoint
CREATE UNIQUE INDEX "promos_tenant_code_idx" ON "promos" USING btree ("tenant_id","code");