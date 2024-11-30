import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
    minlength: 10,
  },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  profileImage: {
    type: String, // URL to the image
    required: false, // Optional
  },
  publicId: {
    type: String, // For Cloudinary public ID
    required: false, // Optional
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

export default Testimonial;