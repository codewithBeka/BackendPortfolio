// routes/messageRoutes.js
import express from 'express';
import { createMessage, getMessages,markAsUnread } from '../controllers/messageController.js';
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post('/', createMessage);
router.get('/',authenticate, authorizeAdmin,getMessages);
router.patch('/:id/mark-read', authenticate, authorizeAdmin, markAsUnread); // New route for marking as unread

export default router;