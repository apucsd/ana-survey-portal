import { z } from 'zod';

const createSurveyZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required',
        }),
        description: z.string({
            required_error: 'Description is required',
        }),
        estimatedTime: z.number({
            required_error: 'Estimated time is required',
        }),
        endDate: z
            .string({
                required_error: 'End date is required',
            })
            .datetime()
            .refine((val) => new Date(val) > new Date(), {
                message: 'End date must be in the future',
            }),
    }),
});

export const SurveyValidation = {
    createSurveyZodSchema,
};
