import { z } from 'zod';

/**
 * Order Rank Question Validator (Drag & Order)
 * Type: order_rank
 * Users drag items to rank them in order of preference
 */

export const OrderRankConfigSchema = z.object({
    items: z
        .array(
            z.union([
                z.string().min(1, 'Item cannot be empty'),
                z.object({
                    value: z.string().min(1, 'Item value cannot be empty'),
                    label: z.string().min(1, 'Item label cannot be empty'),
                }),
            ])
        )
        .min(2, 'Order rank must have at least 2 items'),
    maxRankable: z.number().int().positive().optional(), // e.g., "Rank your top 3"
});

export const OrderRankQuestionSchema = z.object({
    surveyId: z.string().min(1, 'Survey ID is required'),
    title: z.string().min(1, 'Question title is required'),
    type: z.literal('order_rank'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: OrderRankConfigSchema,
});
