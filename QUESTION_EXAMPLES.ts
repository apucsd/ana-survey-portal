/**
 * EXAMPLE: How to Create Different Question Types
 *
 * This file shows practical examples of creating questions via API
 */

// ============================================
// EXAMPLE 1: Creating a Complete Survey
// ============================================

const surveyId = '507f1f77bcf86cd799439011'; // Your survey ID

// Step 1: Create Text Question
const textQuestion = {
    surveyId,
    title: 'What is your full name?',
    type: 'text',
    required: true,
    order: 1,
    config: {
        placeholder: 'Enter your full name',
        maxLength: 100,
        minLength: 2,
    },
};

// Step 2: Create Email Question
const emailQuestion = {
    surveyId,
    title: 'What is your email address?',
    type: 'email',
    required: true,
    order: 2,
    config: {
        placeholder: 'you@example.com',
    },
};

// Step 3: Create Single Choice Question (MCQ)
const singleChoiceQuestion = {
    surveyId,
    title: 'What is your employment status?',
    type: 'single-choice',
    required: true,
    order: 3,
    config: {
        options: ['Full-time employed', 'Part-time employed', 'Self-employed', 'Unemployed', 'Student', 'Retired'],
        allowOther: true,
    },
};

// Step 4: Create Multi Choice Question (Checkboxes)
const multiChoiceQuestion = {
    surveyId,
    title: 'Which of the following programming languages do you use? (Select all that apply)',
    type: 'multi-choice',
    required: false,
    order: 4,
    config: {
        options: ['JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust'],
        minSelections: 1,
        maxSelections: 5,
        allowOther: true,
    },
};

// Step 5: Create Rating Question
const ratingQuestion = {
    surveyId,
    title: 'How satisfied are you with our service?',
    type: 'rating',
    required: true,
    order: 5,
    config: {
        min: 1,
        max: 5,
        step: 1,
    },
};

// Step 6: Create Number Question
const numberQuestion = {
    surveyId,
    title: 'How many years of experience do you have?',
    type: 'number',
    required: true,
    order: 6,
    config: {
        min: 0,
        max: 50,
        step: 1,
        placeholder: 'Enter years',
    },
};

// Step 7: Create Date Question
const dateQuestion = {
    surveyId,
    title: 'When did you start your current job?',
    type: 'date',
    required: false,
    order: 7,
    config: {
        minDate: '2000-01-01',
        maxDate: new Date().toISOString().split('T')[0], // Today
        format: 'YYYY-MM-DD',
    },
};

// Step 8: Create Boolean Question
const booleanQuestion = {
    surveyId,
    title: 'Would you recommend our service to others?',
    type: 'boolean',
    required: true,
    order: 8,
    config: {
        trueLabel: 'Yes, definitely',
        falseLabel: 'No, probably not',
    },
};

// ============================================
// EXAMPLE 2: Creating Questions via API
// ============================================

async function createAllQuestions() {
    const questions = [
        textQuestion,
        emailQuestion,
        singleChoiceQuestion,
        multiChoiceQuestion,
        ratingQuestion,
        numberQuestion,
        dateQuestion,
        booleanQuestion,
    ];

    const token = 'YOUR_AUTH_TOKEN'; // Get from login

    for (const question of questions) {
        try {
            const response = await fetch('http://localhost:5000/api/v1/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(question),
            });

            const result = await response.json();

            if (result.success) {
                console.log(`✅ Created: ${question.title}`);
            } else {
                console.error(`❌ Failed: ${question.title}`, result.message);
            }
        } catch (error) {
            console.error(`❌ Error creating ${question.title}:`, error);
        }
    }
}

// ============================================
// EXAMPLE 3: Submitting a Response
// ============================================

async function submitSurveyResponse() {
    const response = {
        surveyId: '507f1f77bcf86cd799439011',
        userId: '507f1f77bcf86cd799439012', // Optional - omit for anonymous
        answers: [
            {
                questionId: 'q1_id', // Text question
                value: 'John Doe',
            },
            {
                questionId: 'q2_id', // Email question
                value: 'john.doe@example.com',
            },
            {
                questionId: 'q3_id', // Single choice
                value: 'Full-time employed',
            },
            {
                questionId: 'q4_id', // Multi choice
                value: ['JavaScript', 'Python', 'TypeScript'],
            },
            {
                questionId: 'q5_id', // Rating
                value: 5,
            },
            {
                questionId: 'q6_id', // Number
                value: 7,
            },
            {
                questionId: 'q7_id', // Date
                value: '2020-03-15',
            },
            {
                questionId: 'q8_id', // Boolean
                value: true,
            },
        ],
    };

    try {
        const result = await fetch('http://localhost:5000/api/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(response),
        });

        const data = await result.json();

        if (data.success) {
            console.log('✅ Response submitted successfully!');
        } else {
            console.error('❌ Submission failed:', data.message);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// ============================================
// EXAMPLE 4: Frontend Form Component (React)
// ============================================

/*
import React, { useState } from 'react';

function QuestionRenderer({ question, onChange }) {
    const [value, setValue] = useState('');

    const handleChange = (newValue) => {
        setValue(newValue);
        onChange(question.id, newValue);
    };

    switch (question.type) {
        case 'text':
        case 'email':
            return (
                <input
                    type={question.type}
                    placeholder={question.config.placeholder}
                    maxLength={question.config.maxLength}
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    required={question.required}
                />
            );

        case 'textarea':
            return (
                <textarea
                    placeholder={question.config.placeholder}
                    maxLength={question.config.maxLength}
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    required={question.required}
                />
            );

        case 'number':
            return (
                <input
                    type="number"
                    min={question.config.min}
                    max={question.config.max}
                    step={question.config.step}
                    value={value}
                    onChange={(e) => handleChange(Number(e.target.value))}
                    required={question.required}
                />
            );

        case 'rating':
            return (
                <div className="rating">
                    {Array.from({ length: question.config.max }, (_, i) => i + 1).map((rating) => (
                        <button
                            key={rating}
                            onClick={() => handleChange(rating)}
                            className={value >= rating ? 'active' : ''}
                        >
                            ⭐
                        </button>
                    ))}
                </div>
            );

        case 'single-choice':
            return (
                <div>
                    {question.config.options.map((option, index) => {
                        const optionValue = typeof option === 'string' ? option : option.value;
                        const optionLabel = typeof option === 'string' ? option : option.label;
                        
                        return (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={optionValue}
                                    checked={value === optionValue}
                                    onChange={(e) => handleChange(e.target.value)}
                                    required={question.required}
                                />
                                {optionLabel}
                            </label>
                        );
                    })}
                </div>
            );

        case 'multi-choice':
            return (
                <div>
                    {question.config.options.map((option, index) => {
                        const optionValue = typeof option === 'string' ? option : option.value;
                        const optionLabel = typeof option === 'string' ? option : option.label;
                        const isChecked = Array.isArray(value) && value.includes(optionValue);
                        
                        return (
                            <label key={index}>
                                <input
                                    type="checkbox"
                                    value={optionValue}
                                    checked={isChecked}
                                    onChange={(e) => {
                                        const currentValue = Array.isArray(value) ? value : [];
                                        if (e.target.checked) {
                                            handleChange([...currentValue, optionValue]);
                                        } else {
                                            handleChange(currentValue.filter(v => v !== optionValue));
                                        }
                                    }}
                                />
                                {optionLabel}
                            </label>
                        );
                    })}
                </div>
            );

        case 'date':
            return (
                <input
                    type="date"
                    min={question.config.minDate}
                    max={question.config.maxDate}
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    required={question.required}
                />
            );

        case 'boolean':
            return (
                <div>
                    <button
                        onClick={() => handleChange(true)}
                        className={value === true ? 'active' : ''}
                    >
                        {question.config.trueLabel || 'Yes'}
                    </button>
                    <button
                        onClick={() => handleChange(false)}
                        className={value === false ? 'active' : ''}
                    >
                        {question.config.falseLabel || 'No'}
                    </button>
                </div>
            );

        default:
            return <div>Unknown question type</div>;
    }
}

export default QuestionRenderer;
*/

// ============================================
// EXAMPLE 5: Validation Errors Handling
// ============================================

/*
Common validation errors and how to handle them:

1. Missing required field:
   Error: "Validation failed: Question title is required"
   Fix: Ensure all required fields are provided

2. Invalid question type:
   Error: "Validation failed: Invalid enum value"
   Fix: Use one of the supported types: text, textarea, email, number, rating, single-choice, multi-choice, date, boolean

3. Insufficient options:
   Error: "Validation failed: Single choice must have at least 2 options"
   Fix: Provide at least 2 options for choice questions

4. Invalid answer:
   Error: "Question 'What is your favorite color?': Invalid option selected: Purple"
   Fix: Ensure the answer matches one of the provided options

5. Required question not answered:
   Error: "Question 'What is your name?' is required"
   Fix: Ensure all required questions have answers

6. Number out of range:
   Error: "Question 'What is your age?': Value must be at least 18"
   Fix: Ensure number values are within the specified min/max range
*/

export {
    textQuestion,
    emailQuestion,
    singleChoiceQuestion,
    multiChoiceQuestion,
    ratingQuestion,
    numberQuestion,
    dateQuestion,
    booleanQuestion,
    createAllQuestions,
    submitSurveyResponse,
};
