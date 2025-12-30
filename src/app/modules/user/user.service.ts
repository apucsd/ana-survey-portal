import httpStatus from 'http-status';
import { User, UserRoleEnum, UserStatus } from '@prisma/client';
import QueryBuilder from '../../builder/QueryBuilder';
import { prisma } from '../../utils/prisma';
import AppError from '../../errors/AppError';
import { uploadToDigitalOceanAWS } from '../../utils/uploadToDigitalOceanAWS';

const updateFcmTokenIntoDB = async (id: string, fcmToken: string) => {
    const result = await prisma.user.update({
        where: { id },
        data: { fcmToken },
    });
    return result;
};

const getAllUsersFromDB = async (query: any) => {
    const usersQuery = new QueryBuilder<typeof prisma.user>(prisma.user, query);

    const result = await usersQuery
        .search(['name', 'email'])
        .filter()
        .sort()
        .fields()
        .customFields({
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            profile: true,
            phoneNumber: true,
            driverWorkStatus: true,
            locations: {
                select: {
                    location: true,
                },
            },
        })

        .paginate()
        .execute();

    //  FORMAT RESPONSE HERE
    const formattedData = result.data.map((user: any) => {
        const firstLocation = user.locations?.[0]?.location;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            profile: user.profile,
            phoneNumber: user.phoneNumber,
            driverWorkStatus: user.driverWorkStatus,
            location: firstLocation
                ? {
                      latitude: firstLocation.coordinates[1],
                      longitude: firstLocation.coordinates[0],
                  }
                : null,
        };
    });

    return {
        ...result,
        data: formattedData,
    };
};

const getDriverUsersFromDB = async (query: any) => {
    const result = await new QueryBuilder<typeof prisma.user>(prisma.user, {
        ...query,
        role: UserRoleEnum.DRIVER,
        status: UserStatus.ACTIVE,
    })
        .search(['name', 'email'])
        .filter()

        .sort()
        .fields()
        .exclude()
        .paginate()
        .customFields({
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            profile: true,
        })
        .execute();

    return result;
};

const getMyProfileFromDB = async (id: string) => {
    const Profile = await prisma.user.findUniqueOrThrow({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            profile: true,
            phoneNumber: true,
        },
    });

    return Profile;
};

const getUserDetailsFromDB = async (id: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile: true,
        },
    });

    return user;
};

const updateProfileImg = async (id: string, file: Express.Multer.File | undefined) => {
    if (!file || file.fieldname !== 'image') {
        throw new AppError(httpStatus.NOT_FOUND, 'Please provide image');
    }

    const { Location } = await uploadToDigitalOceanAWS(file);
    const result = await prisma.user.update({
        where: {
            id,
        },
        data: {
            profile: Location,
        },
    });
    return result;
};

const updateMyProfileIntoDB = async (
    id: string,

    payload: Partial<User>
) => {
    delete payload.email;

    const result = await prisma.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
};

const assignVehicleToUser = async (userId: string, vehicleId: string) => {
    return await prisma.$transaction(async (tx) => {
        const vehicle = await tx.vehicle.findUnique({
            where: { id: vehicleId },
        });

        if (!vehicle || vehicle.status !== 'ACTIVE') {
            throw new AppError(httpStatus.NOT_FOUND, 'Vehicle not found or inactive');
        }

        const user = await tx.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');
        if (user.role !== UserRoleEnum.DRIVER) {
            throw new AppError(httpStatus.BAD_REQUEST, 'User is not a driver');
        }

        // remove vehicle from other drivers
        await tx.user.updateMany({
            where: { vehicleId },
            data: { vehicleId: null },
        });

        //  remove vehicle from user
        await tx.user.updateMany({
            where: { id: userId },
            data: { vehicleId: null },
        });

        // assign vehicle to user
        const updatedDriver = await tx.user.update({
            where: { id: userId },
            data: { vehicleId },
            include: { vehicle: true },
        });

        return updatedDriver;
    });
};

const updateUserRoleStatusIntoDB = async (id: string, role: UserRoleEnum) => {
    const result = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            role: role,
        },
    });
    return result;
};
const updateProfileStatus = async (id: string, status: UserStatus) => {
    const result = await prisma.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
        select: {
            id: true,
            status: true,
            role: true,
        },
    });
    return result;
};

export const UserServices = {
    getAllUsersFromDB,
    getMyProfileFromDB,
    getUserDetailsFromDB,
    updateMyProfileIntoDB,
    updateUserRoleStatusIntoDB,
    updateProfileStatus,
    updateProfileImg,
    getDriverUsersFromDB,
    assignVehicleToUser,
    updateFcmTokenIntoDB,
};
