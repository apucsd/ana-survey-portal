import { z } from 'zod';

/**
 * Boolean Question Validator (Yes/No)
 */

export const BooleanConfigSchema = z
    .object({
        trueLabel: z.string().optional().default('Yes'),
        falseLabel: z.string().optional().default('No'),
    })
    .optional()
    .default({});

export const BooleanQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('boolean'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: BooleanConfigSchema,
});
