// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import { StatsService } from './stats.service';
// import httpStatus from 'http-status';

// const getStats = catchAsync(async (req, res) => {
//     const stats = await StatsService.getStatsFromDB();

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Stats fetched successfully',
//         data: stats,
//     });
// });

// const getMonthlyRevenue = catchAsync(async (req, res) => {
//     const year = req.query.year ? Number(req.query.year) : undefined;
//     const stats = await StatsService.getMonthlyRevenue(year);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Stats fetched successfully',
//         data: stats,
//     });
// });

// const getAllPayment = catchAsync(async (req, res) => {
//     const payments = await StatsService.getAllPaymentFromDB(req.query);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Payments fetched successfully',
//         data: payments,
//     });
// });

// export const StatsController = {
//     getStats,
//     getMonthlyRevenue,
//     getAllPayment,
// };
