import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SurveyService } from './survey.service';
import httpStatus from 'http-status';

const createSurvey = catchAsync(async (req, res) => {
    req.body.createdBy = req.user.id;
    const result = await SurveyService.createSurveyIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Survey created successfully',
        data: result,
    });
});

const updateSurvey = catchAsync(async (req, res) => {
    const result = await SurveyService.updateSurveyIntoDB(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Survey updated successfully',
        data: result,
    });
});

const publishSurvey = catchAsync(async (req, res) => {
    console.log({ id: req.params.id, userId: req.user.id });
    const result = await SurveyService.publishSurveyIntoDB(req.params.id, req.user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Survey published successfully',
        data: result,
    });
});

const closeSurvey = catchAsync(async (req, res) => {
    const result = await SurveyService.closeSurveyIntoDB(req.params.id, req.user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Survey closed successfully',
        data: result,
    });
});

const getPublishedSurveysForUser = catchAsync(async (req, res) => {
    const { data, meta } = await SurveyService.getPublishedSurveysForUserFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Surveys fetched successfully',
        data,
        meta,
    });
});
const getAllSurveysForAdmin = catchAsync(async (req, res) => {
    const { data, meta } = await SurveyService.getAllSurveysForAdminFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Surveys fetched successfully',
        data,
        meta,
    });
});
const getSingleSurveyForAdmin = catchAsync(async (req, res) => {
    const result = await SurveyService.getSingleSurveyForAdminFromDB(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Survey fetched successfully',
        data: result,
    });
});
const getSingleSurveyForUser = catchAsync(async (req, res) => {
    const result = await SurveyService.getSingleSurveyForUserFromDB(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Survey fetched successfully',
        data: result,
    });
});

const deleteSurvey = catchAsync(async (req, res) => {
    const result = await SurveyService.deleteSurveyIntoDB(req.params.id, req.user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Survey deleted successfully',
        data: result,
    });
});
export const SurveyController = {
    createSurvey,
    updateSurvey,
    publishSurvey,
    closeSurvey,
    getAllSurveysForAdmin,
    getSingleSurveyForAdmin,
    deleteSurvey,
    getPublishedSurveysForUser,
    getSingleSurveyForUser,
};
