import { body, validationResult } from "express-validator";


const handleValidationRequest = (req, res, next) => {
  const errors = validationResult(req); // Check for validation errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Return detailed validation errors
  }
  next(); 
};

export const validateMyUserRequest = [
  body("fullname.firstname")
    .isString().withMessage("First name must be a string")
    .notEmpty().withMessage("First name is required"),
  body("email")
    .isEmail().withMessage("Email must be a valid email address")
    .notEmpty().withMessage("Email is required"),
   body("password")
    .isString().withMessage("Password must be a string")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .notEmpty().withMessage("Password is required"),
  handleValidationRequest
];
export const validateMyCaptionRequest=[
  body("fullname.firstname")
    .isString().withMessage("First name must be a string")
    .notEmpty().withMessage("First name is required"),
  body("email")
    .isEmail().withMessage("Email must be a valid email address")
    .notEmpty().withMessage("Email is required"),
   body("password")
    .isString().withMessage("Password must be a string")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .notEmpty().withMessage("Password is required"),
    body("vehicle.color")
    .isString().notEmpty().withMessage("First name must be a string"),
  handleValidationRequest
]