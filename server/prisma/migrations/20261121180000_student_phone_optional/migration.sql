-- O cadastro de aluno no front trata o telefone como opcional.
ALTER TABLE "student" ALTER COLUMN "phone" DROP NOT NULL;
