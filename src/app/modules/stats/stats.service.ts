// import QueryBuilder from '../../builder/QueryBuilder';
// import { monthNames } from '../../constant';
// import { prisma } from '../../utils/prisma';

// const getStatsFromDB = async () => {
//     const totalOrder = await prisma.order.count({
//         where: {
//             status: 'COMPLETED',
//         },
//     });
//     const totalFuel = await prisma.fuel.count({
//         where: {
//             status: 'ACTIVE',
//         },
//     });
//     const totalFuelType = await prisma.fuelType.count({
//         where: {
//             status: 'ACTIVE',
//         },
//     });
//     const totalTransaction = await prisma.payment.count();

//     const totalRevenue = await prisma.payment.aggregate({
//         _sum: {
//             amount: true,
//         },
//     });
//     const totalDriver = await prisma.user.count({
//         where: {
//             role: 'DRIVER',
//             status: 'ACTIVE',
//         },
//     });
//     const totalUser = await prisma.user.count({
//         where: {
//             role: 'USER',
//             status: 'ACTIVE',
//         },
//     });

//     return {
//         totalOrder,
//         totalFuel,
//         totalFuelType,
//         totalRevenue: totalRevenue._sum.amount,
//         totalDriver,
//         totalUser,
//         totalTransaction,
//     };
// };

// const getMonthlyRevenue = async (year: number = 2025): Promise<{ [key: string]: number }> => {
//     const startDate = new Date(Number(year), 0, 1);
//     const endDate = new Date(Number(year), 11, 31, 23, 59, 59, 999);

//     const payments = await prisma.payment.findMany({
//         where: {
//             createdAt: {
//                 gte: startDate,
//                 lte: endDate,
//             },
//         },
//         select: {
//             amount: true,
//             createdAt: true,
//         },
//     });

//     const revenueByMonth: { [key: string]: number } = {
//         jan: 0,
//         feb: 0,
//         mar: 0,
//         apr: 0,
//         may: 0,
//         jun: 0,
//         jul: 0,
//         aug: 0,
//         sep: 0,
//         oct: 0,
//         nov: 0,
//         dec: 0,
//     };

//     payments.forEach((payment) => {
//         const monthIndex = payment.createdAt.getMonth();
//         const monthKey = monthNames[monthIndex];
//         revenueByMonth[monthKey] += payment.amount;
//     });

//     return revenueByMonth;
// };

// const getAllPaymentFromDB = async (query: Record<string, any>) => {
//     const paymentQuery = await new QueryBuilder(prisma.payment, query)
//         .search(['user.name', 'user.email'])
//         .sort()
//         .fields()
//         .filter()
//         .paginate()
//         .customFields({
//             id: true,
//             user: {
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     profile: true,
//                 },
//             },
//             paymentStatus: true,
//             amount: true,
//             createdAt: true,
//             method: true,
//             transactionId: true,
//             order: {
//                 select: {
//                     fuel: {
//                         select: {
//                             name: true,
//                             pricePerUnit: true,
//                         },
//                     },
//                     quantity: true,
//                     totalPrice: true,
//                 },
//             },
//         })
//         .execute();

//     return paymentQuery;
// };

// export const StatsService = {
//     getStatsFromDB,
//     getMonthlyRevenue,
//     getAllPaymentFromDB,
// };
