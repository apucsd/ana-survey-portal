import z from 'zod';

export const validateSingleChoice = (answer: any, questionConfig: any) => {
    const schema = z.string();
    const parseResult = schema.safeParse(answer);

    if (!parseResult.success) {
        return { valid: false, error: 'Answer must be a single string' };
    }

    const selectedOption = parseResult.data;
    const questionOptions = questionConfig?.options || [];

    // Extract values if options are objects (e.g. { value: '...' })
    const validOptions: string[] = questionOptions.map((opt: any) =>
        typeof opt === 'object' && opt.value ? opt.value : opt
    );

    if (!validOptions.includes(selectedOption)) {
        return { valid: false, error: `Invalid option selected: ${selectedOption}` };
    }

    return { valid: true };
};
