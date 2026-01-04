export type QuestionType =
    | 'single_choice'
    | 'multiple_choice'
    | 'textarea'
    | 'rating_star'
    | 'rating_scale'
    | 'boolean'
    | 'order_rank';

// ============ CONFIG TYPES FOR EACH QUESTION TYPE ============

export interface TextareaConfig {
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
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

export interface MultipleChoiceConfig {
    options: ChoiceOption[]; // minimum 2 options
    minSelections?: number;
    maxSelections?: number;
    allowOther?: boolean;
}

export interface RatingStarConfig {
    min: number; // default: 1
    max: number; // default: 5
    step: number; // default: 1
}

export interface RatingScaleConfig {
    min: number; // default: 0
    max: number; // default: 10
    step: number; // default: 1
    labels?: {
        min?: string;
        max?: string;
    };
}

export interface BooleanConfig {
    trueLabel?: string; // default: 'Yes'
    falseLabel?: string; // default: 'No'
}

export interface OrderRankConfig {
    items: ChoiceOption[]; // minimum 2 items
    maxRankable?: number;
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

export interface TextareaQuestion extends BaseQuestion {
    type: 'textarea';
    config: TextareaConfig;
}

export interface SingleChoiceQuestion extends BaseQuestion {
    type: 'single_choice';
    config: SingleChoiceConfig;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple_choice';
    config: MultipleChoiceConfig;
}

export interface RatingStarQuestion extends BaseQuestion {
    type: 'rating_star';
    config: RatingStarConfig;
}

export interface RatingScaleQuestion extends BaseQuestion {
    type: 'rating_scale';
    config: RatingScaleConfig;
}

export interface BooleanQuestion extends BaseQuestion {
    type: 'boolean';
    config: BooleanConfig;
}

export interface OrderRankQuestion extends BaseQuestion {
    type: 'order_rank';
    config: OrderRankConfig;
}

export type Question =
    | TextareaQuestion
    | SingleChoiceQuestion
    | MultipleChoiceQuestion
    | RatingStarQuestion
    | RatingScaleQuestion
    | BooleanQuestion
    | OrderRankQuestion;

// ============ ANSWER TYPES ============

export type AnswerValue =
    | string // textarea, single_choice, rating_star (stored as number but handled as value), rating_scale
    | number // rating_star, rating_scale
    | boolean // boolean
    | string[]; // multiple_choice, order_rank

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
        | TextareaConfig
        | SingleChoiceConfig
        | MultipleChoiceConfig
        | RatingStarConfig
        | RatingScaleConfig
        | BooleanConfig
        | OrderRankConfig;
}

export interface UpdateQuestionPayload {
    title?: string;
    required?: boolean;
    order?: number;
    config?: any; // Partial<Config>
}

// ============ HELPER TYPE GUARDS ============

export function isTextareaQuestion(question: Question): question is TextareaQuestion {
    return question.type === 'textarea';
}

export function isSingleChoiceQuestion(question: Question): question is SingleChoiceQuestion {
    return question.type === 'single_choice';
}

export function isMultipleChoiceQuestion(question: Question): question is MultipleChoiceQuestion {
    return question.type === 'multiple_choice';
}

export function isRatingStarQuestion(question: Question): question is RatingStarQuestion {
    return question.type === 'rating_star';
}

export function isRatingScaleQuestion(question: Question): question is RatingScaleQuestion {
    return question.type === 'rating_scale';
}

export function isBooleanQuestion(question: Question): question is BooleanQuestion {
    return question.type === 'boolean';
}

export function isOrderRankQuestion(question: Question): question is OrderRankQuestion {
    return question.type === 'order_rank';
}

// ============ VALIDATION HELPERS ============

export function getQuestionTypeLabel(type: QuestionType): string {
    const labels: Record<QuestionType, string> = {
        textarea: 'Long Text',
        single_choice: 'Single Choice',
        multiple_choice: 'Multiple Choice',
        rating_star: 'Star Rating',
        rating_scale: 'Scale Rating',
        boolean: 'Yes/No',
        order_rank: 'Ranking',
    };
    return labels[type];
}

export function getDefaultConfig(type: QuestionType): any {
    const defaults: Record<QuestionType, any> = {
        textarea: { placeholder: '', maxLength: 2000 },
        single_choice: { options: ['Option 1', 'Option 2'], allowOther: false },
        multiple_choice: { options: ['Option 1', 'Option 2'], allowOther: false },
        rating_star: { min: 1, max: 5, step: 1 },
        rating_scale: { min: 0, max: 10, step: 1, labels: { min: 'Not Likely', max: 'Very Likely' } },
        boolean: { trueLabel: 'Yes', falseLabel: 'No' },
        order_rank: { items: ['Item 1', 'Item 2', 'Item 3'] },
    };
    return defaults[type];
}
