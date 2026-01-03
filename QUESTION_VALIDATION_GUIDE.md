# Question Validation Guide

## Overview

This guide explains how question validation works in the Ana Survey Portal, covering both **question creation** and **response validation**.

---

## 📋 Supported Question Types

1. **text** - Short text input
2. **textarea** - Long text input
3. **email** - Email address input
4. **number** - Numeric input
5. **rating** - Rating scale (e.g., 1-5 stars)
6. **single-choice** - Radio buttons (select one)
7. **multi-choice** - Checkboxes (select multiple)
8. **date** - Date picker
9. **boolean** - Yes/No question

---

## 🔧 Question Creation Validation

### How It Works

When creating a question, the system validates:

1. ✅ **Required fields** (surveyId, title, type, order)
2. ✅ **Question type** is valid
3. ✅ **Config structure** matches the question type
4. ✅ **Config values** are appropriate (e.g., options for choice questions)

### Example Requests

#### 1. Text Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "What is your name?",
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

#### 2. Single Choice Question (MCQ - Select One)

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
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

**OR with object format:**

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "Select your country",
    "type": "single-choice",
    "required": true,
    "order": 3,
    "config": {
        "options": [
            { "value": "us", "label": "United States" },
            { "value": "uk", "label": "United Kingdom" },
            { "value": "ca", "label": "Canada" }
        ],
        "allowOther": false
    }
}
```

#### 3. Multi Choice Question (Checkboxes - Select Multiple)

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "Which programming languages do you know?",
    "type": "multi-choice",
    "required": false,
    "order": 4,
    "config": {
        "options": ["JavaScript", "Python", "Java", "C++", "Go"],
        "minSelections": 1,
        "maxSelections": 3,
        "allowOther": true
    }
}
```

#### 4. Number Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "What is your age?",
    "type": "number",
    "required": true,
    "order": 5,
    "config": {
        "min": 18,
        "max": 100,
        "step": 1,
        "placeholder": "Enter your age"
    }
}
```

#### 5. Rating Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "How satisfied are you with our service?",
    "type": "rating",
    "required": true,
    "order": 6,
    "config": {
        "min": 1,
        "max": 5,
        "step": 1
    }
}
```

#### 6. Date Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "When is your birthday?",
    "type": "date",
    "required": true,
    "order": 7,
    "config": {
        "minDate": "1900-01-01",
        "maxDate": "2010-12-31",
        "format": "YYYY-MM-DD"
    }
}
```

#### 7. Boolean Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "Do you agree to the terms and conditions?",
    "type": "boolean",
    "required": true,
    "order": 8,
    "config": {
        "trueLabel": "I agree",
        "falseLabel": "I disagree"
    }
}
```

#### 8. Email Question

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "title": "What is your email address?",
    "type": "email",
    "required": true,
    "order": 9,
    "config": {
        "placeholder": "you@example.com"
    }
}
```

---

## ✅ Response Validation

### How It Works

When a user submits a response, the system validates:

1. ✅ **All required questions** are answered
2. ✅ **Answer format** matches question type
3. ✅ **Answer values** are within allowed ranges/options
4. ✅ **Survey is published** and active

### Example Response Submission

```json
{
    "surveyId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012", // Optional for anonymous responses
    "answers": [
        {
            "questionId": "507f1f77bcf86cd799439013",
            "value": "John Doe" // text answer
        },
        {
            "questionId": "507f1f77bcf86cd799439014",
            "value": "Blue" // single-choice answer
        },
        {
            "questionId": "507f1f77bcf86cd799439015",
            "value": ["JavaScript", "Python"] // multi-choice answer
        },
        {
            "questionId": "507f1f77bcf86cd799439016",
            "value": 25 // number answer
        },
        {
            "questionId": "507f1f77bcf86cd799439017",
            "value": 5 // rating answer
        },
        {
            "questionId": "507f1f77bcf86cd799439018",
            "value": "1995-06-15" // date answer
        },
        {
            "questionId": "507f1f77bcf86cd799439019",
            "value": true // boolean answer
        },
        {
            "questionId": "507f1f77bcf86cd799439020",
            "value": "john@example.com" // email answer
        }
    ]
}
```

---

## 🚨 Validation Errors

### Question Creation Errors

**Missing required field:**

```json
{
    "success": false,
    "message": "Validation failed: Question title is required"
}
```

**Invalid question type:**

```json
{
    "success": false,
    "message": "Validation failed: Invalid enum value. Expected 'text' | 'textarea' | 'email' | 'number' | 'rating' | 'single-choice' | 'multi-choice' | 'date' | 'boolean', received 'dropdown'"
}
```

**Invalid config for single-choice:**

```json
{
    "success": false,
    "message": "Validation failed: Single choice must have at least 2 options"
}
```

### Response Validation Errors

**Required question not answered:**

```json
{
    "success": false,
    "message": "Question 'What is your name?' is required"
}
```

**Invalid option selected:**

```json
{
    "success": false,
    "message": "Question 'What is your favorite color?': Invalid option selected: Purple"
}
```

**Number out of range:**

```json
{
    "success": false,
    "message": "Question 'What is your age?': Value must be at least 18"
}
```

**Invalid email format:**

```json
{
    "success": false,
    "message": "Question 'What is your email address?': Invalid email"
}
```

---

## 🔄 Update Question

When updating a question:

- ✅ **Title** can always be updated
- ✅ **Config** is validated against the question type
- ❌ **Type** cannot be changed
- ❌ **Config/required/order** cannot be changed if responses exist (for published surveys)

### Example Update Request

```json
{
    "title": "What is your full name?",
    "config": {
        "placeholder": "First and last name",
        "maxLength": 150
    }
}
```

---

## 📝 Best Practices

### 1. **Always provide meaningful titles**

```json
✅ "What is your email address?"
❌ "Email"
```

### 2. **Use appropriate question types**

```json
✅ Use "email" type for email addresses (validates format)
❌ Use "text" type for email addresses
```

### 3. **Provide clear options for choice questions**

```json
✅ ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
❌ ["SA", "A", "N", "D", "SD"]
```

### 4. **Set reasonable limits**

```json
✅ { "min": 18, "max": 100 } for age
❌ { "min": 0, "max": 999999 } for age
```

### 5. **Use required wisely**

```json
✅ required: true for essential questions
✅ required: false for optional demographic questions
```

---

## 🔍 Testing Your Questions

### Test Question Creation

```bash
POST /api/v1/questions
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "surveyId": "...",
  "title": "Test question",
  "type": "text",
  "required": false,
  "order": 1,
  "config": {}
}
```

### Test Response Submission

```bash
POST /api/v1/responses
Content-Type: application/json

{
  "surveyId": "...",
  "answers": [
    {
      "questionId": "...",
      "value": "Test answer"
    }
  ]
}
```

---

## 🛠️ Frontend Integration Tips

### 1. **Dynamic Form Rendering**

Based on question type, render appropriate input:

- `text/textarea/email` → `<input>` or `<textarea>`
- `number` → `<input type="number">`
- `rating` → Star rating component
- `single-choice` → Radio buttons
- `multi-choice` → Checkboxes
- `date` → Date picker
- `boolean` → Toggle or Yes/No buttons

### 2. **Client-Side Validation**

Validate before submission to improve UX:

```javascript
// Example for single-choice
if (!config.options.includes(answer)) {
    showError('Please select a valid option');
}

// Example for number
if (answer < config.min || answer > config.max) {
    showError(`Value must be between ${config.min} and ${config.max}`);
}
```

### 3. **Handle Validation Errors**

```javascript
try {
    await submitResponse(data);
} catch (error) {
    // Display error.message to user
    showToast(error.message, 'error');
}
```

---

## 📚 Summary

✅ **Question validation** ensures data integrity at creation time
✅ **Response validation** ensures users submit valid answers
✅ **Type-specific configs** provide flexibility for different question types
✅ **Clear error messages** help frontend developers debug issues
✅ **Comprehensive validation** prevents bad data from entering the system

For more details, check the source code:

- `src/app/modules/question/question.validation.ts` - Question schemas
- `src/app/modules/response/validators/answerValidators.ts` - Response validation
