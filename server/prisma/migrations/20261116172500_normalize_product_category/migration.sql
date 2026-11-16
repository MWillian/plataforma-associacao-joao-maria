CREATE TYPE "ProductCategory" AS ENUM ('AGRICULTURE', 'CRAFTS');

ALTER TABLE "product"
ALTER COLUMN "category" TYPE "ProductCategory"
USING CASE
  WHEN LOWER("category") IN ('agricultura', 'agriculture')
    THEN 'AGRICULTURE'::"ProductCategory"
  WHEN LOWER("category") IN ('artesanato', 'crafts')
    THEN 'CRAFTS'::"ProductCategory"
  ELSE "category"::"ProductCategory"
END;
