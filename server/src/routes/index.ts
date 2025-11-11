import { Application } from 'express';
import pageRoutes from '@/routes/page.routes';
import googleDriveRoutes from '@/routes/googledrive.routes';
import authRoutes from '@/routes/auth.routes';
import departmentRoutes from '@/routes/department.routes';
import userRoutes from '@/routes/user.routes';
import documentRoutes from '@/routes/document.routes';
import isoClauseRoutes from '@/routes/isoclause.route';
import documentTypeRoutes from '@/routes/documenttype.routes';
import documentReviewRoutes from '@/routes/documentreview.routes';
import excelRoutes from '@/routes/excel.routes';
import invitationRoutes from '@/routes/invitation.routes';
import ownerRoutes from '@/routes/owner.routes';
import departmentRoleRoutes from '@/routes/departmentrole.routes';
import versionRoutes from '@/routes/version.routes';

export default function applyRoutes(app: Application) {
    // Pages
    app.use('/', pageRoutes);

    // Google Drive
    app.use('/google-drive', googleDriveRoutes);

    // API
    app.use('/api/auth', authRoutes);
    app.use('/api/departments', departmentRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/documents', documentRoutes);
    app.use('/api/iso-clauses', isoClauseRoutes);
    app.use('/api/document-types', documentTypeRoutes);
    app.use('/api/document-reviews', documentReviewRoutes);
    app.use('/api/excel', excelRoutes);
    app.use('/api/invitation', invitationRoutes);
    app.use('/api/owners', ownerRoutes);
    app.use('/api/department-roles', departmentRoleRoutes);
    app.use('/api/document-versions', versionRoutes);
}
