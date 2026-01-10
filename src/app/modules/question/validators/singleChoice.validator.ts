import { z } from 'zod';

/**
 * Single Choice Question Validator (Radio Buttons)
 * Type: single_choice
 */

export const SingleChoiceConfigSchema = z.object({
    options: z
        .array(
            z.union([
                z.string().min(1, 'Option cannot be empty'),
                z.object({
                    value: z.string().min(1, 'Option value cannot be empty'),
                    label: z.string().min(1, 'Option label cannot be empty'),
                }),
            ])
        )
        .min(2, 'Single choice must have at least 2 options'),
    allowOther: z.boolean().optional().default(false),
});

export const SingleChoiceQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('single_choice'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: SingleChoiceConfigSchema,
});
