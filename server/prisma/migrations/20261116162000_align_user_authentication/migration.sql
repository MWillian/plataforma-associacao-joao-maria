CREATE TYPE "UserRole" AS ENUM ('ADMIN');

ALTER TABLE "user"
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "user"
DROP COLUMN "username",
DROP COLUMN "passwordResetTokenHash",
DROP COLUMN "passwordResetExpiresAt";
