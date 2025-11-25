import express from 'express';
import { ComplianceController } from '@/controllers/compliance.controller';
import { validate } from '@/middlewares/validate.middleware';
import { googleAuthMiddleware } from '@/middlewares/google-auth.middleware';
import {
  updateClauseStatusSchema,
  updateDocumentComplianceSchema,
  createNonConformitySchema,
  updateNonConformityStatusSchema,
  createCorrectiveActionSchema,
  updateCorrectiveActionStatusSchema
} from '@/validators/compliance.validator';

const router = express.Router();
const controller = new ComplianceController();

// -------------------------
// CLAUSES
// -------------------------
router.get('/clauses', controller.getClauses.bind(controller));
router.patch(
  '/clauses/:id',
  validate(updateClauseStatusSchema),
  googleAuthMiddleware,
  controller.updateClauseStatus.bind(controller)
);

// -------------------------
// DOCUMENT COMPLIANCE
// -------------------------
router.get('/documents/:id', controller.getDocumentCompliance.bind(controller));
router.patch(
  '/documents/:id',
  validate(updateDocumentComplianceSchema),
  googleAuthMiddleware,
  controller.updateDocumentCompliance.bind(controller)
);

// -------------------------
// NON-CONFORMITIES
// -------------------------
router.get('/nonconformities', controller.getNonConformities.bind(controller));
router.post(
  '/nonconformities',
  validate(createNonConformitySchema),
  googleAuthMiddleware,
  controller.createNonConformity.bind(controller)
);
router.patch(
  '/nonconformities/:id/status',
  validate(updateNonConformityStatusSchema),
  googleAuthMiddleware,
  controller.updateNonConformityStatus.bind(controller)
);

// -------------------------
// CORRECTIVE ACTIONS
// -------------------------
router.get('/corrective-actions/:nonConformityId', controller.getCorrectiveActions.bind(controller));
router.post(
  '/corrective-actions',
  validate(createCorrectiveActionSchema),
  googleAuthMiddleware,
  controller.createCorrectiveAction.bind(controller)
);
router.patch(
  '/corrective-actions/:id/status',
  validate(updateCorrectiveActionStatusSchema),
  googleAuthMiddleware,
  controller.updateCorrectiveActionStatus.bind(controller)
);

export default router;
