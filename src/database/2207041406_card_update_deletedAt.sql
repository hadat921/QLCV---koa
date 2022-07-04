BEGIN;

-- CREATE FIELD "deletedAt" ------------------------------------
ALTER TABLE "public"."Cards" ADD COLUMN "deletedAt" Timestamp With Time Zone NOT NULL;
-- -------------------------------------------------------------

COMMIT;