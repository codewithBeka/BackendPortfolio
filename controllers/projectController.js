import Project from '../models/projectModel.js';
import Category from '../models/catagoryModel.js';

export const createProject = async (req, res) => {
    const project = new Project(req.body);
    try {
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        const { categoryName, page = 1, limit = 4 } = req.query;

        let filter = {};
        
        // Check if categoryName is provided
        if (categoryName) {
            const category = await Category.findOne({ name: categoryName });
            if (category) {
                filter.category = category._id; // Filter by category ID
            } else {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        // Fetch projects based on the filter
        const projects = await Project.find(filter)
            .populate('category')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const totalCount = await Project.countDocuments(filter); // Get total count for pagination
        res.json({ projects, totalCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllProjects = async (req, res) => {
    try {
        // Fetch all projects without filters
        const projects = await Project.find().populate('category');

        res.json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('category');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};