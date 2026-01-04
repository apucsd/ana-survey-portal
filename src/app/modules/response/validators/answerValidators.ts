import { Question } from '@prisma/client';
export const validateAnswer = (answer: any, question: Question): { valid: boolean; error?: string } => {
    const questionType = question.type;
    const config = question.config as any;

    // Handle empty/null answers
    if (answer === null || answer === undefined || answer === '') {
        if (question.required) {
            return { valid: false, error: 'This question is required' };
        }
        return { valid: true };
    }

    if (Array.isArray(answer) && answer.length === 0) {
        if (question.required) {
            return { valid: false, error: 'This question is required' };
        }
        return { valid: true };
    }

    switch (questionType) {
        case 'textarea':
            return validateTextarea(answer, config);

        case 'single_choice':
            return validateSingleChoice(answer, config);

        case 'multiple_choice':
            return validateMultipleChoice(answer, config);

        case 'rating_star':
            return validateRating(answer, config, 1, 5);

        case 'rating_scale':
            return validateRating(answer, config, 0, 10);

        case 'boolean':
            return validateBoolean(answer);

        case 'order_rank':
            return validateOrderRank(answer, config);

        default:
            return { valid: false, error: `Unknown question type: ${questionType}` };
    }
};

// ============ SPECIFIC VALIDATORS ============

const validateTextarea = (answer: any, config: any) => {
    if (typeof answer !== 'string') return { valid: false, error: 'Answer must be text' };

    if (config?.minLength && answer.length < config.minLength) {
        return { valid: false, error: `Answer must be at least ${config.minLength} characters` };
    }
    if (config?.maxLength && answer.length > config.maxLength) {
        return { valid: false, error: `Answer must be at most ${config.maxLength} characters` };
    }
    return { valid: true };
};

const validateSingleChoice = (answer: any, config: any) => {
    // Answer should be a string (the selected value)
    if (typeof answer !== 'string') return { valid: false, error: 'Answer must be a selected option' };

    // Extract valid values from config
    const options = config.options || [];
    const validValues = options.map((opt: any) => (typeof opt === 'string' ? opt : opt.value));

    if (!validValues.includes(answer) && !config.allowOther) {
        return { valid: false, error: 'Invalid option selected' };
    }
    return { valid: true };
};

const validateMultipleChoice = (answer: any, config: any) => {
    if (!Array.isArray(answer)) return { valid: false, error: 'Answer must be multiple selections' };

    const options = config.options || [];
    const validValues = options.map((opt: any) => (typeof opt === 'string' ? opt : opt.value));

    if (config?.minSelections && answer.length < config.minSelections) {
        return { valid: false, error: `Please select at least ${config.minSelections} options` };
    }
    if (config?.maxSelections && answer.length > config.maxSelections) {
        return { valid: false, error: `Please select at most ${config.maxSelections} options` };
    }

    if (!config.allowOther) {
        for (const item of answer) {
            if (!validValues.includes(item)) {
                return { valid: false, error: `Invalid option selected: ${item}` };
            }
        }
    }
    return { valid: true };
};

const validateRating = (answer: any, config: any, defaultMin: number, defaultMax: number) => {
    const val = Number(answer);
    if (isNaN(val)) return { valid: false, error: 'Rating must be a number' };

    const min = config?.min ?? defaultMin;
    const max = config?.max ?? defaultMax;

    if (val < min || val > max) {
        return { valid: false, error: `Rating must be between ${min} and ${max}` };
    }
    return { valid: true };
};

const validateBoolean = (answer: any) => {
    if (typeof answer !== 'boolean') return { valid: false, error: 'Answer must be true or false' };
    return { valid: true };
};

const validateOrderRank = (answer: any, config: any) => {
    if (!Array.isArray(answer)) return { valid: false, error: 'Answer must be an ordered list' };

    const items = config.items || [];
    const validItems = items.map((opt: any) => (typeof opt === 'string' ? opt : opt.value));

    if (new Set(answer).size !== answer.length) {
        return { valid: false, error: 'Duplicate items in ranking' };
    }

    for (const item of answer) {
        if (!validItems.includes(item)) {
            return { valid: false, error: `Invalid item in ranking: ${item}` };
        }
    }

    return { valid: true };
};
