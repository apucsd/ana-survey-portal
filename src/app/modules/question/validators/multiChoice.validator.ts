import { z } from 'zod';

/**
 * Multi Choice Question Validator (Checkboxes)
 */

export const MultiChoiceConfigSchema = z.object({
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
        .min(2, 'Multi choice must have at least 2 options'),
    minSelections: z.number().int().nonnegative().optional(),
    maxSelections: z.number().int().positive().optional(),
    allowOther: z.boolean().optional().default(false),
});

export const MultiChoiceQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('multi-choice'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: MultiChoiceConfigSchema,
});
