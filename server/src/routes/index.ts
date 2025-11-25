import express, { Application } from 'express';
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
import auditRoutes from '@/routes/audit.routes';
import complianceRoutes from '@/routes/compliance.route'
// import notificationRoutes from '@/routes/notification.routes';
import { authenticateToken } from '@/middlewares/auth.middleware';

export default function applyRoutes(app: Application) {
    // Pages
    app.use('/', pageRoutes);
    // Google Drive
    app.use('/google-drive', googleDriveRoutes);

    // ******** API Routes ********
    // Create a new router for API routes
    const apiRouter = express.Router();
    // Use authentication middleware for all API routes (secure routes)
    apiRouter.use(authenticateToken);
    // Define API routes
    apiRouter.use('/users', userRoutes);
    // Documents and Versions
    apiRouter.use('/documents', documentRoutes);
    apiRouter.use('/document-versions', versionRoutes);
    apiRouter.use('/document-types', documentTypeRoutes);
    apiRouter.use('/document-reviews', documentReviewRoutes);
    // Department and Roles
    apiRouter.use('/departments', departmentRoutes);
    apiRouter.use('/department-roles', departmentRoleRoutes);
    // Other routes
    apiRouter.use('/iso-clauses', isoClauseRoutes);
    apiRouter.use('/excel', excelRoutes);
    apiRouter.use('/invitation', invitationRoutes);
    apiRouter.use('/owners', ownerRoutes);
    apiRouter.use('/audits', auditRoutes);
    apiRouter.use('/compliance', complianceRoutes);
    // apiRouter.use('/notifications', notificationRoutes);

    // Apply the API router to the app
    app.use('/api', apiRouter);
    // Authentification and Authorization
    app.use('/auth', authRoutes);
}
