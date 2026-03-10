import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

import {
  clearEmailVerification,
  createUser,
  findEmailVerification,
  findUserByEmail,
  markEmailVerified,
  upsertEmailVerification,
} from "../models/userModel.js";

const resend = new Resend(process.env.RESEND_API_KEY);

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.email === "admin@cyclecare.com" ? "admin" : "user",
    },
    process.env.JWT_SECRET || "cyclecare-dev-secret",
    { expiresIn: "7d" }
  );
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    age: user.age,
    cycle_length: user.cycle_length,
  };
}

/* ---------------- SEND OTP EMAIL ---------------- */

async function sendOtpEmail(email, otp) {

  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email service is not configured on the server.");
  }

  try {

    const response = await resend.emails.send({
      from: "CycleCare <onboarding@resend.dev>",   // test sender
      to: email,                                   // send to user email
      subject: "CycleCare Email Verification OTP",
      html: `
        <h2>Your CycleCare OTP</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    console.log("Email sent:", response);

  } catch (error) {

    console.error("Resend error:", error);

    throw new Error("Failed to send email");

  }

  return { delivered: true };
}
/* ---------------- REGISTER ---------------- */

export async function register(req, res) {
  try {
    const { name, password, age, cycleLength } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !password || !age) {
      return res
        .status(400)
        .json({ message: "Name, email, password, and age are required." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const verification = await findEmailVerification(email);
    if (!verification?.verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email using OTP before registration." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email,
      passwordHash,
      age,
      cycleLength,
    });

    await clearEmailVerification(email);

    const token = signToken(user);

    return res.status(201).json({ token, user: sanitizeUser(user) });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Registration failed. Please try again." });
  }
}

/* ---------------- SEND OTP ---------------- */

export async function sendSignupOtp(req, res) {
  try {

    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered. Please login." });
    }

    const otp = createOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await upsertEmailVerification({
      email,
      otpHash,
      expiresAt,
    });

    await sendOtpEmail(email, otp);

    return res.json({
      message: "OTP sent to your email.",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Failed to send OTP.",
    });
  }
}

/* ---------------- VERIFY OTP ---------------- */

export async function verifySignupOtp(req, res) {
  try {

    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

    const verification = await findEmailVerification(email);

    if (!verification) {
      return res.status(400).json({
        message: "No OTP request found for this email.",
      });
    }

    if (new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({
        message: "OTP expired. Please request a new one.",
      });
    }

    const validOtp = await bcrypt.compare(otp, verification.otp_hash);

    if (!validOtp) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    await markEmailVerified(email);

    return res.json({
      message: "Email verified successfully.",
      verified: true,
    });

  } catch {

    return res.status(500).json({
      message: "OTP verification failed.",
    });

  }
}

/* ---------------- LOGIN ---------------- */

export async function login(req, res) {
  try {

    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const matches = await bcrypt.compare(password, user.password_hash);

    if (!matches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: sanitizeUser(user),
    });

  } catch {

    return res.status(500).json({
      message: "Login failed. Please try again.",
    });

  }
}

/* ---------------- CURRENT USER ---------------- */

export async function me(req, res) {
  try {

    const user = await findUserByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      user: sanitizeUser(user),
    });

  } catch {

    return res.status(500).json({
      message: "Could not fetch profile.",
    });

  }
}