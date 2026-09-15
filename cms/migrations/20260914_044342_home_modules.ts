import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_modules_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_modules_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "home_modules_fragments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_modules_method" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_modules_systems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_modules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_home_modules_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_home_modules_v_version_fragments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_modules_v_version_method" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_modules_v_version_systems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_modules_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__home_modules_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "home_modules_fragments" ADD CONSTRAINT "home_modules_fragments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_modules_method" ADD CONSTRAINT "home_modules_method_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_modules_systems" ADD CONSTRAINT "home_modules_systems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_modules_v_version_fragments" ADD CONSTRAINT "_home_modules_v_version_fragments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_modules_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_modules_v_version_method" ADD CONSTRAINT "_home_modules_v_version_method_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_modules_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_modules_v_version_systems" ADD CONSTRAINT "_home_modules_v_version_systems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_modules_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_modules_fragments_order_idx" ON "home_modules_fragments" USING btree ("_order");
  CREATE INDEX "home_modules_fragments_parent_id_idx" ON "home_modules_fragments" USING btree ("_parent_id");
  CREATE INDEX "home_modules_method_order_idx" ON "home_modules_method" USING btree ("_order");
  CREATE INDEX "home_modules_method_parent_id_idx" ON "home_modules_method" USING btree ("_parent_id");
  CREATE INDEX "home_modules_systems_order_idx" ON "home_modules_systems" USING btree ("_order");
  CREATE INDEX "home_modules_systems_parent_id_idx" ON "home_modules_systems" USING btree ("_parent_id");
  CREATE INDEX "home_modules__status_idx" ON "home_modules" USING btree ("_status");
  CREATE INDEX "_home_modules_v_version_fragments_order_idx" ON "_home_modules_v_version_fragments" USING btree ("_order");
  CREATE INDEX "_home_modules_v_version_fragments_parent_id_idx" ON "_home_modules_v_version_fragments" USING btree ("_parent_id");
  CREATE INDEX "_home_modules_v_version_method_order_idx" ON "_home_modules_v_version_method" USING btree ("_order");
  CREATE INDEX "_home_modules_v_version_method_parent_id_idx" ON "_home_modules_v_version_method" USING btree ("_parent_id");
  CREATE INDEX "_home_modules_v_version_systems_order_idx" ON "_home_modules_v_version_systems" USING btree ("_order");
  CREATE INDEX "_home_modules_v_version_systems_parent_id_idx" ON "_home_modules_v_version_systems" USING btree ("_parent_id");
  CREATE INDEX "_home_modules_v_version_version__status_idx" ON "_home_modules_v" USING btree ("version__status");
  CREATE INDEX "_home_modules_v_created_at_idx" ON "_home_modules_v" USING btree ("created_at");
  CREATE INDEX "_home_modules_v_updated_at_idx" ON "_home_modules_v" USING btree ("updated_at");
  CREATE INDEX "_home_modules_v_latest_idx" ON "_home_modules_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_modules_fragments" CASCADE;
  DROP TABLE "home_modules_method" CASCADE;
  DROP TABLE "home_modules_systems" CASCADE;
  DROP TABLE "home_modules" CASCADE;
  DROP TABLE "_home_modules_v_version_fragments" CASCADE;
  DROP TABLE "_home_modules_v_version_method" CASCADE;
  DROP TABLE "_home_modules_v_version_systems" CASCADE;
  DROP TABLE "_home_modules_v" CASCADE;
  DROP TYPE "public"."enum_home_modules_status";
  DROP TYPE "public"."enum__home_modules_v_version_status";`)
}
