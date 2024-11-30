// backend/routes/skills.js
import express from 'express';
import { getAllSkills, createSkill, deleteSkill } from '../controllers/skillsController.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes
router.get('/', getAllSkills);
router.post('/',authenticate, authorizeAdmin,createSkill);
router.delete('/:id',authenticate, authorizeAdmin, deleteSkill);

export default router;