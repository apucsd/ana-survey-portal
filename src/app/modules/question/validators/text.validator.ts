import { z } from 'zod';

/**
 * Text Question Validator
 * For: text, textarea, email
 */

export const TextConfigSchema = z
    .object({
        placeholder: z.string().optional(),
        maxLength: z.number().int().positive().optional(),
        minLength: z.number().int().nonnegative().optional(),
    })
    .optional()
    .default({});

export const TextQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('text'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: TextConfigSchema,
});

export const TextareaQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('textarea'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: TextConfigSchema,
});

export const EmailQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('email'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: TextConfigSchema,
});
