// backend/controllers/skillsController.js
import Skill from '../models/Skill.js';

// Get all skills
export const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new skill
export const createSkill = async (req, res) => {
    const skill = new Skill(req.body);
    try {
        const savedSkill = await skill.save();
        res.status(201).json(savedSkill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a skill
export const deleteSkill = async (req, res) => {
    try {
        const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
        res.json(deletedSkill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};