# Modular Question Validation Architecture

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    question.route.ts                        │
│  (Uses QuestionValidation.createQuestionZodSchema)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              question.validation.ts (MAIN)                  │
│  • Imports all validators                                   │
│  • Combines them with discriminated union                   │
│  • Exports QuestionValidation for routes                    │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌──────────────────┐           ┌──────────────────┐
│   validators/    │           │   validators/    │
│ text.validator   │           │single-choice     │
│                  │           │  .validator      │
│ • TextConfig     │           │                  │
│ • TextQuestion   │           │ • SingleChoice   │
│   Schema         │           │   ConfigSchema   │
└──────────────────┘           │ • SingleChoice   │
                               │   QuestionSchema │
┌──────────────────┐           └──────────────────┘
│   validators/    │
│ multi-choice     │           ┌──────────────────┐
│  .validator      │           │   validators/    │
│                  │           │ number.validator │
│ • MultiChoice    │           │                  │
│   ConfigSchema   │           │ • NumberConfig   │
│ • MultiChoice    │           │ • NumberQuestion │
│   QuestionSchema │           │   Schema         │
└──────────────────┘           └──────────────────┘

         ... and more validators ...
```

## 🔄 Data Flow

### 1. **Request Comes In**

```
POST /api/v1/questions
{
  "type": "single-choice",
  "title": "...",
  "config": { "options": [...] }
}
```

### 2. **Route Middleware Validates**

```typescript
// question.route.ts
router.post('/', validateRequest.body(QuestionValidation.createQuestionZodSchema));
```

### 3. **Main Validator Dispatches**

```typescript
// question.validation.ts
CreateQuestionSchema = z.discriminatedUnion('type', [
    TextQuestionSchema, // if type === 'text'
    SingleChoiceQuestionSchema, // if type === 'single-choice'
    // ... etc
]);
```

### 4. **Specific Validator Runs**

```typescript
// validators/singleChoice.validator.ts
SingleChoiceQuestionSchema.parse(data);
// ✅ Validates options array
// ✅ Validates allowOther field
// ✅ Ensures at least 2 options
```

### 5. **Service Receives Clean Data**

```typescript
// question.service.ts
createQuestionIntoDB(validatedData, userId);
// Data is guaranteed to be valid!
```

## 📁 File Responsibilities

| File                                   | Responsibility                             |
| -------------------------------------- | ------------------------------------------ |
| `question.route.ts`                    | Define routes, apply validation middleware |
| `question.validation.ts`               | Combine all validators, export for routes  |
| `validators/text.validator.ts`         | Validate text/textarea/email questions     |
| `validators/singleChoice.validator.ts` | Validate single choice (MCQ) questions     |
| `validators/multiChoice.validator.ts`  | Validate multi choice (checkbox) questions |
| `validators/number.validator.ts`       | Validate number questions                  |
| `validators/rating.validator.ts`       | Validate rating questions                  |
| `validators/date.validator.ts`         | Validate date questions                    |
| `validators/boolean.validator.ts`      | Validate boolean questions                 |

## ✅ Benefits

### 1. **Separation of Concerns**

Each validator handles ONE question type only.

### 2. **Easy to Find & Fix**

Need to update single-choice validation? Go to `singleChoice.validator.ts`.

### 3. **No Merge Conflicts**

Different developers can work on different validators.

### 4. **Easy to Test**

Test each validator independently:

```typescript
import { SingleChoiceQuestionSchema } from './singleChoice.validator';

test('validates single choice with 2 options', () => {
    const result = SingleChoiceQuestionSchema.parse({
        type: 'single-choice',
        config: { options: ['A', 'B'] },
    });
    expect(result).toBeDefined();
});
```

### 5. **Easy to Extend**

Add a new question type:

1. Create `validators/newType.validator.ts`
2. Add to `question.validation.ts`
3. Done!

## 🎯 Example: Adding a New Question Type

Let's add a "slider" question type:

### Step 1: Create Validator

```typescript
// validators/slider.validator.ts
import { z } from 'zod';

export const SliderConfigSchema = z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    defaultValue: z.number().optional(),
});

export const SliderQuestionSchema = z.object({
    surveyId: z.string().min(1),
    title: z.string().min(1),
    type: z.literal('slider'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: SliderConfigSchema,
});
```

### Step 2: Add to Main Validator

```typescript
// question.validation.ts
import { SliderQuestionSchema } from './validators/slider.validator';

export const CreateQuestionSchema = z.discriminatedUnion('type', [
    // ... existing validators
    SliderQuestionSchema, // ADD THIS LINE
]);
```

### Step 3: Update Enum

```typescript
export const QuestionTypeEnum = z.enum([
    // ... existing types
    'slider', // ADD THIS LINE
]);
```

That's it! The new type is now fully validated.

## 🚀 Quick Start

1. **Create a question:**

```bash
POST /api/v1/questions
Authorization: Bearer {token}

{
  "surveyId": "...",
  "title": "What is your favorite color?",
  "type": "single-choice",
  "required": true,
  "order": 1,
  "config": {
    "options": ["Red", "Blue", "Green"]
  }
}
```

2. **Validation happens automatically** - no extra code needed!

3. **Get clear error messages** if validation fails:

```json
{
    "success": false,
    "message": "Validation failed: Single choice must have at least 2 options"
}
```

## 📚 See Also

- `validators/README.md` - Detailed validator documentation
- `QUESTION_EXAMPLES.md` - JSON examples for all question types
- `question.types.ts` - TypeScript types for frontend
