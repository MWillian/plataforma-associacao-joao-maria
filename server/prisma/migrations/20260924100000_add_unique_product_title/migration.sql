-- Normaliza os títulos existentes conforme a regra de negócio da aplicação.
UPDATE "product"
SET "title" = LOWER(BTRIM("title"));

-- Garante a unicidade mesmo quando houver requisições concorrentes.
CREATE UNIQUE INDEX "product_title_key" ON "product"("title");
