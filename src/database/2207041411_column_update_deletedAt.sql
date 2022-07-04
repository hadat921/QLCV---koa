BEGIN;

-- CREATE FIELD "deletedAt" ------------------------------------
ALTER TABLE "public"."Columns" ADD COLUMN "deletedAt" Timestamp With Time Zone NOT NULL;
-- -------------------------------------------------------------

COMMIT;
BEGIN;

-- CREATE FIELD "state" ----------------------------------------
ALTER TABLE "public"."Columns" ADD COLUMN "state" Boolean NOT NULL;
-- -------------------------------------------------------------

COMMIT;
