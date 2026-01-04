# Question Creation Examples - JSON Format

## 🎯 Quick Reference

Copy and paste these JSON examples to create questions.

---

## 1️⃣ SINGLE CHOICE (Radio Buttons)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "What is your favorite color?",
    "type": "single_choice",
    "required": true,
    "order": 1,
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

## 2️⃣ MULTIPLE CHOICE (Checkboxes)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Which programming languages do you know?",
    "type": "multiple_choice",
    "required": false,
    "order": 2,
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

## 3️⃣ TEXTAREA (Long Text)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Please describe your experience",
    "type": "textarea",
    "required": true,
    "order": 3,
    "config": {
        "placeholder": "Enter your answer here...",
        "maxLength": 2000,
        "minLength": 10
    }
}
```

**Response:**

```json
{
    "questionId": "...",
    "value": "This is a detailed response..."
}
```

---

## 4️⃣ RATING STAR (1-5 Stars)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "How satisfied are you?",
    "type": "rating_star",
    "required": true,
    "order": 4,
    "config": {
        "min": 1,
        "max": 5
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

## 5️⃣ RATING SCALE (0-10 Scale)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "How likely are you to recommend us?",
    "type": "rating_scale",
    "required": true,
    "order": 5,
    "config": {
        "min": 0,
        "max": 10,
        "labels": {
            "min": "Not Likely",
            "max": "Very Likely"
        }
    }
}
```

**Response:**

```json
{
    "questionId": "...",
    "value": 9
}
```

---

## 6️⃣ BOOLEAN (Yes/No)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Do you agree to terms?",
    "type": "boolean",
    "required": true,
    "order": 6,
    "config": {
        "trueLabel": "Yes, I agree",
        "falseLabel": "No, I disagree"
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

## 7️⃣ ORDER RANK (Drag and Drop)

```json
{
    "surveyId": "YOUR_SURVEY_ID",
    "title": "Rank these features in order of importance",
    "type": "order_rank",
    "required": true,
    "order": 7,
    "config": {
        "items": ["Speed", "Reliability", "Cost", "Support"],
        "maxRankable": 3
    }
}
```

**Response:**

```json
{
    "questionId": "...",
    "value": ["Reliability", "Cost", "Speed"]
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
            "questionId": "q1_id",
            "value": "Blue"
        },
        {
            "questionId": "q2_id",
            "value": ["JavaScript"]
        },
        {
            "questionId": "q3_id",
            "value": "My experience was great..."
        },
        {
            "questionId": "q4_id",
            "value": 5
        },
        {
            "questionId": "q5_id",
            "value": 9
        },
        {
            "questionId": "q6_id",
            "value": true
        },
        {
            "questionId": "q7_id",
            "value": ["Reliability", "Cost", "Speed"]
        }
    ]
}
```

---

## 📊 Response Value Types

| Question Type   | Value Type | Example           |
| --------------- | ---------- | ----------------- |
| single_choice   | `string`   | `"Blue"`          |
| multiple_choice | `string[]` | `["A", "B"]`      |
| textarea        | `string`   | `"Text..."`       |
| rating_star     | `number`   | `5`               |
| rating_scale    | `number`   | `8`               |
| boolean         | `boolean`  | `true`            |
| order_rank      | `string[]` | `["A", "C", "B"]` |
