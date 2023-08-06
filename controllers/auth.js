import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    //  data received from the frontend
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Generate a salt for password hashing
    const salt = await bcrypt.genSalt();
    // Hash the password using bcrypt and the generated salt
    const passwordHash = await bcrypt.hash(password, salt);

    //  creating a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // saving the user to the database
    const savedUser = await newUser.save();
    
    // Send a success response with the saved user object
    res.status(201).json(savedUser);
  } catch (err) {
    // Send an error response if any error occurs
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    //req.body is used for post method
    const { email, password } = req.body;
    //find in the User table that user email is equal to email
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials." });

    //token used to allow access to resources by authenticating
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    //because we dont show password
    delete user.password;
    //so that user save this to use it to access private resources
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
