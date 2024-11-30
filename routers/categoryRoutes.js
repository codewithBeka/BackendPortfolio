import express from 'express';
import {
    createCategory,
    getCategories,
    updateCategory,
    getCategoryById,
    deleteCategory
} from '../controllers/categoryController.js';
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/',authenticate,authorizeAdmin, createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id',authenticate,authorizeAdmin, updateCategory);
router.delete('/:id',authenticate,authorizeAdmin, deleteCategory);

export default router;