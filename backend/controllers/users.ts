import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import User from "../models/users"

const secretKey = process.env.SECRET_KEY;

/* login */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ msg: "Invalid username" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      secretKey,
      { expiresIn: "2h" }
    );

    res.cookie("jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: "lax", })
      .status(200)
      .json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        }
      });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

/* register */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, fullname, email, tel } = req.body;

    // Check if username exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullname,
      phone: tel ? Number(tel) : null,
    });

    return res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

/* get data for profile */
export const readProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const profile = await User.findOne({
      where: { id: userId },
      attributes: ["id", "username", "fullname", "email", "phone"],
      raw: true,
    });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

/* logout */
export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in production with HTTPS
  });
  return res.status(200).json({ msg: "Logged out successfully" });
};

/* edit profile*/
export const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, password, email, fullname, phone } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update only fields that are provided
    if (email !== undefined) user.email = email;
    if (fullname !== undefined) user.fullname = fullname;
    if (phone !== undefined) user.phone = Number(phone);

    // Handle password separately
    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    await user.save();

    return res.status(200).json({
      msg: "Profile updated successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};