# Question Validators - Modular Structure

## 📁 File Structure

```
question/
├── validators/
│   ├── text.validator.ts          # Text, Textarea, Email
│   ├── singleChoice.validator.ts  # Single Choice (MCQ)
│   ├── multiChoice.validator.ts   # Multi Choice (Checkboxes)
│   ├── number.validator.ts        # Number input
│   ├── rating.validator.ts        # Rating (1-5 stars)
│   ├── date.validator.ts          # Date picker
│   └── boolean.validator.ts       # Yes/No
├── question.validation.ts         # Main file (combines all)
├── question.service.ts
├── question.controller.ts
└── question.route.ts
```

## 🎯 How It Works

### 1. **Each Validator is Separate**

Each question type has its own validator file:

**Example: `text.validator.ts`**

```typescript
export const TextConfigSchema = z
    .object({
        placeholder: z.string().optional(),
        maxLength: z.number().optional(),
        minLength: z.number().optional(),
    })
    .optional()
    .default({});

export const TextQuestionSchema = z.object({
    surveyId: z.string().min(1),
    title: z.string().min(1),
    type: z.literal('text'),
    required: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    config: TextConfigSchema,
});
```

### 2. **Main File Combines All**

`question.validation.ts` imports and combines all validators:

```typescript
import { TextQuestionSchema } from './validators/text.validator';
import { SingleChoiceQuestionSchema } from './validators/singleChoice.validator';
// ... etc

export const CreateQuestionSchema = z.discriminatedUnion('type', [
    TextQuestionSchema,
    SingleChoiceQuestionSchema,
    // ... all other types
]);
```

### 3. **Easy to Add New Types**

To add a new question type:

1. Create `validators/newType.validator.ts`
2. Export `NewTypeConfigSchema` and `NewTypeQuestionSchema`
3. Import in `question.validation.ts`
4. Add to the discriminated union

## 📝 Example Usage

### Creating a Text Question

```json
{
    "surveyId": "...",
    "title": "What is your name?",
    "type": "text",
    "required": true,
    "order": 1,
    "config": {
        "placeholder": "Enter your name",
        "maxLength": 100
    }
}
```

### Creating a Single Choice Question

```json
{
    "surveyId": "...",
    "title": "What is your favorite color?",
    "type": "single-choice",
    "required": true,
    "order": 2,
    "config": {
        "options": ["Red", "Blue", "Green"],
        "allowOther": false
    }
}
```

## ✅ Benefits of This Structure

1. **Separation of Concerns** - Each validator is independent
2. **Easy to Maintain** - Find and update specific validators easily
3. **Reusable** - Import only what you need
4. **Testable** - Test each validator separately
5. **Scalable** - Add new types without touching existing code

## 🔧 Modifying a Validator

### Example: Update Text Validator

**File:** `validators/text.validator.ts`

```typescript
// Add a new field to config
export const TextConfigSchema = z
    .object({
        placeholder: z.string().optional(),
        maxLength: z.number().optional(),
        minLength: z.number().optional(),
        helperText: z.string().optional(), // NEW FIELD
    })
    .optional()
    .default({});
```

That's it! No need to touch other files.

## 📚 Available Validators

| Validator     | File                        | Question Types        |
| ------------- | --------------------------- | --------------------- |
| Text          | `text.validator.ts`         | text, textarea, email |
| Single Choice | `singleChoice.validator.ts` | single-choice         |
| Multi Choice  | `multiChoice.validator.ts`  | multi-choice          |
| Number        | `number.validator.ts`       | number                |
| Rating        | `rating.validator.ts`       | rating                |
| Date          | `date.validator.ts`         | date                  |
| Boolean       | `boolean.validator.ts`      | boolean               |

## 🚀 Quick Start

1. **Import the main validation:**

```typescript
import { QuestionValidation } from './question.validation';
```

2. **Use in routes:**

```typescript
router.post(
    '/',
    auth(UserRoleEnum.SUPERADMIN),
    validateRequest.body(QuestionValidation.createQuestionZodSchema),
    QuestionController.createQuestion
);
```

3. **That's it!** All validators work automatically based on the `type` field.
