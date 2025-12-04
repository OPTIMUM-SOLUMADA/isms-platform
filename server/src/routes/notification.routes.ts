import express from 'express';
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

// Delete notification
router.delete('/:id', controller.delete.bind(controller));

export default router;

