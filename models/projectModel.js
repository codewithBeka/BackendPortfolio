import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },  
    simpleDescription: { // Added simple description field
        type: String,
        required: true, // You can change this to false if it's not required
    },
    technologies: [{
        name: { type: String, required: true },
        image: { type: String, required: false },
        publicId: { type: String, required: false }, // New field for storing the Cloudinary publicId
    }],
    media: [{
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true },
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Category model
        required: true,
    },
    liveUrl: {
        type: String,
        required: true,
    },
    githubUrl: {
        type: String,
        required: true,
    },
    featured: { // New field for featured projects
        type: Boolean,
        default: false, // Default value is false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;