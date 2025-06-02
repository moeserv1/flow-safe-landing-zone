
import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .max(254, "Email must be less than 254 characters"),
  
  subject: z.string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

// Job posting validation schema
export const jobPostingSchema = z.object({
  title: z.string()
    .min(5, "Job title must be at least 5 characters")
    .max(100, "Job title must be less than 100 characters"),
  
  company: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  
  location: z.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),
  
  description: z.string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be less than 5000 characters"),
  
  salary: z.string()
    .optional()
    .refine((val) => !val || /^\$?\d{1,3}(,\d{3})*(\.\d{2})?(-\$?\d{1,3}(,\d{3})*(\.\d{2})?)?$/.test(val), 
      "Invalid salary format"),
  
  type: z.enum(["full-time", "part-time", "contract", "internship"]),
  
  remote: z.boolean(),
});

// Blog post validation schema
export const blogPostSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  
  content: z.string()
    .min(100, "Content must be at least 100 characters")
    .max(50000, "Content must be less than 50,000 characters"),
  
  excerpt: z.string()
    .min(20, "Excerpt must be at least 20 characters")
    .max(500, "Excerpt must be less than 500 characters"),
  
  tags: z.array(z.string().max(50)).max(10, "Maximum 10 tags allowed"),
  
  category: z.string()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category must be less than 50 characters"),
});

// User profile validation schema
export const userProfileSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
  
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
  
  website: z.string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  
  location: z.string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type JobPostingData = z.infer<typeof jobPostingSchema>;
export type BlogPostData = z.infer<typeof blogPostSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
