import z from 'zod';

const createQuestionZodSchema = z.object({
    body: z.object({
        surveyId: z.string({
            required_error: 'Survey ID is required',
        }),
        type: z.enum(
            [
                'text',
                'textarea',
                'mcq_single',
                'mcq_multi',
                'rating',
                'yes_no',
                'date',
                'number',
                'email',
                'file',
                'dropdown',
                'matrix',
            ],
            {
                required_error: 'Question type is required',
            }
        ),
        title: z.string({
            required_error: 'Question title is required',
        }),
        required: z.boolean(),
        order: z.number({
            required_error: 'Question order is required',
        }),
        config: z.record(z.any()),
    }),
});

const updateQuestionZodSchema = z.object({
    body: createQuestionZodSchema.shape.body.partial(),
});

export const QuestionValidation = {
    createQuestionZodSchema,
    updateQuestionZodSchema,
};
