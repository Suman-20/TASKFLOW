import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/genarateToken.js";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      _id: user._id,
      message: "User created successfully",
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


  export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "User logged in successfully",
      token: token
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      message: "User logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed"
    });
  }
};


