import { User, UserRoleEnum, UserStatus } from '@prisma/client';
import QueryBuilder from '../../builder/QueryBuilder';
import { prisma } from '../../utils/prisma';

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
            phone: true,
        })

        .paginate()
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
            phone: true,
            nationality: true,
            dateOfBirth: true,
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
    updateFcmTokenIntoDB,
};
