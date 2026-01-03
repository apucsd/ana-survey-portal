import { z } from 'zod';

/**
 * Rating Question Validator (e.g., 1-5 stars)
 */

export const RatingConfigSchema = z.object({
    min: z.number().int().default(1),
    max: z.number().int().default(5),
    step: z.number().int().default(1),
});

export const RatingQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('rating'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: RatingConfigSchema,
});
