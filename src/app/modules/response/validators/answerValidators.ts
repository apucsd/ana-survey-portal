import { Question } from '@prisma/client';
import { validateMultiChoice } from './multiChoice.validator';
import { validateText } from './textLike.validator';
import { validateSingleChoice } from './singleChoice.validator';
import { validateNumber } from './number.validator';

const VALIDATORS: Record<string, Function> = {
    // MCQ
    mcq_multi: validateMultiChoice,
    mcq_single: validateSingleChoice,

    // Text
    text: (ans: any) => validateText(ans, 'text'),
    textarea: (ans: any) => validateText(ans, 'textarea'),
    email: (ans: any) => validateText(ans, 'email'),

    // Number
    number: validateNumber,
    rating: validateNumber,
};

export const validateAnswer = (answerValue: any, question: Question) => {
    const validator = VALIDATORS[question.type];

    if (!validator) {
        return { valid: true };
    }

    return validator(answerValue, question.config);
};
