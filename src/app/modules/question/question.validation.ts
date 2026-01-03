import { z } from 'zod';

// ============ QUESTION TYPE ENUM ============
export const QuestionTypeEnum = z.enum([
    'text',
    'textarea',
    'email',
    'number',
    'rating',
    'single-choice',
    'multi-choice',
    'date',
    'boolean',
]);

export type QuestionType = z.infer<typeof QuestionTypeEnum>;

// ============ CONFIG SCHEMAS FOR EACH QUESTION TYPE ============

const TextConfigSchema = z
    .object({
        placeholder: z.string().optional(),
        maxLength: z.number().int().positive().optional(),
        minLength: z.number().int().nonnegative().optional(),
    })
    .optional()
    .default({});

// Number question
const NumberConfigSchema = z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive().optional(),
    placeholder: z.string().optional(),
});

// Rating question (e.g., 1-5 stars)
const RatingConfigSchema = z.object({
    min: z.number().int().default(1),
    max: z.number().int().default(5),
    step: z.number().int().default(1),
});

// Single choice (radio buttons)
const SingleChoiceConfigSchema = z.object({
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

// Multi choice (checkboxes)
const MultiChoiceConfigSchema = z.object({
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

// Date question
const DateConfigSchema = z
    .object({
        minDate: z.string().optional(), // ISO date string
        maxDate: z.string().optional(),
        format: z.string().optional().default('YYYY-MM-DD'),
    })
    .optional()
    .default({});

// Boolean question (yes/no)
const BooleanConfigSchema = z
    .object({
        trueLabel: z.string().optional().default('Yes'),
        falseLabel: z.string().optional().default('No'),
    })
    .optional()
    .default({});

// ============ MAIN QUESTION VALIDATION SCHEMA ============

const BaseQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required').max(500, 'Title too long'),
    type: QuestionTypeEnum,
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
});

// Create Question Schema with discriminated union for config
export const CreateQuestionSchema = z.discriminatedUnion('type', [
    BaseQuestionSchema.extend({
        type: z.literal('text'),
        config: TextConfigSchema,
    }),
    BaseQuestionSchema.extend({
        type: z.literal('textarea'),
        config: TextConfigSchema,
    }),
    BaseQuestionSchema.extend({
        type: z.literal('email'),
        config: TextConfigSchema,
    }),
    BaseQuestionSchema.extend({
        type: z.literal('number'),
        config: NumberConfigSchema,
    }),
    BaseQuestionSchema.extend({
        type: z.literal('rating'),
        config: RatingConfigSchema,
    }),
    BaseQuestionSchema.extend({
        type: z.literal('single-choice'),
        config: SingleChoiceConfigSchema,
    }),
    BaseQuestionSchema.extend({
        type: z.literal('multi-choice'),
        config: MultiChoiceConfigSchema,
    }),
    BaseQuestionSchema.extend({
        type: z.literal('date'),
        config: DateConfigSchema,
    }),
    BaseQuestionSchema.extend({
        type: z.literal('boolean'),
        config: BooleanConfigSchema,
    }),
]);

// Update Question Schema (partial, but still validates config if type is present)
export const UpdateQuestionSchema = z
    .object({
        title: z.string().min(1).max(500).optional(),
        required: z.boolean().optional(),
        order: z.number().int().nonnegative().optional(),
        config: z.any().optional(), // We'll validate this based on the existing question type
    })
    .strict();

// ============ HELPER FUNCTION TO VALIDATE CONFIG BASED ON TYPE ============

export const validateQuestionConfig = (type: QuestionType, config: any) => {
    switch (type) {
        case 'text':
        case 'textarea':
        case 'email':
            return TextConfigSchema.safeParse(config);
        case 'number':
            return NumberConfigSchema.safeParse(config);
        case 'rating':
            return RatingConfigSchema.safeParse(config);
        case 'single-choice':
            return SingleChoiceConfigSchema.safeParse(config);
        case 'multi-choice':
            return MultiChoiceConfigSchema.safeParse(config);
        case 'date':
            return DateConfigSchema.safeParse(config);
        case 'boolean':
            return BooleanConfigSchema.safeParse(config);
        default:
            return { success: false, error: { message: 'Invalid question type' } };
    }
};

export const QuestionValidation = {
    createQuestionZodSchema: z.object({
        body: CreateQuestionSchema,
    }),
    updateQuestionZodSchema: z.object({
        body: UpdateQuestionSchema,
    }),
};
