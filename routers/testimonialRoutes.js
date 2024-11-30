import express from 'express';
import {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/',authenticate,authorizeAdmin, createTestimonial);
router.get('/', getAllTestimonials);
router.put('/:id',authenticate,authorizeAdmin, updateTestimonial);
router.delete('/:id',authenticate,authorizeAdmin, deleteTestimonial);

export default router;