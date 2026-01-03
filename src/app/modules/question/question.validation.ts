import { z } from 'zod';

// Import all modular validators
import {
    TextQuestionSchema,
    TextareaQuestionSchema,
    EmailQuestionSchema,
    TextConfigSchema,
} from './validators/text.validator';
import { SingleChoiceQuestionSchema, SingleChoiceConfigSchema } from './validators/singleChoice.validator';
import { MultiChoiceQuestionSchema, MultiChoiceConfigSchema } from './validators/multiChoice.validator';
import { NumberQuestionSchema, NumberConfigSchema } from './validators/number.validator';
import { RatingQuestionSchema, RatingConfigSchema } from './validators/rating.validator';
import { DateQuestionSchema, DateConfigSchema } from './validators/date.validator';
import { BooleanQuestionSchema, BooleanConfigSchema } from './validators/boolean.validator';

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

// ============ COMBINED SCHEMA ============
// Discriminated union that combines all question types
export const CreateQuestionSchema = z.discriminatedUnion('type', [
    TextQuestionSchema,
    TextareaQuestionSchema,
    EmailQuestionSchema,
    NumberQuestionSchema,
    RatingQuestionSchema,
    SingleChoiceQuestionSchema,
    MultiChoiceQuestionSchema,
    DateQuestionSchema,
    BooleanQuestionSchema,
]);

// ============ UPDATE SCHEMA ============
export const UpdateQuestionSchema = z
    .object({
        title: z.string().min(1).max(500).optional(),
        required: z.boolean().optional(),
        order: z.number().int().nonnegative().optional(),
        config: z.any().optional(),
    })
    .strict();

// ============ CONFIG VALIDATOR HELPER ============
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

// ============ EXPORT FOR MIDDLEWARE ============
export const QuestionValidation = {
    createQuestionZodSchema: z.object({
        body: CreateQuestionSchema,
    }),
    updateQuestionZodSchema: z.object({
        body: UpdateQuestionSchema,
    }),
};
