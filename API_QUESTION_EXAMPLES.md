# API Question & Response Examples

## Base URL

```
http://localhost:5000/api/v1
```

---

## 📝 CREATE QUESTIONS

### Endpoint

```
POST /api/v1/questions
Authorization: Bearer {token}
Content-Type: application/json
```

---

## Question Type Examples

### 1️⃣ Text Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "What is your full name?",
    "type": "text",
    "required": true,
    "order": 1,
    "config": {
        "placeholder": "Enter your full name",
        "maxLength": 100,
        "minLength": 2
    }
}
```

**Response Format:**

```json
{
    "questionId": "question_id_here",
    "value": "John Doe"
}
```

---

### 2️⃣ Textarea Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "Please describe your experience with our product",
    "type": "textarea",
    "required": false,
    "order": 2,
    "config": {
        "placeholder": "Share your thoughts...",
        "maxLength": 500,
        "minLength": 10
    }
}
```

**Response Format:**

```json
{
    "questionId": "question_id_here",
    "value": "This is a long text response describing my experience. It can be multiple sentences."
}
```

---

### 3️⃣ Email Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "What is your email address?",
    "type": "email",
    "required": true,
    "order": 3,
    "config": {
        "placeholder": "you@example.com"
    }
}
```

**Response Format:**

```json
{
    "questionId": "question_id_here",
    "value": "john.doe@example.com"
}
```

---

### 4️⃣ Number Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "What is your age?",
    "type": "number",
    "required": true,
    "order": 4,
    "config": {
        "min": 18,
        "max": 100,
        "step": 1,
        "placeholder": "Enter your age"
    }
}
```

**Response Format:**

```json
{
    "questionId": "question_id_here",
    "value": 25
}
```

---

### 5️⃣ Rating Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "How satisfied are you with our service?",
    "type": "rating",
    "required": true,
    "order": 5,
    "config": {
        "min": 1,
        "max": 5,
        "step": 1
    }
}
```

**Response Format:**

```json
{
    "questionId": "question_id_here",
    "value": 5
}
```

---

### 6️⃣ Single Choice Question (Simple Array)

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "What is your favorite color?",
    "type": "single-choice",
    "required": true,
    "order": 6,
    "config": {
        "options": ["Red", "Blue", "Green", "Yellow", "Purple"],
        "allowOther": false
    }
}
```

**Response Format:**

```json
{
    "questionId": "question_id_here",
    "value": "Blue"
}
```

---

### 7️⃣ Single Choice Question (Object Format)

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "What is your employment status?",
    "type": "single-choice",
    "required": true,
    "order": 7,
    "config": {
        "options": [
            {
                "value": "full-time",
                "label": "Full-time employed"
            },
            {
                "value": "part-time",
                "label": "Part-time employed"
            },
            {
                "value": "self-employed",
                "label": "Self-employed"
            },
            {
                "value": "unemployed",
                "label": "Unemployed"
            },
            {
                "value": "student",
                "label": "Student"
            },
            {
                "value": "retired",
                "label": "Retired"
            }
        ],
        "allowOther": true
    }
}
```

**Response Format (use the value, not label):**

```json
{
    "questionId": "question_id_here",
    "value": "full-time"
}
```

---

### 8️⃣ Multi Choice Question (Checkboxes)

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "Which programming languages do you know? (Select all that apply)",
    "type": "multi-choice",
    "required": false,
    "order": 8,
    "config": {
        "options": ["JavaScript", "Python", "Java", "C#", "PHP", "Ruby", "Go", "Rust"],
        "minSelections": 1,
        "maxSelections": 5,
        "allowOther": true
    }
}
```

**Response Format (array of strings):**

```json
{
    "questionId": "question_id_here",
    "value": ["JavaScript", "Python", "TypeScript"]
}
```

---

### 9️⃣ Date Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "When did you start your current job?",
    "type": "date",
    "required": false,
    "order": 9,
    "config": {
        "minDate": "2000-01-01",
        "maxDate": "2026-12-31",
        "format": "YYYY-MM-DD"
    }
}
```

**Response Format (ISO date string):**

```json
{
    "questionId": "question_id_here",
    "value": "2020-03-15"
}
```

---

### 🔟 Boolean Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "Would you recommend our service to others?",
    "type": "boolean",
    "required": true,
    "order": 10,
    "config": {
        "trueLabel": "Yes, definitely",
        "falseLabel": "No, probably not"
    }
}
```

**Response Format:**

```json
{
    "questionId": "question_id_here",
    "value": true
}
```

---

## 📤 SUBMIT RESPONSE

### Endpoint

```
POST /api/v1/responses
Content-Type: application/json
```

### Complete Response Example (All Question Types)

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "answers": [
        {
            "questionId": "text_question_id",
            "value": "John Doe"
        },
        {
            "questionId": "textarea_question_id",
            "value": "This is a long text response describing my experience with the product."
        },
        {
            "questionId": "email_question_id",
            "value": "john.doe@example.com"
        },
        {
            "questionId": "number_question_id",
            "value": 25
        },
        {
            "questionId": "rating_question_id",
            "value": 5
        },
        {
            "questionId": "single_choice_simple_question_id",
            "value": "Blue"
        },
        {
            "questionId": "single_choice_object_question_id",
            "value": "full-time"
        },
        {
            "questionId": "multi_choice_question_id",
            "value": ["JavaScript", "Python", "TypeScript"]
        },
        {
            "questionId": "date_question_id",
            "value": "2020-03-15"
        },
        {
            "questionId": "boolean_question_id",
            "value": true
        }
    ]
}
```

### Anonymous Response Example

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "answers": [
        {
            "questionId": "question_id_1",
            "value": "Anonymous response"
        },
        {
            "questionId": "question_id_2",
            "value": 4
        }
    ]
}
```

---

## 📊 Response Value Types Summary

| Question Type     | Value Type | Example                    |
| ----------------- | ---------- | -------------------------- |
| **text**          | `string`   | `"John Doe"`               |
| **textarea**      | `string`   | `"Long text here..."`      |
| **email**         | `string`   | `"user@example.com"`       |
| **number**        | `number`   | `25`                       |
| **rating**        | `number`   | `5`                        |
| **single-choice** | `string`   | `"Blue"` or `"full-time"`  |
| **multi-choice**  | `string[]` | `["JavaScript", "Python"]` |
| **date**          | `string`   | `"2020-03-15"`             |
| **boolean**       | `boolean`  | `true` or `false`          |

---

## ⚠️ Important Notes

1. **Required Questions**: Must be answered in the response
2. **Single Choice**: Value must match one of the options (use `value` if object format)
3. **Multi Choice**: Array of strings, each must match an option
4. **Number/Rating**: Must be within min/max range
5. **Email**: Must be valid email format
6. **Date**: Must be ISO format (YYYY-MM-DD) and within min/max range
7. **Anonymous**: Omit `userId` field for anonymous responses

---

## 🎯 Quick Copy Templates

### Text Question

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Your question here?",
    "type": "text",
    "required": true,
    "order": 1,
    "config": {
        "placeholder": "Enter text...",
        "maxLength": 100
    }
}
```

### Single Choice (MCQ)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Your question here?",
    "type": "single-choice",
    "required": true,
    "order": 1,
    "config": {
        "options": ["Option 1", "Option 2", "Option 3"],
        "allowOther": false
    }
}
```

### Multi Choice (Checkboxes)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Your question here? (Select all that apply)",
    "type": "multi-choice",
    "required": false,
    "order": 1,
    "config": {
        "options": ["Option 1", "Option 2", "Option 3"],
        "minSelections": 1,
        "maxSelections": 3
    }
}
```

### Rating

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Rate this on a scale of 1-5",
    "type": "rating",
    "required": true,
    "order": 1,
    "config": {
        "min": 1,
        "max": 5,
        "step": 1
    }
}
```
