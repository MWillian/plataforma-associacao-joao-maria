-- "Excluir" aviso = arquivar (preserva o histórico de destinatários).
ALTER TABLE "notice" ADD COLUMN "archived_at" TIMESTAMP(3);
