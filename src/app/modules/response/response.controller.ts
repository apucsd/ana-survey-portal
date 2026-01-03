import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ResponseService } from './response.service';

const createResponse = catchAsync(async (req, res) => {
    const userId = req.user?.id;

    const result = await ResponseService.createResponseIntoDB({
        ...req.body,
        userId,
    });

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Response submitted successfully',
        data: result,
    });
});

export const ResponseController = {
    createResponse,
};
