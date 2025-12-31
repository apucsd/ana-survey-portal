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

export const QuestionController = {
    createQuestion,
};
