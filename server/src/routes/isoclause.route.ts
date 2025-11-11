import { Router } from 'express';
import { ISOClauseController } from '@/controllers/isoclause.controller';
import { isoClauseCreateSchema, isoClauseUpdateSchema } from '@/validators/isoclause.validator';
import { validate } from '@/middlewares/validate.middleware';

const router = Router();
const controller = new ISOClauseController();

// search iso clauses
router.get('/search', controller.search.bind(controller));

router.post('/', validate(isoClauseCreateSchema), controller.create.bind(controller));
router.post('/initialize', controller.initialize.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.put('/:id', validate(isoClauseUpdateSchema), controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
