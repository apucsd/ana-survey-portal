import { prisma } from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { validateAnswer } from './validators/answerValidators';

const createResponseIntoDB = async (payload: any) => {
    const { surveyId, answers } = payload;

    const survey = await prisma.survey.findUnique({
        where: { id: surveyId },
        include: { questions: true },
    });

    if (!survey) throw new AppError(httpStatus.NOT_FOUND, 'Survey not found');
    if (survey.status !== 'PUBLISHED') throw new AppError(httpStatus.BAD_REQUEST, 'Survey is not active');

    // 2. Map Questions for O(1) lookup
    const questionMap = new Map(survey.questions.map((q) => [q.id, q]));

    // 3. Validate Every Answer
    for (const ans of answers) {
        const question = questionMap.get(ans.questionId);
        if (!question) throw new AppError(httpStatus.BAD_REQUEST, `Invalid question ID: ${ans.questionId}`);

        const validation = validateAnswer(ans.value, question);

        if (!validation.valid) {
            throw new AppError(httpStatus.BAD_REQUEST, `Question '${question.title}': ${validation.error}`);
        }
    }

    // 4. Check for Required Questions
    const answeredQuestionIds = new Set(answers.map((a: any) => a.questionId));
    const requiredQuestions = survey.questions.filter((q) => q.required);

    for (const reqQ of requiredQuestions) {
        if (!answeredQuestionIds.has(reqQ.id)) {
            throw new AppError(httpStatus.BAD_REQUEST, `Question '${reqQ.title}' is required`);
        }
    }

    const result = await prisma.response.create({
        data: {
            surveyId,
            userId: payload.userId || null,
            answers: {
                create: answers.map((ans: any) => ({
                    questionId: ans.questionId,
                    value: ans.value,
                })),
            },
        },
        include: { answers: true },
    });

    return result;
};

export const ResponseService = {
    createResponseIntoDB,
};
