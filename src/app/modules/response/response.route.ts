import express from 'express';
import { ResponseController } from './response.controller';
import auth from '../../middlewares/auth';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post('/', auth(UserRoleEnum.USER), ResponseController.createResponse);

export const ResponseRouters = router;
