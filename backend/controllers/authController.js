import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import {
  clearEmailVerification,
  createUser,
  findEmailVerification,
  findUserByEmail,
  markEmailVerified,
  upsertEmailVerification,
} from '../models/userModel.js';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtpEmail(email, otp) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email service is not configured on the server. Please contact support.');
    }

    // Development fallback keeps OTP flow testable even without SMTP.
    return { delivered: false, otp };
  }

  const smtpPort = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: smtpPort,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  await transporter.verify();

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: email,
    subject: 'CycleCare Email Verification OTP',
    text: `Your CycleCare verification code is ${otp}. It expires in 10 minutes.`,
  });

  return { delivered: true };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.email === 'admin@cyclecare.com' ? 'admin' : 'user' },
    process.env.JWT_SECRET || 'cyclecare-dev-secret',
    { expiresIn: '7d' }
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

export async function register(req, res) {
  try {
    const { name, password, age, cycleLength } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !password || !age) {
      return res.status(400).json({ message: 'Name, email, password, and age are required.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const verification = await findEmailVerification(email);
    if (!verification?.verified) {
      return res.status(400).json({ message: 'Please verify your email using OTP before registration.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash, age, cycleLength });
    await clearEmailVerification(email);
    const token = signToken(user);

    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
}

export async function sendSignupOtp(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered. Please login.' });
    }

    const otp = createOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await upsertEmailVerification({ email, otpHash, expiresAt });
    const deliveryResult = await sendOtpEmail(email, otp);

    return res.json({
      message: 'OTP sent to your email.',
      ...(deliveryResult?.delivered === false ? { devOtp: otp } : {}),
    });
  } catch (error) {
    const message = String(error?.message || 'Failed to send OTP.');
    if (message.toLowerCase().includes('invalid login') || message.toLowerCase().includes('auth')) {
      return res.status(500).json({ message: 'SMTP authentication failed. Please check SMTP_USER/SMTP_PASS.' });
    }

    return res.status(500).json({ message });
  }
}

export async function verifySignupOtp(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const verification = await findEmailVerification(email);
    if (!verification) {
      return res.status(400).json({ message: 'No OTP request found for this email.' });
    }

    if (new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    const validOtp = await bcrypt.compare(otp, verification.otp_hash);
    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    await markEmailVerified(email);
    return res.json({ message: 'Email verified successfully.', verified: true });
  } catch {
    return res.status(500).json({ message: 'OTP verification failed.' });
  }
}

export async function login(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);

    return res.json({ token, user: sanitizeUser(user) });
  } catch {
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
}

export async function me(req, res) {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user: sanitizeUser(user) });
  } catch {
    return res.status(500).json({ message: 'Could not fetch profile.' });
  }
}