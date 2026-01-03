# Question Creation Examples - JSON Format

## 🎯 Quick Reference

Copy and paste these JSON examples to create questions.

---

## 1️⃣ TEXT QUESTION

```json
{
    "surveyId": "YOUR_SURVEY_ID",
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

**Response:**

```json
{
    "questionId": "...",
    "value": "John Doe"
}
```

---

## 2️⃣ SINGLE CHOICE (MCQ - Radio Buttons)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "What is your favorite color?",
    "type": "single-choice",
    "required": true,
    "order": 2,
    "config": {
        "options": ["Red", "Blue", "Green", "Yellow"],
        "allowOther": false
    }
}
```

**Response:**

```json
{
    "questionId": "...",
    "value": "Blue"
}
```

---

## 3️⃣ MULTI CHOICE (Checkboxes)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Which programming languages do you know?",
    "type": "multi-choice",
    "required": false,
    "order": 3,
    "config": {
        "options": ["JavaScript", "Python", "Java", "C#"],
        "minSelections": 1,
        "maxSelections": 3,
        "allowOther": true
    }
}
```

**Response:**

```json
{
    "questionId": "...",
    "value": ["JavaScript", "Python"]
}
```

---

## 4️⃣ NUMBER QUESTION

```json
{
    "surveyId": "YOUR_SURVEY_ID",
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

**Response:**

```json
{
    "questionId": "...",
    "value": 25
}
```

---

## 5️⃣ RATING QUESTION

```json
{
    "surveyId": "YOUR_SURVEY_ID",
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

**Response:**

```json
{
    "questionId": "...",
    "value": 5
}
```

---

## 6️⃣ DATE QUESTION

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "When did you start your current job?",
    "type": "date",
    "required": false,
    "order": 6,
    "config": {
        "minDate": "2000-01-01",
        "maxDate": "2026-12-31",
        "format": "YYYY-MM-DD"
    }
}
```

**Response:**

```json
{
    "questionId": "...",
    "value": "2020-03-15"
}
```

---

## 7️⃣ BOOLEAN QUESTION

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Would you recommend our service?",
    "type": "boolean",
    "required": true,
    "order": 7,
    "config": {
        "trueLabel": "Yes, definitely",
        "falseLabel": "No, probably not"
    }
}
```

**Response:**

```json
{
    "questionId": "...",
    "value": true
}
```

---

## 📤 SUBMIT RESPONSE

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "userId": "YOUR_USER_ID",
    "answers": [
        {
            "questionId": "text_q_id",
            "value": "John Doe"
        },
        {
            "questionId": "single_choice_q_id",
            "value": "Blue"
        },
        {
            "questionId": "multi_choice_q_id",
            "value": ["JavaScript", "Python"]
        },
        {
            "questionId": "number_q_id",
            "value": 25
        },
        {
            "questionId": "rating_q_id",
            "value": 5
        },
        {
            "questionId": "date_q_id",
            "value": "2020-03-15"
        },
        {
            "questionId": "boolean_q_id",
            "value": true
        }
    ]
}
```

---

## 📊 Response Value Types

| Question Type | Value Type | Example                    |
| ------------- | ---------- | -------------------------- |
| text          | `string`   | `"John Doe"`               |
| textarea      | `string`   | `"Long text..."`           |
| email         | `string`   | `"user@example.com"`       |
| number        | `number`   | `25`                       |
| rating        | `number`   | `5`                        |
| single-choice | `string`   | `"Blue"`                   |
| multi-choice  | `string[]` | `["JavaScript", "Python"]` |
| date          | `string`   | `"2020-03-15"`             |
| boolean       | `boolean`  | `true`                     |
