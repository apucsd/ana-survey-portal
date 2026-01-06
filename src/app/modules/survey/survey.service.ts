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
    // 1. Verify survey ownership
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
    if (survey.creator.id !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view stats for this survey');
    }

    // 2. Get all responses with answers
    const responses = await prisma.response.findMany({
        where: { surveyId },
        include: {
            answers: true,
        },
    });

    const totalResponseCount = responses.length;

    // 3. Process stats per question
    const questionsStats = survey.questions.map((question) => {
        const questionAnswers = responses
            .map((r) => r.answers.find((a) => a.questionId === question.id))
            .filter((a) => a !== undefined && a.value !== null && a.value !== '');

        const answerCount = questionAnswers.length;
        const config = question.config as any;

        let statsData: { label: string; count: number }[] = [];
        let average: number | undefined;
        let recentAnswers: string[] | undefined;

        // Process based on type
        switch (question.type) {
            case 'single_choice':
            case 'boolean':
                // Group by value
                const counts: Record<string, number> = {};
                questionAnswers.forEach((a) => {
                    const val = String(a?.value);
                    counts[val] = (counts[val] || 0) + 1;
                });
                statsData = Object.entries(counts).map(([label, count]) => ({ label, count }));
                break;

            case 'multiple_choice':
                // Value is array, count each item
                const multiCounts: Record<string, number> = {};
                questionAnswers.forEach((a) => {
                    if (Array.isArray(a?.value)) {
                        (a?.value as string[]).forEach((val) => {
                            multiCounts[val] = (multiCounts[val] || 0) + 1;
                        });
                    }
                });
                statsData = Object.entries(multiCounts).map(([label, count]) => ({ label, count }));
                break;

            case 'rating_star':
            case 'rating_scale':
                // Group by number value + calculate average
                const ratingCounts: Record<string, number> = {};
                let sum = 0;
                let validRatings = 0;

                questionAnswers.forEach((a) => {
                    const val = Number(a?.value);
                    if (!isNaN(val)) {
                        const label = String(val);
                        ratingCounts[label] = (ratingCounts[label] || 0) + 1;
                        sum += val;
                        validRatings++;
                    }
                });

                if (validRatings > 0) {
                    average = Number((sum / validRatings).toFixed(1));
                }

                // Ensure all possible rating values exist in data (optional, but good for charts)
                const min = config.min || (question.type === 'rating_star' ? 1 : 0);
                const max = config.max || (question.type === 'rating_star' ? 5 : 10);
                for (let i = min; i <= max; i++) {
                    const label = String(i);
                    if (!ratingCounts[label]) ratingCounts[label] = 0;
                }

                statsData = Object.entries(ratingCounts)
                    .map(([label, count]) => ({ label, count }))
                    .sort((a, b) => Number(a.label) - Number(b.label));
                break;

            case 'textarea':
                // Just take recent 10 answers
                recentAnswers = questionAnswers
                    .slice(0, 10)
                    // eslint-disable-next-line @typescript-eslint/no-base-to-string
                    .map((a) => String(a?.value))
                    .filter((v) => typeof v === 'string' && v !== 'null' && v !== 'undefined');
                break;

            case 'order_rank':
                // For ranking, let's count how many times an item was ranked #1 (index 0)
                const rankCounts: Record<string, number> = {};
                questionAnswers.forEach((a) => {
                    if (Array.isArray(a?.value) && a?.value.length > 0) {
                        const topChoice = String(a?.value[0]); // The item at first position
                        rankCounts[topChoice] = (rankCounts[topChoice] || 0) + 1;
                    }
                });
                statsData = Object.entries(rankCounts).map(([label, count]) => ({ label, count }));
                break;
        }

        // Calculate percentages
        const finalData = statsData.map((item) => ({
            ...item,
            percentage: totalResponseCount > 0 ? Number(((item.count / totalResponseCount) * 100).toFixed(1)) : 0,
        }));

        return {
            questionId: question.id,
            title: question.title,
            type: question.type,
            responseCount: answerCount,
            data: finalData,
            average,
            recentAnswers,
        };
    });

    return {
        totalResponseCount,
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
