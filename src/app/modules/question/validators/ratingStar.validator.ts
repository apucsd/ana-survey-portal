import { z } from 'zod';

/**
 * Rating Star Question Validator (1-5 stars)
 * Type: rating_star
 */

export const RatingStarConfigSchema = z.object({
    min: z.number().int().default(1),
    max: z.number().int().default(5),
    step: z.number().int().default(1),
});

export const RatingStarQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('rating_star'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: RatingStarConfigSchema,
});
