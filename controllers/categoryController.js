import Category from '../models/catagoryModel.js';

// Create a new category
export const createCategory = async (req, res) => {
    const category = new Category(req.body);
    try {
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        console.error('Error creating category:', err); // Log the error for debugging
        res.status(400).json({ message: 'Failed to create category', error: err.message });
    }
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err); // Log the error for debugging
        res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
    }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (err) {
        console.error('Error updating category:', err); // Log the error for debugging
        res.status(400).json({ message: 'Failed to update category', error: err.message });
    }
};

// Get a category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        console.error('Error fetching category by ID:', err);
        res.status(500).json({ message: 'Failed to fetch category', error: err.message });
    }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting category:', err); // Log the error for debugging
        res.status(400).json({ message: 'Failed to delete category', error: err.message });
    }
};