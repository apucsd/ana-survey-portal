import { z } from 'zod';

/**
 * Rating Scale Question Validator (0-10 scale)
 * Type: rating_scale
 */

export const RatingScaleConfigSchema = z.object({
    min: z.number().int().default(0),
    max: z.number().int().default(10),
    step: z.number().int().default(1),
    labels: z
        .object({
            min: z.string().optional(), // e.g., "Not at all likely"
            max: z.string().optional(), // e.g., "Extremely likely"
        })
        .optional(),
});

export const RatingScaleQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('rating_scale'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: RatingScaleConfigSchema,
});
