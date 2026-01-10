import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRoleEnum } from '@prisma/client';
import { QuestionController } from './question.controller';
import validateRequest from '../../middlewares/validateRequest';
import { QuestionValidation } from './question.validation';

const router = Router();

router.post('/', auth(UserRoleEnum.SUPERADMIN), QuestionController.createQuestion);

router.patch('/:id', auth(UserRoleEnum.SUPERADMIN), QuestionController.updateQuestion);

router.delete('/:id', auth(UserRoleEnum.SUPERADMIN), QuestionController.deleteQuestion);

export const QuestionRouters = router;
