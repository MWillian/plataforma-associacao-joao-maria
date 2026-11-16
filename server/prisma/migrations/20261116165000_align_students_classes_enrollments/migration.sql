ALTER TABLE "guardian"
ALTER COLUMN "cpf" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

ALTER TABLE "student"
ADD COLUMN "email" TEXT,
ADD COLUMN "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN "is_minor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "allergies" TEXT,
ADD COLUMN "medical_conditions" TEXT,
ADD COLUMN "medications" TEXT,
ADD COLUMN "physical_restrictions" TEXT,
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "birth_date" DROP NOT NULL,
DROP COLUMN "medical_info";

ALTER TABLE "student"
ALTER COLUMN "phone" DROP DEFAULT;

ALTER TABLE "student_guardian"
ALTER COLUMN "relationship" SET DEFAULT 'Responsável';

CREATE UNIQUE INDEX "student_guardian_student_id_guardian_id_key"
ON "student_guardian"("student_id", "guardian_id");

ALTER TABLE "student_guardian"
DROP CONSTRAINT "student_guardian_student_id_fkey",
ADD CONSTRAINT "student_guardian_student_id_fkey"
FOREIGN KEY ("student_id") REFERENCES "student"("id")
ON DELETE CASCADE ON UPDATE CASCADE,
DROP CONSTRAINT "student_guardian_guardian_id_fkey",
ADD CONSTRAINT "student_guardian_guardian_id_fkey"
FOREIGN KEY ("guardian_id") REFERENCES "guardian"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "class"
DROP COLUMN "modality",
DROP COLUMN "schedule",
ADD COLUMN "turn" TEXT NOT NULL DEFAULT '',
ADD COLUMN "days" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "capacity" DROP NOT NULL;

ALTER TABLE "class"
ALTER COLUMN "turn" DROP DEFAULT;

CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'CANCELED');

ALTER TABLE "enrollment"
ALTER COLUMN "status" TYPE "EnrollmentStatus"
USING CASE
  WHEN LOWER("status") IN ('canceled', 'cancelled', 'cancelada', 'cancelado')
    THEN 'CANCELED'::"EnrollmentStatus"
  ELSE 'ACTIVE'::"EnrollmentStatus"
END,
ADD COLUMN "canceled_at" TIMESTAMP(3),
ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "enrollment_student_id_class_id_key"
ON "enrollment"("student_id", "class_id");

ALTER TABLE "enrollment"
DROP CONSTRAINT "enrollment_student_id_fkey",
ADD CONSTRAINT "enrollment_student_id_fkey"
FOREIGN KEY ("student_id") REFERENCES "student"("id")
ON DELETE CASCADE ON UPDATE CASCADE,
DROP CONSTRAINT "enrollment_class_id_fkey",
ADD CONSTRAINT "enrollment_class_id_fkey"
FOREIGN KEY ("class_id") REFERENCES "class"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
