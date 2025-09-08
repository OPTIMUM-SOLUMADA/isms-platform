import express from 'express';
import { DocumentController } from '@/controllers/document.controller';
import { validate } from '@/middlewares/validate';
import { documentCreateSchema } from '@/validators/document.validator';
import { uploadSingleDocument } from '@/middlewares/upload-document';
import { EmailTemplate } from '@/configs/email-template';

const router = express.Router();
const controller = new DocumentController();

router.post(
    '/',
    validate(documentCreateSchema),
    uploadSingleDocument,
    controller.create.bind(controller),
);
router.get('/statistics', controller.getStatistics.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', uploadSingleDocument, controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
router.get('/', controller.list.bind(controller));
router.get('/download/:id', controller.download.bind(controller));
// publish document
router.put('/publish/:id', controller.publish.bind(controller));
// unpublish document
router.put('/unpublish/:id', controller.unpublish.bind(controller));

// EmailTemplate.review({
//     document: {
//         title: 'Document X',
//         description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
//         status: 'IN_REVIEW',
//     },
//     dueDate: '08/01/2025',
//     orgName: 'ISMS Solumada',
//     owner: {
//         email: 'njatotianafiononana@gmail.com',
//         name: 'Njato',
//     },
//     reviewer: {
//         name: 'Njato',
//     },
//     reviewLink: 'http://localhost:3000/review',
//     viewDocLink: 'http://localhost:3000/document/1',
//     year: '2025',
// }).then((res) => console.log(res));

EmailTemplate.resetPassword({
    user: {
        name: 'Njato',
    },
    resetLink: 'http://localhost:3000/document/1',
    year: '2025',
    orgName: 'ISMS SOLUMADA',
}).then((res) => console.log(res));

export default router;
