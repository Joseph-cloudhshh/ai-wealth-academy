import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  coach_name: z.string().optional(),
  price: z.string().optional(),
  featured: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content_type: z.enum(['video', 'pdf', 'image', 'link']),
  content_url: z.string().optional(),
  course_id: z.string().uuid(),
  sort_order: z.number().optional(),
});

export const tokenSchema = z.object({
  token: z.string().min(3, 'Token must be at least 3 characters'),
  course_id: z.string().uuid('Course is required'),
  active: z.boolean().optional(),
  usage_limit: z.number().min(1).optional(),
  expires_at: z.string().optional().nullable(),
});

export const adminLoginSchema = z.object({
  pin: z.string().min(1, 'PIN is required'),
});