// backend/models/Skill.js
import mongoose from 'mongoose';

const technologySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: false },
    publicId: { type: String, required: false }, // For Cloudinary public ID
});

const skillSchema = new mongoose.Schema({
    technologies: [technologySchema] // Array of technologies
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;