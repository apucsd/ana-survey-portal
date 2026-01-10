import z from 'zod';

export const validateNumber = (answer: any, questionConfig: any) => {
    const schema = z.number();
    const parseResult = schema.safeParse(answer);

    if (!parseResult.success) {
        return { valid: false, error: 'Answer must be a number' };
    }

    const value = parseResult.data;
    const min = questionConfig?.min;
    const max = questionConfig?.max;

    if (min !== undefined && value < min) {
        return { valid: false, error: `Value must be at least ${min}` };
    }

    if (max !== undefined && value > max) {
        return { valid: false, error: `Value must be at most ${max}` };
    }

    return { valid: true };
};
