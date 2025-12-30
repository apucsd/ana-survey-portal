import { Survey, SurveyStatus } from '@prisma/client';
import { prisma } from '../../utils/prisma';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
const createSurveyIntoDB = async (payload: Survey) => {
    const result = await prisma.survey.create({
        data: {
            ...payload,
        },
    });
    return result;
};

const updateSurveyIntoDB = async (id: string, payload: Survey) => {
    const result = await prisma.survey.update({
        where: {
            id,
        },
        data: {
            ...payload,
        },
    });
    return result;
};

const publishSurveyIntoDB = async (id: string, userId: string) => {
    const survey = await prisma.survey.findUnique({
        where: {
            id,
            status: SurveyStatus.UNPUBLISHED,
        },
        include: {
            questions: true,
            creator: true,
        },
    });

    if (!survey) throw new AppError(httpStatus.NOT_FOUND, 'Survey not found');
    if (survey.creator.id !== userId)
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to publish this survey');

    if (survey.questions.length === 0)
        throw new AppError(httpStatus.BAD_REQUEST, 'Survey must have at least one question');

    const result = await prisma.survey.update({
        where: {
            id,
        },
        data: {
            publishedAt: new Date(),
            status: SurveyStatus.PUBLISHED,
        },
    });
    return result;
};

const closeSurveyIntoDB = async (id: string, userId: string) => {
    const survey = await prisma.survey.findUnique({
        where: {
            id,
            status: SurveyStatus.PUBLISHED,
        },
        include: {
            creator: true,
        },
    });

    if (!survey) throw new AppError(httpStatus.NOT_FOUND, 'Survey not found');
    if (survey.creator.id !== userId)
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to close this survey');

    const result = await prisma.survey.update({
        where: {
            id,
        },
        data: {
            status: SurveyStatus.CLOSED,
        },
    });
    return result;
};
const getPublishedSurveysForUserFromDB = async (query: Record<string, any>) => {
    const result = await new QueryBuilder(prisma.survey, { ...query, status: SurveyStatus.PUBLISHED })
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .exclude()
        .execute();
    return result;
};

const getAllSurveysForAdminFromDB = async (query: Record<string, any>) => {
    const result = await new QueryBuilder(prisma.survey, query)
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .exclude()
        .execute();
    return result;
};

const getSingleSurveyForAdminFromDB = async (id: string) => {
    const result = await prisma.survey.findUnique({
        where: {
            id,
        },
    });
    return result;
};
const deleteSurveyIntoDB = async (id: string, userId: string) => {
    const survey = await prisma.survey.findUnique({
        where: {
            id,
        },
        include: {
            creator: true,
        },
    });

    if (!survey) throw new AppError(httpStatus.NOT_FOUND, 'Survey not found');
    if (survey.creator.id !== userId)
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to delete this survey');

    const result = await prisma.survey.update({
        where: {
            id,
        },
        data: {
            status: SurveyStatus.DELETED,
        },
    });
    return result;
};

export const SurveyService = {
    createSurveyIntoDB,
    updateSurveyIntoDB,
    getAllSurveysForAdminFromDB,
    getSingleSurveyForAdminFromDB,
    getPublishedSurveysForUserFromDB,
    deleteSurveyIntoDB,
    publishSurveyIntoDB,
    closeSurveyIntoDB,
};
