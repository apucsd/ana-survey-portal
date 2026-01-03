export type QuestionType =
    | 'text'
    | 'textarea'
    | 'email'
    | 'number'
    | 'rating'
    | 'single-choice'
    | 'multi-choice'
    | 'date'
    | 'boolean';

export interface TextConfig {
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
}

export interface NumberConfig {
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
}

export interface RatingConfig {
    min: number;
    max: number;
    step: number;
}

export type ChoiceOption =
    | string
    | {
          value: string;
          label: string;
      };

export interface SingleChoiceConfig {
    options: ChoiceOption[]; // minimum 2 options
    allowOther?: boolean;
}

export interface MultiChoiceConfig {
    options: ChoiceOption[]; // minimum 2 options
    minSelections?: number;
    maxSelections?: number;
    allowOther?: boolean;
}

export interface DateConfig {
    minDate?: string; // ISO date string
    maxDate?: string; // ISO date string
    format?: string; // default: 'YYYY-MM-DD'
}

export interface BooleanConfig {
    trueLabel?: string; // default: 'Yes'
    falseLabel?: string; // default: 'No'
}

// ============ QUESTION INTERFACE ============

export interface BaseQuestion {
    id?: string;
    surveyId: string;
    title: string;
    type: QuestionType;
    required: boolean;
    order: number;
    status?: 'ACTIVE' | 'DELETED';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TextQuestion extends BaseQuestion {
    type: 'text' | 'textarea' | 'email';
    config: TextConfig;
}

export interface NumberQuestion extends BaseQuestion {
    type: 'number';
    config: NumberConfig;
}

export interface RatingQuestion extends BaseQuestion {
    type: 'rating';
    config: RatingConfig;
}

export interface SingleChoiceQuestion extends BaseQuestion {
    type: 'single-choice';
    config: SingleChoiceConfig;
}

export interface MultiChoiceQuestion extends BaseQuestion {
    type: 'multi-choice';
    config: MultiChoiceConfig;
}

export interface DateQuestion extends BaseQuestion {
    type: 'date';
    config: DateConfig;
}

export interface BooleanQuestion extends BaseQuestion {
    type: 'boolean';
    config: BooleanConfig;
}

export type Question =
    | TextQuestion
    | NumberQuestion
    | RatingQuestion
    | SingleChoiceQuestion
    | MultiChoiceQuestion
    | DateQuestion
    | BooleanQuestion;

// ============ ANSWER TYPES ============

export type AnswerValue =
    | string // text, textarea, email, date, single-choice
    | number // number, rating
    | boolean // boolean
    | string[]; // multi-choice

export interface Answer {
    id?: string;
    questionId: string;
    responseId?: string;
    value: AnswerValue;
    createdAt?: Date;
}

// ============ RESPONSE INTERFACE ============

export interface Response {
    id?: string;
    surveyId: string;
    userId?: string; // Optional for anonymous responses
    answers: Answer[];
    createdAt?: Date;
}

// ============ CREATE/UPDATE PAYLOADS ============

export interface CreateQuestionPayload {
    surveyId: string;
    title: string;
    type: QuestionType;
    required: boolean;
    order: number;
    config:
        | TextConfig
        | NumberConfig
        | RatingConfig
        | SingleChoiceConfig
        | MultiChoiceConfig
        | DateConfig
        | BooleanConfig;
}

export interface UpdateQuestionPayload {
    title?: string;
    required?: boolean;
    order?: number;
    config?:
        | TextConfig
        | NumberConfig
        | RatingConfig
        | SingleChoiceConfig
        | MultiChoiceConfig
        | DateConfig
        | BooleanConfig;
}

export interface CreateResponsePayload {
    surveyId: string;
    userId?: string;
    answers: Array<{
        questionId: string;
        value: AnswerValue;
    }>;
}

// ============ HELPER TYPE GUARDS ============

export function isTextQuestion(question: Question): question is TextQuestion {
    return ['text', 'textarea', 'email'].includes(question.type);
}

export function isNumberQuestion(question: Question): question is NumberQuestion {
    return question.type === 'number';
}

export function isRatingQuestion(question: Question): question is RatingQuestion {
    return question.type === 'rating';
}

export function isSingleChoiceQuestion(question: Question): question is SingleChoiceQuestion {
    return question.type === 'single-choice';
}

export function isMultiChoiceQuestion(question: Question): question is MultiChoiceQuestion {
    return question.type === 'multi-choice';
}

export function isDateQuestion(question: Question): question is DateQuestion {
    return question.type === 'date';
}

export function isBooleanQuestion(question: Question): question is BooleanQuestion {
    return question.type === 'boolean';
}

// ============ VALIDATION HELPERS ============

export function getQuestionTypeLabel(type: QuestionType): string {
    const labels: Record<QuestionType, string> = {
        text: 'Short Text',
        textarea: 'Long Text',
        email: 'Email Address',
        number: 'Number',
        rating: 'Rating',
        'single-choice': 'Single Choice (Radio)',
        'multi-choice': 'Multiple Choice (Checkbox)',
        date: 'Date',
        boolean: 'Yes/No',
    };
    return labels[type];
}

export function getDefaultConfig(type: QuestionType): any {
    const defaults: Record<QuestionType, any> = {
        text: { placeholder: '', maxLength: 500 },
        textarea: { placeholder: '', maxLength: 2000 },
        email: { placeholder: 'you@example.com' },
        number: { min: 0, max: 100, step: 1 },
        rating: { min: 1, max: 5, step: 1 },
        'single-choice': { options: ['Option 1', 'Option 2'], allowOther: false },
        'multi-choice': { options: ['Option 1', 'Option 2'], allowOther: false },
        date: { format: 'YYYY-MM-DD' },
        boolean: { trueLabel: 'Yes', falseLabel: 'No' },
    };
    return defaults[type];
}
