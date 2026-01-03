import { z } from 'zod';

/**
 * Number Question Validator
 */

export const NumberConfigSchema = z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive().optional(),
    placeholder: z.string().optional(),
});

export const NumberQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('number'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: NumberConfigSchema,
});
