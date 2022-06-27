BEGIN;

-- CHANGE "NULLABLE" OF "FIELD "comment" -----------------------
ALTER TABLE "public"."Cards" ALTER COLUMN "comment" DROP NOT NULL;
-- -------------------------------------------------------------

COMMIT;
