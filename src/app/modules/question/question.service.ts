import { Question, QuestionStatus, SurveyStatus } from '@prisma/client';
import { prisma } from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createQuestionIntoDB = async (payload: Question, userId: string) => {
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

const updateQuestionIntoDB = async (userId: string, questionId: string, payload: Partial<Question>) => {
    return prisma.$transaction(async (tx) => {
        const question = await tx.question.findUnique({
            where: { id: questionId, status: QuestionStatus.ACTIVE },
            include: {
                survey: { include: { creator: true } },
                _count: { select: { answers: true } },
            },
        });

        if (!question) throw new AppError(httpStatus.NOT_FOUND, 'Question not found');

        if (question.survey.creator.id !== userId) throw new AppError(httpStatus.FORBIDDEN, 'Not authorized');

        if (question.survey.status === SurveyStatus.DELETED)
            throw new AppError(httpStatus.BAD_REQUEST, 'This survey is deleted');

        const updatedFields = Object.keys(payload).filter((f) => !['id', 'surveyId'].includes(f));

        if (updatedFields.includes('type'))
            throw new AppError(httpStatus.BAD_REQUEST, 'Question type cannot be changed');

        if (question.survey.status === SurveyStatus.PUBLISHED && question._count.answers > 0) {
            const SAFE_FIELDS = ['title'];
            const invalid = updatedFields.find((f) => !SAFE_FIELDS.includes(f));
            if (invalid) throw new AppError(httpStatus.BAD_REQUEST, `Cannot update "${invalid}" after responses exist`);
        }

        if (payload.order !== undefined && payload.order !== question.order) {
            if (payload.order > question.order) {
                await tx.question.updateMany({
                    where: {
                        surveyId: question.surveyId,
                        order: {
                            gt: question.order,
                            lte: payload.order,
                        },
                        id: { not: question.id },
                    },
                    data: { order: { decrement: 1 } },
                });
            } else {
                await tx.question.updateMany({
                    where: {
                        surveyId: question.surveyId,
                        order: {
                            gte: payload.order,
                            lt: question.order,
                        },
                        id: { not: question.id },
                    },
                    data: { order: { increment: 1 } },
                });
            }
        }

        const updateData: any = {
            title: payload.title,
            required: payload.required,
            order: payload.order,
        };

        if (payload.config !== undefined) {
            updateData.config = payload.config;
        }

        return tx.question.update({
            where: { id: question.id, status: QuestionStatus.ACTIVE },
            data: updateData,
        });
    });
};

const deleteQuestionIntoDB = async (userId: string, questionId: string) => {
    console.log(questionId);
    const question = await prisma.question.findUnique({
        where: { id: questionId, status: QuestionStatus.ACTIVE },
        include: {
            survey: { include: { creator: true } },
        },
    });
    console.log(question);
    if (!question) throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    if (question.survey.creator.id !== userId) throw new AppError(httpStatus.FORBIDDEN, 'Not authorized');
    if (question.survey.status === SurveyStatus.PUBLISHED)
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot delete published survey');
    return prisma.question.update({
        where: { id: questionId, status: QuestionStatus.ACTIVE },
        data: { status: QuestionStatus.DELETED },
    });
};

export const QuestionService = {
    createQuestionIntoDB,
    updateQuestionIntoDB,
    deleteQuestionIntoDB,
};
