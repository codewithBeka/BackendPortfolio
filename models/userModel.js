import mongoose from "mongoose";




// Image Schema
const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'image/jpeg'
  publicId: { type: String, required: true },
}, { _id: false }); // Prevent Mongoose from creating an ID for this sub-document

// User Schema
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'employee'],
      default: 'admin',
    },
    firstName: { 
      type: String,
      required: false,
    },
    lastName: {  
      type: String,
      required: false,
    },
    profileImage: { 
      type: [ImageSchema],
      required: false,
    },


  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;