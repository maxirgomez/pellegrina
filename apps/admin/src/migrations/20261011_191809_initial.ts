import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_pellegrina_hero_chips_color" AS ENUM('agua', 'aire', 'tierra');
  CREATE TYPE "public"."enum_pages_blocks_pellegrina_values_items_tone" AS ENUM('agua', 'aire');
  CREATE TYPE "public"."enum_pages_blocks_pellegrina_suitcase_categories_season" AS ENUM('verano', 'invierno', 'ambas');
  CREATE TYPE "public"."enum_pages_blocks_pellegrina_destination_ways_tone" AS ENUM('agua', 'aire', 'tierra');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('primary', 'secondary');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pages_blocks_pellegrina_hero_address_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pellegrina_hero_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"color" "enum_pages_blocks_pellegrina_hero_chips_color"
  );
  
  CREATE TABLE "pages_blocks_pellegrina_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage_label" varchar,
  	"greeting" varchar,
  	"typed_title" varchar NOT NULL,
  	"signature" varchar,
  	"stamp_alt" varchar,
  	"stamp_image_id" integer,
  	"lead" jsonb,
  	"primary_cta_text" varchar NOT NULL,
  	"primary_cta_url" varchar NOT NULL,
  	"secondary_cta_text" varchar NOT NULL,
  	"secondary_cta_url" varchar NOT NULL,
  	"globe_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pellegrina_why" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage_label" varchar,
  	"leg_label" varchar,
  	"word" varchar,
  	"pronunciation" varchar,
  	"dictionary_body" jsonb,
  	"heading" varchar,
  	"highlight" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pellegrina_passport_steps_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pellegrina_passport_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_number" varchar NOT NULL,
  	"stamp_label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb
  );
  
  CREATE TABLE "pages_blocks_pellegrina_passport" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage_label" varchar,
  	"leg_label" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pellegrina_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"tone" "enum_pages_blocks_pellegrina_values_items_tone"
  );
  
  CREATE TABLE "pages_blocks_pellegrina_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage_label" varchar,
  	"leg_label" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pellegrina_guides_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pellegrina_guides_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_pellegrina_guides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage_label" varchar,
  	"leg_label" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"price" varchar,
  	"price_note" varchar,
  	"cta_text" varchar NOT NULL,
  	"cta_url" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pellegrina_suitcase_categories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pellegrina_suitcase_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"season" "enum_pages_blocks_pellegrina_suitcase_categories_season" DEFAULT 'ambas' NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pellegrina_suitcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage_label" varchar,
  	"leg_label" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"tip_message" varchar,
  	"done_cta_label" varchar,
  	"done_cta_sub" varchar,
  	"footer_note" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pellegrina_postcards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from_place" varchar NOT NULL,
  	"to_place" varchar NOT NULL,
  	"who" varchar NOT NULL,
  	"quote" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pellegrina_postcards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage_label" varchar,
  	"leg_label" varchar,
  	"heading" varchar,
  	"next_card_title" varchar,
  	"next_card_body" varchar,
  	"next_card_cta_text" varchar NOT NULL,
  	"next_card_cta_url" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pellegrina_destination_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"tone" "enum_pages_blocks_pellegrina_destination_ways_tone",
  	"whatsapp" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_pellegrina_destination" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage_label" varchar,
  	"leg_label" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"form_enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" jsonb NOT NULL,
  	"subtitle" varchar,
  	"cta_text" varchar NOT NULL,
  	"cta_url" varchar NOT NULL,
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price" varchar NOT NULL,
  	"cta_text" varchar NOT NULL,
  	"cta_url" varchar NOT NULL,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"button_text" varchar NOT NULL,
  	"button_url" varchar NOT NULL,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"quote" varchar NOT NULL,
  	"avatar_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Pellegrina Viajes' NOT NULL,
  	"logo_id" integer,
  	"whatsapp_number" varchar,
  	"whatsapp_default_message" varchar,
  	"contact_email" varchar,
  	"default_seo_title" varchar,
  	"default_seo_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_hero_address_lines" ADD CONSTRAINT "pages_blocks_pellegrina_hero_address_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_hero_chips" ADD CONSTRAINT "pages_blocks_pellegrina_hero_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_hero" ADD CONSTRAINT "pages_blocks_pellegrina_hero_stamp_image_id_media_id_fk" FOREIGN KEY ("stamp_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_hero" ADD CONSTRAINT "pages_blocks_pellegrina_hero_globe_image_id_media_id_fk" FOREIGN KEY ("globe_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_hero" ADD CONSTRAINT "pages_blocks_pellegrina_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_why" ADD CONSTRAINT "pages_blocks_pellegrina_why_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_passport_steps_tags" ADD CONSTRAINT "pages_blocks_pellegrina_passport_steps_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_passport_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_passport_steps" ADD CONSTRAINT "pages_blocks_pellegrina_passport_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_passport"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_passport" ADD CONSTRAINT "pages_blocks_pellegrina_passport_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_values_items" ADD CONSTRAINT "pages_blocks_pellegrina_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_values" ADD CONSTRAINT "pages_blocks_pellegrina_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_guides_includes" ADD CONSTRAINT "pages_blocks_pellegrina_guides_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_guides_pages" ADD CONSTRAINT "pages_blocks_pellegrina_guides_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_guides" ADD CONSTRAINT "pages_blocks_pellegrina_guides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_suitcase_categories_items" ADD CONSTRAINT "pages_blocks_pellegrina_suitcase_categories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_suitcase_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_suitcase_categories" ADD CONSTRAINT "pages_blocks_pellegrina_suitcase_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_suitcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_suitcase" ADD CONSTRAINT "pages_blocks_pellegrina_suitcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_postcards_items" ADD CONSTRAINT "pages_blocks_pellegrina_postcards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_postcards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_postcards" ADD CONSTRAINT "pages_blocks_pellegrina_postcards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_destination_ways" ADD CONSTRAINT "pages_blocks_pellegrina_destination_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pellegrina_destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pellegrina_destination" ADD CONSTRAINT "pages_blocks_pellegrina_destination_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_items" ADD CONSTRAINT "pages_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans_features" ADD CONSTRAINT "pages_blocks_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans" ADD CONSTRAINT "pages_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "pages_blocks_pellegrina_hero_address_lines_order_idx" ON "pages_blocks_pellegrina_hero_address_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_hero_address_lines_parent_id_idx" ON "pages_blocks_pellegrina_hero_address_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_hero_chips_order_idx" ON "pages_blocks_pellegrina_hero_chips" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_hero_chips_parent_id_idx" ON "pages_blocks_pellegrina_hero_chips" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_hero_order_idx" ON "pages_blocks_pellegrina_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_hero_parent_id_idx" ON "pages_blocks_pellegrina_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_hero_path_idx" ON "pages_blocks_pellegrina_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_pellegrina_hero_stamp_image_idx" ON "pages_blocks_pellegrina_hero" USING btree ("stamp_image_id");
  CREATE INDEX "pages_blocks_pellegrina_hero_globe_image_idx" ON "pages_blocks_pellegrina_hero" USING btree ("globe_image_id");
  CREATE INDEX "pages_blocks_pellegrina_why_order_idx" ON "pages_blocks_pellegrina_why" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_why_parent_id_idx" ON "pages_blocks_pellegrina_why" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_why_path_idx" ON "pages_blocks_pellegrina_why" USING btree ("_path");
  CREATE INDEX "pages_blocks_pellegrina_passport_steps_tags_order_idx" ON "pages_blocks_pellegrina_passport_steps_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_passport_steps_tags_parent_id_idx" ON "pages_blocks_pellegrina_passport_steps_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_passport_steps_order_idx" ON "pages_blocks_pellegrina_passport_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_passport_steps_parent_id_idx" ON "pages_blocks_pellegrina_passport_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_passport_order_idx" ON "pages_blocks_pellegrina_passport" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_passport_parent_id_idx" ON "pages_blocks_pellegrina_passport" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_passport_path_idx" ON "pages_blocks_pellegrina_passport" USING btree ("_path");
  CREATE INDEX "pages_blocks_pellegrina_values_items_order_idx" ON "pages_blocks_pellegrina_values_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_values_items_parent_id_idx" ON "pages_blocks_pellegrina_values_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_values_order_idx" ON "pages_blocks_pellegrina_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_values_parent_id_idx" ON "pages_blocks_pellegrina_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_values_path_idx" ON "pages_blocks_pellegrina_values" USING btree ("_path");
  CREATE INDEX "pages_blocks_pellegrina_guides_includes_order_idx" ON "pages_blocks_pellegrina_guides_includes" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_guides_includes_parent_id_idx" ON "pages_blocks_pellegrina_guides_includes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_guides_pages_order_idx" ON "pages_blocks_pellegrina_guides_pages" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_guides_pages_parent_id_idx" ON "pages_blocks_pellegrina_guides_pages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_guides_order_idx" ON "pages_blocks_pellegrina_guides" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_guides_parent_id_idx" ON "pages_blocks_pellegrina_guides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_guides_path_idx" ON "pages_blocks_pellegrina_guides" USING btree ("_path");
  CREATE INDEX "pages_blocks_pellegrina_suitcase_categories_items_order_idx" ON "pages_blocks_pellegrina_suitcase_categories_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_suitcase_categories_items_parent_id_idx" ON "pages_blocks_pellegrina_suitcase_categories_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_suitcase_categories_order_idx" ON "pages_blocks_pellegrina_suitcase_categories" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_suitcase_categories_parent_id_idx" ON "pages_blocks_pellegrina_suitcase_categories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_suitcase_order_idx" ON "pages_blocks_pellegrina_suitcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_suitcase_parent_id_idx" ON "pages_blocks_pellegrina_suitcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_suitcase_path_idx" ON "pages_blocks_pellegrina_suitcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_pellegrina_postcards_items_order_idx" ON "pages_blocks_pellegrina_postcards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_postcards_items_parent_id_idx" ON "pages_blocks_pellegrina_postcards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_postcards_order_idx" ON "pages_blocks_pellegrina_postcards" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_postcards_parent_id_idx" ON "pages_blocks_pellegrina_postcards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_postcards_path_idx" ON "pages_blocks_pellegrina_postcards" USING btree ("_path");
  CREATE INDEX "pages_blocks_pellegrina_destination_ways_order_idx" ON "pages_blocks_pellegrina_destination_ways" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_destination_ways_parent_id_idx" ON "pages_blocks_pellegrina_destination_ways" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_destination_order_idx" ON "pages_blocks_pellegrina_destination" USING btree ("_order");
  CREATE INDEX "pages_blocks_pellegrina_destination_parent_id_idx" ON "pages_blocks_pellegrina_destination" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pellegrina_destination_path_idx" ON "pages_blocks_pellegrina_destination" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_background_image_idx" ON "pages_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_features_items_order_idx" ON "pages_blocks_features_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_items_parent_id_idx" ON "pages_blocks_features_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_plans_features_order_idx" ON "pages_blocks_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_features_parent_id_idx" ON "pages_blocks_pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_plans_order_idx" ON "pages_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_parent_id_idx" ON "pages_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_avatar_idx" ON "pages_blocks_testimonials_items" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_hero_address_lines" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_hero_chips" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_hero" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_why" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_passport_steps_tags" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_passport_steps" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_passport" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_values_items" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_values" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_guides_includes" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_guides_pages" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_guides" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_suitcase_categories_items" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_suitcase_categories" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_suitcase" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_postcards_items" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_postcards" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_destination_ways" CASCADE;
  DROP TABLE "pages_blocks_pellegrina_destination" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_features_items" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans_features" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans" CASCADE;
  DROP TABLE "pages_blocks_pricing" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_pellegrina_hero_chips_color";
  DROP TYPE "public"."enum_pages_blocks_pellegrina_values_items_tone";
  DROP TYPE "public"."enum_pages_blocks_pellegrina_suitcase_categories_season";
  DROP TYPE "public"."enum_pages_blocks_pellegrina_destination_ways_tone";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";`)
}
