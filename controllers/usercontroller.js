import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import bcrypt from "bcryptjs";



const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body; // Destructure phoneNumber

  console.log("Request Body:", req.body);
  try {
    // Check for all required fields
    if (!username || !email || !password ) {
      return res.status(400).json({ message: "Please fill all the inputs." });
    }
  
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);



    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });


    await newUser.save(); // Save the user with the OTP

    // Create the token for the user
    createToken(res, newUser._id);

    res.status(201).json({
      success: true,
      message: "User created successfully. An OTP has been sent to your phone.",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role, // Include role
      },
    });
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error." }); // Return a generic error message
  }
});




const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find the existing user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

 

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create a token for the user
    const token = createToken(res, existingUser._id);
    
    // Log the token (optional, for debugging)
    console.log("Generated Token:", token);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error." });
  }
});


const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});



const getCurrentUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        pic: user.pic,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);

    if (error.name === 'CastError') {
      res.status(400);
      throw new Error('Invalid otp');
    } else {
      res.status(500);
      throw new Error('Error fetching user profile');
    }
  }
});


const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  try {
    console.log("User ID:", req.user._id); // Check if user ID is present
    console.log("Request Body:", req.body); // Log the entire request body

    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if they are provided in the request
    user.username = req.body.username !== undefined ? req.body.username : user.username;
    user.firstName = req.body.firstName !== undefined ? req.body.firstName : user.firstName;
    user.lastName = req.body.lastName !== undefined ? req.body.lastName : user.lastName;
    user.email = req.body.email !== undefined ? req.body.email : user.email;

    // Handle profile picture update
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage; // Directly assign the object
    }

    // Save the updated user
    const updatedUser = await user.save();

    console.log("Updated User:", updatedUser);
    // Send back the updated user details
    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});


const updateUserPassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

   // Use bcrypt to compare current password
   const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
   if (!isMatch) {
       res.status(401);
       throw new Error('Current password is incorrect');
   }


    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error updating user password:', error);

    if (error.name === 'ValidationError') {
      res.status(400);
      throw new Error('Invalid password format');
    } else {
      res.status(500);
      throw new Error('Error updating user password');
    }
  }
});


const updateUserRole  = asyncHandler(async (req,res) =>{
    const { id } = req.params;
    const { role } = req.body;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.role = role || user.role;
      await user.save();
  
      res.status(201).json({
        success: true,
        message: "User role updated",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
      res.status(500);
      throw new Error('Error updating user');
    }
})




export {
  createUser,
  loginUser,
  logoutCurrentUser,
   getCurrentUserProfile,
  updateCurrentUserProfile,
  updateUserPassword,
  updateUserRole
};
