DROP TABLE "email_notification";

CREATE TYPE "NoticeType" AS ENUM ('INFORMATION', 'CANCELLATION');

CREATE TYPE "NoticeDeliveryStatus" AS ENUM (
    'PENDING',
    'SENT',
    'SKIPPED',
    'FAILED'
);

CREATE TABLE "notice" (
    "id" TEXT NOT NULL,
    "type" "NoticeType" NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMP(3),
    "total_recipients" INTEGER NOT NULL DEFAULT 0,
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "skipped_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "notice_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notice_class" (
    "id" TEXT NOT NULL,
    "notice_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,

    CONSTRAINT "notice_class_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notice_recipient" (
    "id" TEXT NOT NULL,
    "notice_id" TEXT NOT NULL,
    "student_id" TEXT,
    "guardian_id" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" "NoticeDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "failure_reason" TEXT,
    "sent_at" TIMESTAMP(3),

    CONSTRAINT "notice_recipient_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "notice_created_at_idx"
ON "notice"("created_at");

CREATE UNIQUE INDEX "notice_class_notice_id_class_id_key"
ON "notice_class"("notice_id", "class_id");

CREATE UNIQUE INDEX "notice_recipient_notice_id_email_key"
ON "notice_recipient"("notice_id", "email");

CREATE INDEX "notice_recipient_notice_id_status_idx"
ON "notice_recipient"("notice_id", "status");

ALTER TABLE "notice"
ADD CONSTRAINT "notice_sender_id_fkey"
FOREIGN KEY ("sender_id") REFERENCES "user"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "notice_class"
ADD CONSTRAINT "notice_class_notice_id_fkey"
FOREIGN KEY ("notice_id") REFERENCES "notice"("id")
ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "notice_class_class_id_fkey"
FOREIGN KEY ("class_id") REFERENCES "class"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notice_recipient"
ADD CONSTRAINT "notice_recipient_notice_id_fkey"
FOREIGN KEY ("notice_id") REFERENCES "notice"("id")
ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "notice_recipient_student_id_fkey"
FOREIGN KEY ("student_id") REFERENCES "student"("id")
ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT "notice_recipient_guardian_id_fkey"
FOREIGN KEY ("guardian_id") REFERENCES "guardian"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
