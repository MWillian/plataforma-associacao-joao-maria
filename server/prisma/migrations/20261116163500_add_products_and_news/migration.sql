ALTER TABLE "product"
ADD COLUMN "price" DECIMAL(10, 2),
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "product_image" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_image_pkey" PRIMARY KEY ("id")
);

CREATE TYPE "NewsPublicationArea" AS ENUM ('STUDIO', 'CRAFTS', 'AGRICULTURE');

CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publication_area" "NewsPublicationArea" NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "news_image" (
    "id" TEXT NOT NULL,
    "news_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_image_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "product_image_product_id_sort_order_idx"
ON "product_image"("product_id", "sort_order");

CREATE INDEX "news_publication_area_published_created_at_idx"
ON "news"("publication_area", "published", "created_at");

CREATE INDEX "news_image_news_id_sort_order_idx"
ON "news_image"("news_id", "sort_order");

ALTER TABLE "product_image"
ADD CONSTRAINT "product_image_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "product"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "news_image"
ADD CONSTRAINT "news_image_news_id_fkey"
FOREIGN KEY ("news_id") REFERENCES "news"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

DROP TABLE "event";
