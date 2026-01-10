import z from 'zod';

export const validateText = (answer: any, type: 'text' | 'textarea' | 'email') => {
    let schema;
    if (type === 'email') {
        schema = z.string().email();
    } else {
        schema = z.string();
    }

    const parseResult = schema.safeParse(answer);
    if (!parseResult.success) {
        return { valid: false, error: parseResult.error.errors[0].message };
    }

    return { valid: true };
};
