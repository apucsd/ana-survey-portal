import { z } from 'zod';

/**
 * Date Question Validator
 */

export const DateConfigSchema = z
    .object({
        minDate: z.string().optional(),
        maxDate: z.string().optional(),
        format: z.string().optional().default('YYYY-MM-DD'),
    })
    .optional()
    .default({});

export const DateQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('date'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: DateConfigSchema,
});
