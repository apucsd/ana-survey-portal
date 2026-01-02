import { Router } from 'express';
import { SurveyController } from './survey.controller';
import auth from '../../middlewares/auth';
import { UserRoleEnum } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { SurveyValidation } from './survey.validation';

const router = Router();

router.post(
    '/',
    auth(UserRoleEnum.SUPERADMIN),
    validateRequest.body(SurveyValidation.createSurveyZodSchema),
    SurveyController.createSurvey
);
router.get('/', auth(UserRoleEnum.USER), SurveyController.getPublishedSurveysForUser);

router.get('/admin', auth(UserRoleEnum.SUPERADMIN), SurveyController.getAllSurveysForAdmin);
router.get('/:id', auth(UserRoleEnum.USER), SurveyController.getSingleSurveyForUser);
router.get('/admin/:id', auth(UserRoleEnum.SUPERADMIN), SurveyController.getSingleSurveyForAdmin);
router.patch(
    '/admin/:id',
    auth(UserRoleEnum.SUPERADMIN),
    validateRequest.body(SurveyValidation.updateSurveyZodSchema),
    SurveyController.updateSurvey
);
router.delete('/admin/:id', auth(UserRoleEnum.SUPERADMIN), SurveyController.deleteSurvey);
router.patch('/admin/publish/:id', auth(UserRoleEnum.SUPERADMIN), SurveyController.publishSurvey);
router.patch('/admin/close/:id', auth(UserRoleEnum.SUPERADMIN), SurveyController.closeSurvey);

router.delete('/admin/delete/:id', auth(UserRoleEnum.SUPERADMIN), SurveyController.deleteSurvey);

export const surveyRouters = router;
