import { z } from 'zod';
import { TextareaQuestionSchema, TextareaConfigSchema } from './validators/textarea.validator';
import { SingleChoiceQuestionSchema, SingleChoiceConfigSchema } from './validators/singleChoice.validator';
import { MultipleChoiceQuestionSchema, MultipleChoiceConfigSchema } from './validators/multipleChoice.validator';
import { RatingStarQuestionSchema, RatingStarConfigSchema } from './validators/ratingStar.validator';
import { RatingScaleQuestionSchema, RatingScaleConfigSchema } from './validators/ratingScale.validator';
import { BooleanQuestionSchema, BooleanConfigSchema } from './validators/boolean.validator';
import { OrderRankQuestionSchema, OrderRankConfigSchema } from './validators/orderRank.validator';

// ============ QUESTION TYPE ENUM ============
export const QuestionTypeEnum = z.enum([
    'single_choice',
    'multiple_choice',
    'textarea',
    'rating_star',
    'rating_scale',
    'boolean',
    'order_rank',
]);

export type QuestionType = z.infer<typeof QuestionTypeEnum>;

// ============ COMBINED SCHEMA ============
export const CreateQuestionSchema = z.discriminatedUnion('type', [
    TextareaQuestionSchema,
    SingleChoiceQuestionSchema,
    MultipleChoiceQuestionSchema,
    RatingStarQuestionSchema,
    RatingScaleQuestionSchema,
    BooleanQuestionSchema,
    OrderRankQuestionSchema,
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
        case 'textarea':
            return TextareaConfigSchema.safeParse(config);
        case 'single_choice':
            return SingleChoiceConfigSchema.safeParse(config);
        case 'multiple_choice':
            return MultipleChoiceConfigSchema.safeParse(config);
        case 'rating_star':
            return RatingStarConfigSchema.safeParse(config);
        case 'rating_scale':
            return RatingScaleConfigSchema.safeParse(config);
        case 'boolean':
            return BooleanConfigSchema.safeParse(config);
        case 'order_rank':
            return OrderRankConfigSchema.safeParse(config);
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
