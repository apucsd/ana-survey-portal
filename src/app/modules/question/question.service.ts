import { Question } from '@prisma/client';
import { prisma } from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createQuestionIntoDB = async (payload: Question & { surveyId: string }, userId: string) => {
    const survey = await prisma.survey.findUnique({
        where: {
            id: payload.surveyId,
            status: {
                not: 'DELETED',
            },
        },
        include: {
            creator: true,
        },
    });
    if (!survey) throw new AppError(httpStatus.NOT_FOUND, 'Survey not found');
    if (survey.creator.id !== userId)
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to create a question');

    if (survey.status === 'PUBLISHED' || survey.status === 'CLOSED')
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot add question to published or closed survey');

    const existingQuestion = await prisma.question.findFirst({
        where: {
            surveyId: payload.surveyId,
            order: payload.order,
        },
    });
    if (existingQuestion) {
        await prisma.question.updateMany({
            where: {
                surveyId: payload.surveyId,
                order: {
                    gte: payload.order,
                },
            },
            data: {
                order: {
                    increment: 1,
                },
            },
        });
    }

    const { surveyId, ...questionData } = payload;
    const result = await prisma.question.create({
        data: {
            type: questionData.type,
            title: questionData.title,
            required: questionData.required,
            order: questionData.order,
            config: questionData.config || {},
            survey: {
                connect: {
                    id: surveyId,
                },
            },
        },
    });
    return result;
};

export const QuestionService = {
    createQuestionIntoDB,
};
