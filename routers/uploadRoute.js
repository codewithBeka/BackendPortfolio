import express from 'express';

import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import {  uploadPhoto } from '../middlewares/uploadImage.js';
import { deleteMedia, uploadMedia } from '../controllers/uploadCtrl.js';

const router = express.Router();

router.post(
    '/',
    authenticate,
    uploadPhoto.array('media', 50),  // Accept up to 10 media files
    uploadMedia  // Controller for uploading media
);

router.delete('/delete/:public_id', authenticate, authorizeAdmin, deleteMedia);

export default router;
