-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReviewDecision" AS ENUM ('APPROVE', 'REJECT', 'REQUEST_CHANGES');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'EXPIRED');

-- CreateTable
CREATE TABLE "department" (
    "id_department" VARCHAR(40) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id_department")
);

-- CreateTable
CREATE TABLE "role" (
    "id_role" VARCHAR(40) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "classification" (
    "id_classification" VARCHAR(40) NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "classification_pkey" PRIMARY KEY ("id_classification")
);

-- CreateTable
CREATE TABLE "review_frequency" (
    "id_review_frequency" VARCHAR(40) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "review_frequency_pkey" PRIMARY KEY ("id_review_frequency")
);

-- CreateTable
CREATE TABLE "type" (
    "id_type" VARCHAR(40) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "type_pkey" PRIMARY KEY ("id_type")
);

-- CreateTable
CREATE TABLE "function_" (
    "id_function" VARCHAR(40) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "id_department" VARCHAR(40) NOT NULL,

    CONSTRAINT "function__pkey" PRIMARY KEY ("id_function")
);

-- CreateTable
CREATE TABLE "iso_clause" (
    "id_iso_clause" VARCHAR(40) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "iso_clause_pkey" PRIMARY KEY ("id_iso_clause")
);

-- CreateTable
CREATE TABLE "non_conformity_status" (
    "id_non_conformity_status" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "non_conformity_status_pkey" PRIMARY KEY ("id_non_conformity_status")
);

-- CreateTable
CREATE TABLE "non_conformity_type" (
    "id_non_conformity_type" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "non_conformity_type_pkey" PRIMARY KEY ("id_non_conformity_type")
);

-- CreateTable
CREATE TABLE "action_status" (
    "id_action_status" VARCHAR(40) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "action_status_pkey" PRIMARY KEY ("id_action_status")
);

-- CreateTable
CREATE TABLE "clause_compliance_risk" (
    "id_clause_compliance_risk" VARCHAR(40) NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "clause_compliance_risk_pkey" PRIMARY KEY ("id_clause_compliance_risk")
);

-- CreateTable
CREATE TABLE "clause_compilance_status" (
    "id_clause_compilance_status" VARCHAR(40) NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "clause_compilance_status_pkey" PRIMARY KEY ("id_clause_compilance_status")
);

-- CreateTable
CREATE TABLE "user_" (
    "id_user" VARCHAR(40) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "password_hash" VARCHAR(100) NOT NULL,
    "last_login" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "id_function" VARCHAR(40) NOT NULL,
    "id_role" VARCHAR(40) NOT NULL,

    CONSTRAINT "user__pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "document" (
    "id_document" VARCHAR(40) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(10) NOT NULL,
    "is_published" BOOLEAN NOT NULL,
    "publication_date" TIMESTAMPTZ,
    "next_review_date" DATE NOT NULL,
    "updated_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_review_frequency" VARCHAR(40) NOT NULL,
    "id_type" VARCHAR(40) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id_document")
);

-- CreateTable
CREATE TABLE "version" (
    "id_version" VARCHAR(40) NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "comment" TEXT,
    "file_url" VARCHAR(250),
    "is_current" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_document" VARCHAR(40) NOT NULL,

    CONSTRAINT "version_pkey" PRIMARY KEY ("id_version")
);

-- CreateTable
CREATE TABLE "non_conformity" (
    "id_non_conformity" VARCHAR(40) NOT NULL,
    "id_non_conformity_status" VARCHAR(50) NOT NULL,
    "id_non_conformity_type" VARCHAR(50) NOT NULL,

    CONSTRAINT "non_conformity_pkey" PRIMARY KEY ("id_non_conformity")
);

-- CreateTable
CREATE TABLE "corrective_action" (
    "id_corrective_action" VARCHAR(40) NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "id_action_status" VARCHAR(40) NOT NULL,
    "id_non_conformity_status" VARCHAR(50) NOT NULL,

    CONSTRAINT "corrective_action_pkey" PRIMARY KEY ("id_corrective_action")
);

-- CreateTable
CREATE TABLE "clause_compliance" (
    "id_clause_compliance" VARCHAR(40) NOT NULL,
    "progress" INTEGER,
    "last_reviewed" TIMESTAMPTZ,
    "next_review" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "id_iso_clause" VARCHAR(40) NOT NULL,
    "id_clause_compilance_status" VARCHAR(40) NOT NULL,
    "id_clause_compliance_risk" VARCHAR(40) NOT NULL,

    CONSTRAINT "clause_compliance_pkey" PRIMARY KEY ("id_clause_compliance")
);

-- CreateTable
CREATE TABLE "document_reviewer" (
    "id_user" VARCHAR(40) NOT NULL,
    "id_document" VARCHAR(40) NOT NULL,
    "id_version" VARCHAR(40) NOT NULL,
    "is_approuved" BOOLEAN NOT NULL,
    "approuved_at" TIMESTAMPTZ,
    "comment" TEXT,

    CONSTRAINT "document_reviewer_pkey" PRIMARY KEY ("id_user","id_document","id_version")
);

-- CreateTable
CREATE TABLE "document_author" (
    "id_user" VARCHAR(40) NOT NULL,
    "id_document" VARCHAR(40) NOT NULL,
    "id_version" VARCHAR(40) NOT NULL,

    CONSTRAINT "document_author_pkey" PRIMARY KEY ("id_user","id_document","id_version")
);

-- CreateTable
CREATE TABLE "department_document_classification" (
    "id_department" VARCHAR(40) NOT NULL,
    "id_document" VARCHAR(40) NOT NULL,
    "id_classification" VARCHAR(40) NOT NULL,

    CONSTRAINT "department_document_classification_pkey" PRIMARY KEY ("id_department","id_document","id_classification")
);

-- CreateTable
CREATE TABLE "document_clause" (
    "id_document" VARCHAR(40) NOT NULL,
    "id_iso_clause" VARCHAR(40) NOT NULL,

    CONSTRAINT "document_clause_pkey" PRIMARY KEY ("id_document","id_iso_clause")
);

-- CreateTable
CREATE TABLE "document_non_conformity" (
    "id_document" VARCHAR(40) NOT NULL,
    "id_non_conformity" VARCHAR(40) NOT NULL,

    CONSTRAINT "document_non_conformity_pkey" PRIMARY KEY ("id_document","id_non_conformity")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id_invitation" VARCHAR(40) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(100) NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "accepted_at" TIMESTAMPTZ,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_invited_by" VARCHAR(40) NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id_invitation")
);

-- CreateTable
CREATE TABLE "google_account" (
    "id_google_account" VARCHAR(40) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "google_id" VARCHAR(255),
    "access_token" TEXT,
    "refresh_token" TEXT,
    "token_expiry" TIMESTAMPTZ,
    "working_dir_id" VARCHAR(255),
    "is_logged_in" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "google_account_pkey" PRIMARY KEY ("id_google_account")
);

-- CreateTable
CREATE TABLE "document_owner" (
    "id_document_owner" VARCHAR(40) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_owner_pkey" PRIMARY KEY ("id_document_owner")
);

-- CreateTable
CREATE TABLE "department_role" (
    "id_department_role" VARCHAR(40) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "id_department" VARCHAR(40) NOT NULL,
    "id_created_by" VARCHAR(40),

    CONSTRAINT "department_role_pkey" PRIMARY KEY ("id_department_role")
);

-- CreateTable
CREATE TABLE "department_role_user" (
    "id_department_role_user" VARCHAR(40) NOT NULL,
    "id_department_role" VARCHAR(40) NOT NULL,
    "id_user" VARCHAR(40) NOT NULL,

    CONSTRAINT "department_role_user_pkey" PRIMARY KEY ("id_department_role_user")
);

-- CreateTable
CREATE TABLE "department_role_document" (
    "id_department_role_document" VARCHAR(40) NOT NULL,
    "id_department_role" VARCHAR(40) NOT NULL,
    "id_document" VARCHAR(40) NOT NULL,

    CONSTRAINT "department_role_document_pkey" PRIMARY KEY ("id_department_role_document")
);

-- CreateTable
CREATE TABLE "recently_viewed_document" (
    "id_recently_viewed" VARCHAR(40) NOT NULL,
    "id_user" VARCHAR(40) NOT NULL,
    "id_document" VARCHAR(40) NOT NULL,
    "viewed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recently_viewed_document_pkey" PRIMARY KEY ("id_recently_viewed")
);

-- CreateTable
CREATE TABLE "document_review" (
    "id_document_review" VARCHAR(40) NOT NULL,
    "id_document" VARCHAR(40) NOT NULL,
    "id_version" VARCHAR(40) NOT NULL,
    "id_reviewer" VARCHAR(40) NOT NULL,
    "decision" "ReviewDecision",
    "comment" TEXT,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "review_date" TIMESTAMPTZ,
    "due_date" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "document_review_pkey" PRIMARY KEY ("id_document_review")
);

-- CreateTable
CREATE TABLE "document_approval" (
    "id_document" VARCHAR(40) NOT NULL,
    "id_version" VARCHAR(40) NOT NULL,
    "id_approver" VARCHAR(40) NOT NULL,
    "approved_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,

    CONSTRAINT "document_approval_pkey" PRIMARY KEY ("id_document")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation_token_key" ON "invitation"("token");

-- CreateIndex
CREATE UNIQUE INDEX "document_approval_id_document_id_version_id_approver_key" ON "document_approval"("id_document", "id_version", "id_approver");

-- AddForeignKey
ALTER TABLE "function_" ADD CONSTRAINT "function__id_department_fkey" FOREIGN KEY ("id_department") REFERENCES "department"("id_department") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_" ADD CONSTRAINT "user__id_function_fkey" FOREIGN KEY ("id_function") REFERENCES "function_"("id_function") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_" ADD CONSTRAINT "user__id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "role"("id_role") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_id_review_frequency_fkey" FOREIGN KEY ("id_review_frequency") REFERENCES "review_frequency"("id_review_frequency") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_id_type_fkey" FOREIGN KEY ("id_type") REFERENCES "type"("id_type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "version" ADD CONSTRAINT "version_id_document_fkey" FOREIGN KEY ("id_document") REFERENCES "document"("id_document") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_conformity" ADD CONSTRAINT "non_conformity_id_non_conformity_status_fkey" FOREIGN KEY ("id_non_conformity_status") REFERENCES "non_conformity_status"("id_non_conformity_status") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_conformity" ADD CONSTRAINT "non_conformity_id_non_conformity_type_fkey" FOREIGN KEY ("id_non_conformity_type") REFERENCES "non_conformity_type"("id_non_conformity_type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrective_action" ADD CONSTRAINT "corrective_action_id_action_status_fkey" FOREIGN KEY ("id_action_status") REFERENCES "action_status"("id_action_status") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrective_action" ADD CONSTRAINT "corrective_action_id_non_conformity_status_fkey" FOREIGN KEY ("id_non_conformity_status") REFERENCES "non_conformity_status"("id_non_conformity_status") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clause_compliance" ADD CONSTRAINT "clause_compliance_id_iso_clause_fkey" FOREIGN KEY ("id_iso_clause") REFERENCES "iso_clause"("id_iso_clause") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clause_compliance" ADD CONSTRAINT "clause_compliance_id_clause_compilance_status_fkey" FOREIGN KEY ("id_clause_compilance_status") REFERENCES "clause_compilance_status"("id_clause_compilance_status") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clause_compliance" ADD CONSTRAINT "clause_compliance_id_clause_compliance_risk_fkey" FOREIGN KEY ("id_clause_compliance_risk") REFERENCES "clause_compliance_risk"("id_clause_compliance_risk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_reviewer" ADD CONSTRAINT "document_reviewer_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user_"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_reviewer" ADD CONSTRAINT "document_reviewer_id_document_fkey" FOREIGN KEY ("id_document") REFERENCES "document"("id_document") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_reviewer" ADD CONSTRAINT "document_reviewer_id_version_fkey" FOREIGN KEY ("id_version") REFERENCES "version"("id_version") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_author" ADD CONSTRAINT "document_author_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user_"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_author" ADD CONSTRAINT "document_author_id_document_fkey" FOREIGN KEY ("id_document") REFERENCES "document"("id_document") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_author" ADD CONSTRAINT "document_author_id_version_fkey" FOREIGN KEY ("id_version") REFERENCES "version"("id_version") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_document_classification" ADD CONSTRAINT "department_document_classification_id_department_fkey" FOREIGN KEY ("id_department") REFERENCES "department"("id_department") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_document_classification" ADD CONSTRAINT "department_document_classification_id_document_fkey" FOREIGN KEY ("id_document") REFERENCES "document"("id_document") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_document_classification" ADD CONSTRAINT "department_document_classification_id_classification_fkey" FOREIGN KEY ("id_classification") REFERENCES "classification"("id_classification") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_clause" ADD CONSTRAINT "document_clause_id_document_fkey" FOREIGN KEY ("id_document") REFERENCES "document"("id_document") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_clause" ADD CONSTRAINT "document_clause_id_iso_clause_fkey" FOREIGN KEY ("id_iso_clause") REFERENCES "iso_clause"("id_iso_clause") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_non_conformity" ADD CONSTRAINT "document_non_conformity_id_document_fkey" FOREIGN KEY ("id_document") REFERENCES "document"("id_document") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_non_conformity" ADD CONSTRAINT "document_non_conformity_id_non_conformity_fkey" FOREIGN KEY ("id_non_conformity") REFERENCES "non_conformity"("id_non_conformity") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_role_user" ADD CONSTRAINT "department_role_user_id_department_role_fkey" FOREIGN KEY ("id_department_role") REFERENCES "department_role"("id_department_role") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_role_document" ADD CONSTRAINT "department_role_document_id_department_role_fkey" FOREIGN KEY ("id_department_role") REFERENCES "department_role"("id_department_role") ON DELETE CASCADE ON UPDATE CASCADE;
