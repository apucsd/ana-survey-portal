import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRoleEnum } from '@prisma/client';
import { QuestionController } from './question.controller';
import validateRequest from '../../middlewares/validateRequest';
import { QuestionValidation } from './question.validation';

const router = Router();

router.post(
    '/',
    auth(UserRoleEnum.SUPERADMIN),
    validateRequest.body(QuestionValidation.createQuestionZodSchema),
    QuestionController.createQuestion
);

export const QuestionRouters = router;
