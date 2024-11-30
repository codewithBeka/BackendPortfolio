// controllers/testimonialController.js
import Testimonial from '../models/TestimonialModel.js';

// Create a new testimonial
export const createTestimonial = async (req, res) => {
  const { quote, name, title, rating, profileImage, publicId } = req.body;

  try {
    const newTestimonial = new Testimonial({
      quote,
      name,
      title,
      rating,
      profileImage,
      publicId, // Set publicId here
    });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing testimonial
export const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { quote, name, title, rating, profileImage, publicId } = req.body;

  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { quote, name, title, rating, profileImage, publicId }, // Update publicId here
      { new: true }
    );
    res.status(200).json(updatedTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    if (!deletedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};