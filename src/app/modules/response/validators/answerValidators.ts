import { Question } from '@prisma/client';
import { validateSingleChoice } from './singleChoice.validator';
import { validateMultiChoice } from './multiChoice.validator';
import { validateText } from './textLike.validator';
import { validateNumber } from './number.validator';
import z from 'zod';

/**
 * Main answer validation function
 * Validates user's answer based on question type and config
 */
export const validateAnswer = (answer: any, question: Question): { valid: boolean; error?: string } => {
    const questionType = question.type;
    const questionConfig = question.config as any;

    // Handle empty/null answers for non-required questions
    if (answer === null || answer === undefined || answer === '') {
        if (question.required) {
            return { valid: false, error: 'This question is required' };
        }
        return { valid: true };
    }

    switch (questionType) {
        case 'text':
        case 'textarea':
            return validateText(answer, questionType);

        case 'email':
            return validateText(answer, 'email');

        case 'number':
            return validateNumber(answer, questionConfig);

        case 'rating':
            return validateRating(answer, questionConfig);

        case 'single-choice':
            return validateSingleChoice(answer, questionConfig);

        case 'multi-choice':
            return validateMultiChoice(answer, questionConfig);

        case 'date':
            return validateDate(answer, questionConfig);

        case 'boolean':
            return validateBoolean(answer);

        default:
            return { valid: false, error: `Unknown question type: ${questionType}` };
    }
};

// ============ ADDITIONAL VALIDATORS ============

/**
 * Validate rating answer (e.g., 1-5 stars)
 */
const validateRating = (answer: any, questionConfig: any) => {
    const schema = z.number().int();
    const parseResult = schema.safeParse(answer);

    if (!parseResult.success) {
        return { valid: false, error: 'Rating must be a number' };
    }

    const value = parseResult.data;
    const min = questionConfig?.min ?? 1;
    const max = questionConfig?.max ?? 5;

    if (value < min || value > max) {
        return { valid: false, error: `Rating must be between ${min} and ${max}` };
    }

    return { valid: true };
};

/**
 * Validate date answer
 */
const validateDate = (answer: any, questionConfig: any) => {
    const schema = z.string().refine(
        (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        },
        { message: 'Invalid date format' }
    );

    const parseResult = schema.safeParse(answer);

    if (!parseResult.success) {
        return { valid: false, error: 'Invalid date format' };
    }

    const answerDate = new Date(parseResult.data);

    // Validate min date
    if (questionConfig?.minDate) {
        const minDate = new Date(questionConfig.minDate);
        if (answerDate < minDate) {
            return {
                valid: false,
                error: `Date must be on or after ${minDate.toISOString().split('T')[0]}`,
            };
        }
    }

    // Validate max date
    if (questionConfig?.maxDate) {
        const maxDate = new Date(questionConfig.maxDate);
        if (answerDate > maxDate) {
            return {
                valid: false,
                error: `Date must be on or before ${maxDate.toISOString().split('T')[0]}`,
            };
        }
    }

    return { valid: true };
};

/**
 * Validate boolean answer (yes/no)
 */
const validateBoolean = (answer: any) => {
    const schema = z.boolean();
    const parseResult = schema.safeParse(answer);

    if (!parseResult.success) {
        return { valid: false, error: 'Answer must be true or false' };
    }

    return { valid: true };
};
