/**
 * Script to create PostgreSQL views for common data queries
 * Run with: npm run db:views
 */

import { prismaPostgres } from '../database/prisma';

const views = [
    // Document Overview View - Joins documents with their types, frequencies, and current versions
    {
        name: 'v_document_overview',
        sql: `
            CREATE OR REPLACE VIEW v_document_overview AS
            SELECT 
                d.id_document,
                d.title,
                d.description,
                d.status,
                d.is_published,
                d.publication_date,
                d.next_review_date,
                d.created_at,
                d.updated_at,
                t.id_type,
                t.name AS type_name,
                rf.id_review_frequency,
                rf.name AS review_frequency_name,
                v.id_version AS current_version_id,
                v.version AS current_version,
                v.file_url AS current_file_url,
                v.created_at AS version_created_at
            FROM document d
            LEFT JOIN type t ON d.id_type = t.id_type
            LEFT JOIN review_frequency rf ON d.id_review_frequency = rf.id_review_frequency
            LEFT JOIN version v ON d.id_document = v.id_document AND v.is_current = true;
        `,
    },
    // User Overview View - Joins users with their roles, functions, and departments
    {
        name: 'v_user_overview',
        sql: `
            CREATE OR REPLACE VIEW v_user_overview AS
            SELECT 
                u.id_user,
                u.email,
                u.name AS user_name,
                u.is_active,
                u.last_login,
                u.created_at,
                u.updated_at,
                r.id_role,
                r.name AS role_name,
                r.description AS role_description,
                f.id_function,
                f.name AS function_name,
                f.description AS function_description,
                dep.id_department,
                dep.name AS department_name,
                dep.description AS department_description
            FROM user_ u
            LEFT JOIN role r ON u.id_role = r.id_role
            LEFT JOIN function_ f ON u.id_function = f.id_function
            LEFT JOIN department dep ON f.id_department = dep.id_department;
        `,
    },
    // Document Authors View - Joins document authors with user and version info
    {
        name: 'v_document_authors',
        sql: `
            CREATE OR REPLACE VIEW v_document_authors AS
            SELECT 
                da.id_user,
                da.id_document,
                da.id_version,
                u.name AS author_name,
                u.email AS author_email,
                d.title AS document_title,
                v.version AS version_number,
                v.is_current AS is_current_version
            FROM document_author da
            JOIN user_ u ON da.id_user = u.id_user
            JOIN document d ON da.id_document = d.id_document
            JOIN version v ON da.id_version = v.id_version;
        `,
    },
    // Document Reviewers View - Joins document reviewers with user, document and approval info
    {
        name: 'v_document_reviewers',
        sql: `
            CREATE OR REPLACE VIEW v_document_reviewers AS
            SELECT 
                dr.id_user,
                dr.id_document,
                dr.id_version,
                dr.is_approuved,
                dr.approuved_at,
                dr.comment,
                u.name AS reviewer_name,
                u.email AS reviewer_email,
                d.title AS document_title,
                d.status AS document_status,
                v.version AS version_number,
                v.is_current AS is_current_version
            FROM document_reviewer dr
            JOIN user_ u ON dr.id_user = u.id_user
            JOIN document d ON dr.id_document = d.id_document
            JOIN version v ON dr.id_version = v.id_version;
        `,
    },
    // Pending Reviews View - Documents pending review for each reviewer
    {
        name: 'v_pending_reviews',
        sql: `
            CREATE OR REPLACE VIEW v_pending_reviews AS
            SELECT 
                dr.id_user,
                dr.id_document,
                dr.id_version,
                u.name AS reviewer_name,
                u.email AS reviewer_email,
                d.title AS document_title,
                d.status AS document_status,
                d.next_review_date,
                v.version AS version_number,
                v.created_at AS version_created_at,
                CASE 
                    WHEN d.next_review_date < CURRENT_DATE THEN true
                    ELSE false
                END AS is_overdue
            FROM document_reviewer dr
            JOIN user_ u ON dr.id_user = u.id_user
            JOIN document d ON dr.id_document = d.id_document
            JOIN version v ON dr.id_version = v.id_version
            WHERE dr.is_approuved = false
            AND v.is_current = true;
        `,
    },
    // Clause Compliance Overview - Joins clause compliance with ISO clauses and statuses
    {
        name: 'v_clause_compliance_overview',
        sql: `
            CREATE OR REPLACE VIEW v_clause_compliance_overview AS
            SELECT 
                cc.id_clause_compliance,
                cc.progress,
                cc.last_reviewed,
                cc.next_review,
                cc.created_at,
                cc.updated_at,
                ic.id_iso_clause,
                ic.code AS iso_clause_code,
                ic.name AS iso_clause_name,
                ic.description AS iso_clause_description,
                ccs.id_clause_compilance_status,
                ccs.name AS compliance_status_name,
                ccr.id_clause_compliance_risk,
                ccr.name AS compliance_risk_name
            FROM clause_compliance cc
            LEFT JOIN iso_clause ic ON cc.id_iso_clause = ic.id_iso_clause
            LEFT JOIN clause_compilance_status ccs ON cc.id_clause_compilance_status = ccs.id_clause_compilance_status
            LEFT JOIN clause_compliance_risk ccr ON cc.id_clause_compliance_risk = ccr.id_clause_compliance_risk;
        `,
    },
    // Non-Conformity Overview - Joins non-conformities with status, type and documents
    {
        name: 'v_non_conformity_overview',
        sql: `
            CREATE OR REPLACE VIEW v_non_conformity_overview AS
            SELECT 
                nc.id_non_conformity,
                ncs.id_non_conformity_status,
                ncs.name AS status_name,
                nct.id_non_conformity_type,
                nct.name AS type_name,
                d.id_document,
                d.title AS document_title
            FROM non_conformity nc
            LEFT JOIN non_conformity_status ncs ON nc.id_non_conformity_status = ncs.id_non_conformity_status
            LEFT JOIN non_conformity_type nct ON nc.id_non_conformity_type = nct.id_non_conformity_type
            LEFT JOIN document_non_conformity dnc ON nc.id_non_conformity = dnc.id_non_conformity
            LEFT JOIN document d ON dnc.id_document = d.id_document;
        `,
    },
    // Corrective Actions Overview - Joins corrective actions with status
    {
        name: 'v_corrective_actions_overview',
        sql: `
            CREATE OR REPLACE VIEW v_corrective_actions_overview AS
            SELECT 
                ca.id_corrective_action,
                ca.description,
                ca.due_date,
                ca.completed_at,
                ast.id_action_status,
                ast.name AS action_status_name,
                ncs.id_non_conformity_status,
                ncs.name AS non_conformity_status_name,
                CASE 
                    WHEN ca.due_date < CURRENT_DATE AND ca.completed_at IS NULL THEN true
                    ELSE false
                END AS is_overdue
            FROM corrective_action ca
            LEFT JOIN action_status ast ON ca.id_action_status = ast.id_action_status
            LEFT JOIN non_conformity_status ncs ON ca.id_non_conformity_status = ncs.id_non_conformity_status;
        `,
    },
    // Department Documents View - Documents per department with classifications
    {
        name: 'v_department_documents',
        sql: `
            CREATE OR REPLACE VIEW v_department_documents AS
            SELECT 
                dep.id_department,
                dep.name AS department_name,
                d.id_document,
                d.title AS document_title,
                d.status AS document_status,
                d.is_published,
                c.id_classification,
                c.name AS classification_name
            FROM department_document_classification ddc
            JOIN department dep ON ddc.id_department = dep.id_department
            JOIN document d ON ddc.id_document = d.id_document
            JOIN classification c ON ddc.id_classification = c.id_classification;
        `,
    },
    // Document ISO Clauses View - Documents with their associated ISO clauses
    {
        name: 'v_document_iso_clauses',
        sql: `
            CREATE OR REPLACE VIEW v_document_iso_clauses AS
            SELECT 
                d.id_document,
                d.title AS document_title,
                d.status AS document_status,
                ic.id_iso_clause,
                ic.code AS iso_clause_code,
                ic.name AS iso_clause_name,
                ic.description AS iso_clause_description
            FROM document_clause dc
            JOIN document d ON dc.id_document = d.id_document
            JOIN iso_clause ic ON dc.id_iso_clause = ic.id_iso_clause;
        `,
    },
    // Dashboard Statistics View - Aggregate statistics for dashboard
    {
        name: 'v_dashboard_stats',
        sql: `
            CREATE OR REPLACE VIEW v_dashboard_stats AS
            SELECT 
                (SELECT COUNT(*) FROM document) AS total_documents,
                (SELECT COUNT(*) FROM document WHERE is_published = true) AS published_documents,
                (SELECT COUNT(*) FROM document WHERE status = 'draft') AS draft_documents,
                (SELECT COUNT(*) FROM document WHERE next_review_date < CURRENT_DATE) AS overdue_documents,
                (SELECT COUNT(*) FROM user_ WHERE is_active = true) AS active_users,
                (SELECT COUNT(*) FROM user_) AS total_users,
                (SELECT COUNT(*) FROM department) AS total_departments,
                (SELECT COUNT(*) FROM non_conformity) AS total_non_conformities,
                (SELECT COUNT(*) FROM corrective_action WHERE completed_at IS NULL) AS open_corrective_actions,
                (SELECT COUNT(*) FROM document_reviewer WHERE is_approuved = false) AS pending_reviews;
        `,
    },
];

async function createViews() {
    console.log('🔄 Creating PostgreSQL views...\n');

    for (const view of views) {
        try {
            await prismaPostgres.$executeRawUnsafe(view.sql);
            console.log(`✅ Created view: ${view.name}`);
        } catch (error) {
            console.error(`❌ Failed to create view ${view.name}:`, error);
        }
    }

    console.log('\n✅ Finished creating PostgreSQL views');
}

async function dropViews() {
    console.log('🔄 Dropping PostgreSQL views...\n');

    for (const view of views.reverse()) {
        try {
            await prismaPostgres.$executeRawUnsafe(`DROP VIEW IF EXISTS ${view.name} CASCADE;`);
            console.log(`✅ Dropped view: ${view.name}`);
        } catch (error) {
            console.error(`❌ Failed to drop view ${view.name}:`, error);
        }
    }

    console.log('\n✅ Finished dropping PostgreSQL views');
}

async function main() {
    const command = process.argv[2];

    try {
        if (command === 'drop') {
            await dropViews();
        } else {
            await createViews();
        }
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await prismaPostgres.$disconnect();
    }
}

main();
