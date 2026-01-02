import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { QuestionService } from './question.service';
import httpStatus from 'http-status';

const createQuestion = catchAsync(async (req, res) => {
    const result = await QuestionService.createQuestionIntoDB(req.body, req.user.id);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Question created successfully',
        data: result,
    });
});

const updateQuestion = catchAsync(async (req, res) => {
    const result = await QuestionService.updateQuestionIntoDB(req.user.id, req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Question updated successfully',
        data: result,
    });
});

const deleteQuestion = catchAsync(async (req, res) => {
    const result = await QuestionService.deleteQuestionIntoDB(req.user.id, req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Question deleted successfully',
        data: result,
    });
});

export const QuestionController = {
    createQuestion,
    updateQuestion,
    deleteQuestion,
};
