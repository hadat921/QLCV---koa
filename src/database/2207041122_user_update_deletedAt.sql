BEGIN;

-- CREATE FIELD "deletedAt" ------------------------------------
ALTER TABLE "public"."Users" ADD COLUMN "deletedAt" Date NOT NULL;
-- -------------------------------------------------------------

COMMIT;
