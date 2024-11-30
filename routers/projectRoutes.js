import express from 'express';
import {
    createProject,
    getProjects,
    getAllProjects,
    updateProject,
    deleteProject,
    getProjectById
} from '../controllers/projectController.js';
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', authenticate,authorizeAdmin,createProject);
router.get('/', getProjects);
router.get('/all', getAllProjects);
router.get('/:id', getProjectById); // Add this line for getting a project by ID
router.put('/:id', authenticate,authorizeAdmin,updateProject);
router.delete('/:id',authenticate,authorizeAdmin, deleteProject);

export default router;