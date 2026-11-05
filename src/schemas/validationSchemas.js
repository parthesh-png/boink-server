const { z } = require('zod');

// Registration Schema: Name min 3, valid email, password min 6
const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

// Login Schema
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, { message: 'Password is required' }),
});

// Profile Update Schema: Name min 3, Bio, Profile Picture URL (Email readonly)
const updateProfileSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' }),
  bio: z.string().max(500).optional().default(''),
  profilePicture: z.string().optional().default(''),
});

// Post Creation Schema
const createPostSchema = z.object({
  text: z.string().trim().optional().default(''),
  image: z.string().trim().optional().default(''),
}).refine((data) => data.text.length > 0 || data.image.length > 0, {
  message: 'Post must contain either text or an image',
  path: ['text'],
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createPostSchema,
};
