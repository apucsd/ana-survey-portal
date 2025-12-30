import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from './catchAsync';
import sendResponse from './sendResponse';
import Stripe from 'stripe';
import config from '../../config';
import { prisma } from './prisma';
import { stripe } from './stripe';

export const StripeWebHook = catchAsync(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
        throw new AppError(httpStatus.NOT_FOUND, 'Missing Stripe signature');
    }

    const result = await StripeHook(req.body, sig);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Webhook processed successfully',
        data: result,
    });
});

const StripeHook = async (rawBody: Buffer, signature: string | string[] | undefined) => {
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature as string, config.stripe.stripe_webhook as string);
    } catch (err) {
        throw new AppError(httpStatus.BAD_REQUEST, `Webhook signature verification failed: ${(err as Error).message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionCompleted(session);
        }
        case 'checkout.session.expired': {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionExpired(session);
        }

        default:
            return { status: 'unhandled_event', type: event.type };
    }
};

const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;
    if (!orderId || !userId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Missing required metadata: orderId and userId are required');
    }

    const payment = await prisma.payment.create({
        data: {
            orderId: orderId,
            userId: userId,
            amount: (session.amount_total ?? 0) / 100,
            paymentStatus: 'PAID',
            method: 'ONLINE',
            transactionId: session.id,
            tipAmount: Number(session.metadata?.tipAmount || 0),
        },
    });

    const order = await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            paymentStatus: 'PAID',
        },
    });
    return { payment, order };
};

const handleCheckoutSessionExpired = async (session: Stripe.Checkout.Session) => {
    const orderId = session.metadata?.orderId;

    if (orderId) {
        await prisma.order
            .delete({
                where: { id: orderId },
            })
            .catch(() => {});

        return { deletedOrderId: orderId };
    }
    return null;
};
