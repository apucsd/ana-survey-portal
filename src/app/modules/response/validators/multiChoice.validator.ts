import z from 'zod';

export const validateMultiChoice = (answer: any, questionConfig: any) => {
    const schema = z.array(z.string());
    const parseResult = schema.safeParse(answer);

    if (!parseResult.success) {
        return { valid: false, error: 'Answer must be an array of strings' };
    }

    const selectedOptions = parseResult.data;
    const questionOptions = questionConfig?.options || [];

    // Extract values if options are objects
    const validOptions: string[] = questionOptions.map((opt: any) =>
        typeof opt === 'object' && opt.value ? opt.value : opt
    );

    const invalidSelections = selectedOptions.filter((opt) => !validOptions.includes(opt));

    if (invalidSelections.length > 0) {
        return { valid: false, error: `Invalid options selected: ${invalidSelections.join(', ')}` };
    }

    return { valid: true };
};
