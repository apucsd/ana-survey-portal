import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { Request } from 'express';

const updateFcmToken = catchAsync(async (req, res) => {
    const { fcmToken } = req.body;

    await UserServices.updateFcmTokenIntoDB(req.user.id, fcmToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'FCM token updated successfully',
        data: null,
    });
});
const getAllUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUsersFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Users retrieved successfully',
        data: result,
    });
});

const getDriverUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getDriverUsersFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Driver users retrieved successfully',
        ...result,
    });
});

const getMyProfile = catchAsync(async (req, res) => {
    const id = req.user.id;
    const result = await UserServices.getMyProfileFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Profile retrieved successfully',
        data: result,
    });
});

const getUserDetails = catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id, 'id');
    const result = await UserServices.getUserDetailsFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User details retrieved successfully',
        data: result,
    });
});

// Update profile fields
const updateMyProfile = catchAsync(async (req: Request, res) => {
    const id = req.user.id;
    const payload = req.body;

    const result = await UserServices.updateMyProfileIntoDB(id, payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User profile updated successfully',
        data: result,
    });
});

// Update profile image
const updateProfileImage = catchAsync(async (req: Request, res) => {
    const id = req.user.id;
    const file = req.file;

    const result = await UserServices.updateProfileImg(id, file as Express.Multer.File);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Profile image updated successfully',
        data: result,
    });
});

const updateUserRoleStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const role = req.body.role;
    const result = await UserServices.updateUserRoleStatusIntoDB(id, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User role updated successfully',
        data: result,
    });
});

const updateUserStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const status = req.body.status;
    const result = await UserServices.updateProfileStatus(id, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User status updated successfully',
        data: result,
    });
});

const assignVehicleToUser = catchAsync(async (req, res) => {
    const { userId, vehicleId } = req.body;
    const result = await UserServices.assignVehicleToUser(userId, vehicleId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Vehicle assigned to user successfully',
        data: result,
    });
});

export const UserControllers = {
    getAllUsers,
    getMyProfile,
    getUserDetails,
    updateMyProfile,
    updateProfileImage,
    updateUserRoleStatus,
    updateUserStatus,
    getDriverUsers,
    assignVehicleToUser,
    updateFcmToken,
};
