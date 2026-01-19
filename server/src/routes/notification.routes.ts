import express from 'express';
// eslint-disable-next-line import/no-named-as-default
import NotificationController from '@/controllers/notification.controller';

const router = express.Router();
const controller = NotificationController;

// List notifications (for current user)
router.get('/', controller.list.bind(controller));

// Get single notification
router.get('/:id', controller.getById.bind(controller));

// Create notification
router.post('/', controller.create.bind(controller));

// Mark a notification as read
router.post('/:id/read', controller.markRead.bind(controller));

// Mark all notifications for the current user as read
router.post('/mark-all-read', controller.markAllRead.bind(controller));

// Delete all notifications for the current user
router.delete('/delete-all', controller.deleteAll.bind(controller));

// Delete notification
router.delete('/:id', controller.delete.bind(controller));

export default router;
