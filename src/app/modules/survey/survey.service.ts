import { QuestionStatus, Survey, SurveyStatus } from '@prisma/client';
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
const getPublishedSurveysForUserFromDB = async (userId: string, query: Record<string, any>) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    const myResponses = await prisma.response.findMany({
        where: {
            userId,
        },
    });

    const result = await new QueryBuilder(prisma.survey, { ...query, status: SurveyStatus.PUBLISHED })
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .exclude()
        .customFields({
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            publishedAt: true,
            endDate: true,
            status: true,
            _count: {
                select: {
                    responses: true,
                },
            },
        })
        .execute();

    const transformedData = {
        ...result,
        data: result?.data?.map((survey: any) => {
            const { _count, ...rest } = survey;
            return {
                ...rest,
                totalParticipants: _count?.responses || 0,
                isResponded: myResponses.some((response: any) => response.surveyId === survey.id),
            };
        }),
    };

    return transformedData;
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
        include: {
            // creator: true,
            questions: {
                orderBy: { order: 'asc' },
                where: {
                    status: QuestionStatus.ACTIVE,
                },
            },
        },
    });
    return result;
};
const getSingleSurveyForUserFromDB = async (id: string) => {
    const result = await prisma.survey.findUnique({
        where: {
            id,
            status: SurveyStatus.PUBLISHED,
        },
        include: {
            // creator: true,
            questions: {
                orderBy: { order: 'asc' },
            },
        },
    });
    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Survey not found');
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

const getSurveyStatsFromDB = async (surveyId: string, userId: string) => {
    const survey = await prisma.survey.findUnique({
        where: { id: surveyId },
        include: {
            questions: {
                orderBy: { order: 'asc' },
                where: { status: QuestionStatus.ACTIVE },
            },
            creator: true,
        },
    });

    if (!survey) throw new AppError(httpStatus.NOT_FOUND, 'Survey not found');
    if (survey.creator.id !== userId) throw new AppError(httpStatus.FORBIDDEN, 'Not authorized');

    const responses = await prisma.response.findMany({
        where: { surveyId },
        include: { answers: true },
    });

    const questionsStats = survey.questions.map((question) => {
        const answers = responses.map((r) => r.answers.find((a) => a.questionId === question.id)).filter(Boolean);

        const answerCount = answers.length;
        const config = question.config as any;

        let data: { label: string; count: number; percentage?: number }[] = [];
        let average: number | undefined;
        let recentAnswers: string[] | undefined;

        switch (question.type) {
            case 'single_choice':
            case 'boolean': {
                const counts: Record<string, number> = {};

                answers.forEach((a) => {
                    const val = a!.value;
                    if (typeof val === 'string') {
                        counts[val] = (counts[val] || 0) + 1;
                    } else if (typeof val === 'boolean') {
                        const s = String(val);
                        counts[s] = (counts[s] || 0) + 1;
                    }
                });

                data = (config.options || []).map((opt: any) => ({
                    label: opt,
                    count: counts[opt] || 0,
                }));
                break;
            }

            case 'multiple_choice': {
                const counts: Record<string, number> = {};

                answers.forEach((a) => {
                    const vals = a!.value;
                    if (Array.isArray(vals)) {
                        vals.forEach((v) => {
                            if (typeof v === 'string') {
                                counts[v] = (counts[v] || 0) + 1;
                            }
                        });
                    }
                });

                data = (config.options || []).map((opt: any) => ({
                    label: opt,
                    count: counts[opt] || 0,
                }));
                break;
            }

            case 'rating_star':
            case 'rating_scale': {
                const counts: Record<number, number> = {};
                let sum = 0;

                answers.forEach((a) => {
                    const score = a!.value;
                    if (typeof score === 'number') {
                        counts[score] = (counts[score] || 0) + 1;
                        sum += score;
                    }
                });

                if (answerCount > 0) {
                    average = Number((sum / answerCount).toFixed(1));
                }

                const min = config.min ?? (question.type === 'rating_star' ? 1 : 0);
                const max = config.max ?? (question.type === 'rating_star' ? 5 : 10);

                for (let i = min; i <= max; i++) {
                    data.push({
                        label: String(i),
                        count: counts[i] || 0,
                    });
                }
                break;
            }

            case 'textarea': {
                recentAnswers = answers
                    .slice(0, 10)
                    .map((a) => a!.value)
                    .filter((v): v is string => typeof v === 'string');
                break;
            }

            case 'order_rank': {
                const counts: Record<string, number> = {};

                answers.forEach((a) => {
                    const ordered = a!.value;
                    if (Array.isArray(ordered) && ordered.length > 0) {
                        const top = ordered[0] as string;
                        counts[top] = (counts[top] || 0) + 1;
                    }
                });

                data = (config.options || []).map((opt: any) => ({
                    label: opt,
                    count: counts[opt] || 0,
                }));
                break;
            }
        }

        const totalVotes = data.reduce((sum, d) => sum + d.count, 0);

        const finalData = data.map((d) => ({
            ...d,
            percentage: totalVotes > 0 ? Number(((d.count / totalVotes) * 100).toFixed(1)) : 0,
        }));

        return {
            questionId: question.id,
            title: question.title,
            type: question.type,
            responseCount: answerCount,
            average,
            recentAnswers,
            data: finalData,
        };
    });

    return {
        totalResponses: responses.length,
        questions: questionsStats,
    };
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
    getSingleSurveyForUserFromDB,
    getSurveyStatsFromDB,
};
