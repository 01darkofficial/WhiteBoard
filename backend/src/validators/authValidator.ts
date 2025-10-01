// src/validators/authValidator.ts
import { body } from "express-validator";

// Registration Validator
export const registerValidator = [
  body('email')
    .trim() // remove leading/trailing whitespace
    .normalizeEmail() // convert email to lowercase, remove dots in Gmail, etc.
    .isEmail()
    .withMessage('Enter a valid email'),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    // .matches(/[A-Z]/)
    // .withMessage('Password must contain at least one uppercase letter')
    // .matches(/[a-z]/)
    // .withMessage('Password must contain at least one lowercase letter')
    // .matches(/[0-9]/)
    // .withMessage('Password must contain at least one number')
    // .matches(/[\W_]/)
    // .withMessage('Password must contain at least one special character'),
];

// Login Validator
export const loginValidator = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Enter a valid email'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];
