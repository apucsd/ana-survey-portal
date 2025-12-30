import { z } from 'zod';
import { userRole, userStatus } from '../../constant';

const updateUser = z.object({
    body: z
        .object({
            name: z.string().optional(),
            phone: z.string().optional(),
            bio: z.string().optional(),
            location: z.string().optional(),
            profile: z.string().optional(),
            nationality: z.string().optional(),
            dateOfBirth: z.string().optional(),
        })
        .strict(),
});

const updateUserRoleSchema = z.object({
    body: z.object({
        role: z.enum(userRole),
    }),
});
const updateUserStatus = z.object({
    body: z.object({
        status: z.enum(userStatus),
    }),
});

const assignVehicleToUser = z.object({
    body: z.object({
        userId: z.string({
            required_error: 'User ID is required',
        }),
        vehicleId: z.string({
            required_error: 'Vehicle ID is required',
        }),
    }),
});
export const userValidation = { updateUser, updateUserRoleSchema, updateUserStatus, assignVehicleToUser };
