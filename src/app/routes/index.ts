import express from 'express';
import { MessageRouters } from '../modules/messages/message.route';
import { AuthRouters } from '../modules/auth/auth.routes';
import { UserRouters } from '../modules/user/user.routes';
import { FaqRouters } from '../modules/faq/faq.route';
import { InfoContentRouters } from '../modules/info-content/info-content.route';
import { surveyRouters } from '../modules/survey/survey.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRouters,
    },
    {
        path: '/users',
        route: UserRouters,
    },

    {
        path: '/surveys',
        route: surveyRouters,
    },
    {
        path: '/messages',
        route: MessageRouters,
    },

    {
        path: '/faqs',
        route: FaqRouters,
    },
    {
        path: '/info-contents',
        route: InfoContentRouters,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
