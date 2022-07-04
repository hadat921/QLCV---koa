BEGIN;

-- CREATE FIELD "    state: {
" --------------------------------
ALTER TABLE "public"."Users" ADD COLUMN "    state: {
" Boolean DEFAULT 'true' NOT NULL;
-- -------------------------------------------------------------

COMMIT;
