import httpStatus from 'http-status';
import { IContract } from './contract.interface';
import Contract from './contract.models';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import ServicesPost from '../servicesPost/servicesPost.models';
import { IServicesPost } from '../servicesPost/servicesPost.interface';
import { notificationControllers } from '../notification/notification.controller';
import { modeType } from '../notification/notification.interface';
import { notificationServices } from '../notification/notification.service';
import { IUser } from '../user/user.interface';
import { CONTRACT_STATUS } from './contract.constants';
import { User } from '../user/user.models';
import {
  calculateAverageResponseTime,
  sendNotification,
} from './contract.utils';
import { startSession } from 'mongoose';
import { createTransfer } from '../stripe/stripe.service'; 

// const createContract = async (payload: IContract) => {
//   const isServicePostHave: IServicesPost | null = await ServicesPost.findById(
//     payload?.servicesPost,
//   );
//   if (!isServicePostHave) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Service Post not found!');
//   }

//   payload['serviceProvider'] = isServicePostHave?.serviceProvider;

//   const result = await (await Contract.create(payload)).populate('user');

//   await User.findByIdAndUpdate(result?.serviceProvider, {
//     lastQuote: result?.createdAt,
//     $inc: {
//       totalRequests: 1,
//     },
//   });
//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create contract');
//   }

//   notificationServices.insertNotificationIntoDb({
//     receiver: result?.serviceProvider,
//     message: 'New Service Request Received',
//     description: `User ${(result?.user as IUser)?.name || 'A user'} has requested your service "${isServicePostHave?.title || 'service'}". Please review and respond.`,
//     refference: result?._id,
//     model_type: modeType.Contract,
//   });
//   return result;
// };
const createContract = async (payload: IContract) => {
  const session = await ServicesPost.startSession(); // Start a session
  session.startTransaction(); // Begin transaction

  try {
    const isServicePostHave: IServicesPost | null = await ServicesPost.findById(
      payload?.servicesPost,
    ).session(session); // Include session in the query

    if (!isServicePostHave) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Service Post not found!');
    }

    payload['serviceProvider'] = isServicePostHave?.serviceProvider;

    const contract = await Contract.create([payload], { session }); // Create document in a transaction
    const result = await Contract.findById(contract[0]._id)
      .populate('user') // Populate user field
      .session(session); // Use the session for consistency

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create contract');
    }

    await User.findByIdAndUpdate(
      result?.serviceProvider,
      {
        lastQuote: result?.createdAt,
        $inc: {
          totalRequests: 1,
        },
      },
      { session }, // Include session in the query
    );

    notificationServices.insertNotificationIntoDb({
      receiver: result?.serviceProvider,
      message: 'New Service Request Received',
      description: `User ${(result?.user as IUser)?.name || 'A user'} has requested your service "${isServicePostHave?.title || 'service'}". Please review and respond.`,
      refference: result?._id,
      model_type: modeType.Contract,
    });

    await session.commitTransaction(); // Commit the transaction
    session.endSession(); // End the session
    return result;
  } catch (error) {
    await session.abortTransaction(); // Rollback the transaction on error
    session.endSession(); // End the session
    throw error; // Rethrow the error to be handled by the caller
  }
};


const getAllContract = async (query: Record<string, any>) => {
  const contractModel = new QueryBuilder(
    Contract.find({ isDeleted: false }).populate([
      { path: 'servicesPost' },
      { path: 'user', select: '-password' },
      { path: 'serviceProvider', select: '-password' },
    ]),
    query,
  )
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await contractModel.modelQuery;
  const meta = await contractModel.countTotal();

  return {
    data,
    meta,
  };
};

const getContractById = async (id: string) => {
  const result = await Contract.findById(id).populate([
    { path: 'servicesPost', populate: [{ path: 'category' }] },
    { path: 'user', select: '-password' },
    { path: 'serviceProvider', select: '-password' },
  ]);
  if (!result || result.isDeleted) {
    throw new Error('Contract not found!');
  }
  return result;
};

// const updateContract = async (id: string, payload: Partial<IContract>) => {
//   const responseTime = new Date();

//   if (payload.status === CONTRACT_STATUS.approved || CONTRACT_STATUS.declined) {
//     payload.responseTime = responseTime;
//   }

//   const result: IContract | null = await Contract.findByIdAndUpdate(
//     id,
//     payload,
//     {
//       new: true,
//     },
//   ).populate([
//     { path: 'user', select: 'name email phoneNumber profile' },
//     {
//       path: 'serviceProvider',
//       select:
//         'name email phoneNumber profile totalRequests totalResponses averageResponseTime',
//     },
//     { path: 'servicesPost' },
//   ]);
//   if (!result) {
//     throw new Error('Failed to update Contract');
//   }

//   switch (payload.status) {
//     case CONTRACT_STATUS.approved: {
//       const serviceProvider = result?.serviceProvider as IUser;

//       const timeTaken =
//         (responseTime.getTime() - result?.responseTime!?.getTime()) / 1000;

//       const newAverageResponseTime =
//         (serviceProvider?.averageResponseTime * serviceProvider?.totalRequests +
//           timeTaken) /
//         (serviceProvider.totalResponses + 1);
//       await User.findByIdAndUpdate((result?.serviceProvider as IUser)?._id, {
//         $inc: {
//           totalResponses: 1,
//         },
//         averageResponseTime: newAverageResponseTime,
//       });
//       notificationServices.insertNotificationIntoDb({
//         receiver: (result?.user as IUser)?._id,
//         message: 'Service Request Approved And Send A Quote',
//         description: `Your service request for ${(result?.servicesPost as IServicesPost)?.title} has been approved. The service provider has sent a quote of $${result?.quote || '0'}. Please review and proceed.`,
//         refference: result?._id,
//         model_type: modeType.Contract,
//       });

//       break;
//     }
//     case CONTRACT_STATUS.declined: {
//       const serviceProvider = result?.serviceProvider as IUser;

//       const timeTaken =
//         (responseTime.getTime() - result?.responseTime!?.getTime()) / 1000;

//       const newAverageResponseTime =
//         (serviceProvider?.averageResponseTime * serviceProvider?.totalRequests +
//           timeTaken) /
//         (serviceProvider.totalResponses + 1);

//       await User.findByIdAndUpdate((result?.serviceProvider as IUser)?._id, {
//         $inc: {
//           totalResponses: 1,
//         },
//         averageResponseTime: newAverageResponseTime,
//       });

//       notificationServices.insertNotificationIntoDb({
//         receiver: (result?.user as IUser)?._id,
//         message: 'Service Request Declined',
//         description: `Your service request for ${(result?.servicesPost as IServicesPost)?.title} has been declined. Please review and reconsider your request.`,
//         refference: result?._id,
//         model_type: modeType.Contract,
//       });
//       break;
//     }
//     case CONTRACT_STATUS.accepted: {
//       await User.findByIdAndUpdate((result?.serviceProvider as IUser)?._id, {
//         $inc: {
//           pendingWork: 1,
//         },
//       });

//       notificationServices.insertNotificationIntoDb({
//         receiver: (result?.serviceProvider as IUser)?._id,
//         message: 'Service Request Accepted',
//         description: `Your service request for ${(result?.servicesPost as IServicesPost)?.title} has been accepted. You can now proceed with the service provider and start working on the project.`,
//         refference: result?._id,
//         model_type: modeType.Contract,
//       });
//       break;
//     }
//     case CONTRACT_STATUS.completed: {
//       await User.findByIdAndUpdate((result?.serviceProvider as IUser)?._id, {
//         $inc: { finishedWork: 1, pendingWork: -1 },
//       });
//       notificationServices.insertNotificationIntoDb({
//         receiver: (result?.user as IUser)?._id,
//         message: 'Service Request Completed',
//         description: `Your service request for ${(result?.servicesPost as IServicesPost)?.title} has been completed. You can now review and provide feedback to the service provider.`,
//         refference: result?._id,
//         model_type: modeType.Contract,
//       });

//       notificationServices.insertNotificationIntoDb({
//         receiver: (result?.serviceProvider as IUser)?._id,
//         message: 'Service Request Completed',
//         description: `You have successfully completed the service request for ${(result?.servicesPost as IServicesPost)?.title}. Thank you for providing excellent service!`,
//         refference: result?._id,
//         model_type: modeType.Contract,
//       });
//       break;
//     }
//   }
//   return result;
// };

const updateContract = async (id: string, payload: Partial<IContract>) => {


  // Update the contract and populate necessary fields
  const result: IContract | null = await Contract.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
    },
  ).populate([
    { path: 'user', select: 'name email phoneNumber profile' },
    {
      path: 'serviceProvider',
      select:
        'name email phoneNumber profile totalRequests totalResponses averageResponseTime',
    },
    { path: 'servicesPost' },
  ]);

  if (!result) {
    throw new AppError(
      httpStatus?.BAD_REQUEST,
      'Failed to update contract',
    );
  }

  

  return result;
};

const deleteContract = async (id: string) => {
  const result = await Contract.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete contract');
  }
  return result;
};

const approvedContract = async (id: string, payload: Partial<IContract>) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const responseTime = new Date();
    payload.responseTime = responseTime;

    const result = await Contract.findByIdAndUpdate(
      id,
      {
        status: CONTRACT_STATUS.approved,
        responseTime,
        quote: payload?.quote,
      },
      {
        new: true,
        session,
      },
    ).populate([
      { path: 'user', select: 'name email phoneNumber profile' },
      {
        path: 'serviceProvider',
        select:
          'name email phoneNumber profile totalRequests totalResponses averageResponseTime',
      },
      { path: 'servicesPost' },
    ]);

    if (!result) {
      throw new AppError(
        httpStatus?.BAD_REQUEST,
        'Failed to approved contract',
      );
    }

    const serviceProvider = result?.serviceProvider as IUser;
    const userId: string = (result?.user as IUser)?._id?.toString() as string;
    const serviceProviderId = serviceProvider?._id?.toString() as string;

    const timeTaken =
      (responseTime.getTime() - result?.responseTime!.getTime()) / 1000;
    const newAverageResponseTime = calculateAverageResponseTime(
      timeTaken,
      serviceProvider,
    );

    await User.findByIdAndUpdate(
      serviceProviderId,
      {
        $inc: { totalResponses: 1 },
        averageResponseTime: newAverageResponseTime,
      },
      { session },
    );

    const message = 'Service Request Approved And Sent A Quote';

    const description = `Your service request for ${(result?.servicesPost as IServicesPost)?.title} has been approved. The service provider has sent a quote of $${result?.quote || '0'}. Please review and proceed.`;

    sendNotification(
      userId,
      message,
      description,
      result?._id?.toString() as string,
    );

    await session.commitTransaction();
    return result;
  } catch (error:any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};


const declinedContract = async (id: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const responseTime = new Date(); 

    const result = await Contract.findByIdAndUpdate(
      id,
      {
        status: CONTRACT_STATUS.declined,
        responseTime, 
      },
      {
        new: true,
        session,
      },
    ).populate([
      { path: 'user', select: 'name email phoneNumber profile' },
      {
        path: 'serviceProvider',
        select:
          'name email phoneNumber profile totalRequests totalResponses averageResponseTime',
      },
      { path: 'servicesPost' },
    ]);

    if (!result) {
      throw new AppError(
        httpStatus?.BAD_REQUEST,
        'Failed to declined contract',
      );
    }

    const serviceProvider = result?.serviceProvider as IUser;
    const userId: string = (result?.user as IUser)?._id?.toString() as string;
    const serviceProviderId = serviceProvider?._id?.toString() as string;

    const timeTaken =
      (responseTime.getTime() - result?.responseTime!.getTime()) / 1000;
    const newAverageResponseTime = calculateAverageResponseTime(
      timeTaken,
      serviceProvider,
    );

    await User.findByIdAndUpdate(
      serviceProviderId,
      {
        $inc: { totalResponses: 1 },
        averageResponseTime: newAverageResponseTime,
      },
      { session },
    );

    const message = 'Service Request Declined';

    const description = `Your service request for ${(result?.servicesPost as IServicesPost)?.title} has been declined. Please review and reconsider your request.`;

    sendNotification(
      userId,
      message,
      description,
      result?._id?.toString() as string,
    );

    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};

const completedContract = async (id: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const contract:IContract|null = await Contract.findById(id).populate('serviceProvider');
    if (!contract) {
      throw new AppError(httpStatus.NOT_FOUND, 'Contract not found');
    }

    if ((contract?.user as IUser)?.stripeAccountId) {
      try {
        await createTransfer(
          contract?.quote,
          (contract?.user as IUser)?.stripeAccountId,
        );
      } catch (transferError:any) {
        throw new AppError(
          httpStatus.BAD_GATEWAY,
          `Transfer failed: ${transferError.message}`,
        );
      }
    }

    const result = await Contract.findByIdAndUpdate(
      contract?._id,
      {
        status: CONTRACT_STATUS.completed,
      },
      { new: true, session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update contract status',
      );
    }
 
    // Notifications
    sendNotification(
      contract?.user?.toString(),
      'Contract Completed',
      `Your contract for ${(contract?.servicesPost as IServicesPost)?.title} has been successfully completed. Thank you for using our platform.`,
      contract?._id as string,
    );

    sendNotification(
      //@ts-ignore
      contract?.serviceProvider._id as string,
      'Contract Completed',
      `The contract for ${(contract?.servicesPost as IServicesPost)?.title} has been marked as completed. Great job!`,
      contract?._id as string,
    );

    await session.commitTransaction();
    return result;
  } catch (error:any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};


// const completedContract = async (id:string) => {
//   const contract = await Contract.findById(id).populate('serviceProvider');
//   if (!contract) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Contract not found');
//   }

//   if((contract?.user as IUser)?.stripeAccountId){
//     await createTransfer(contract?.quote, (contract?.user as IUser)?.stripeAccountId)
//   }
//   const result = await Contract.findByIdAndUpdate(contract?._id,{
//     status: CONTRACT_STATUS.completed

//   }, {new: true})
// return result
// }


export const contractService = {
  createContract,
  getAllContract,
  getContractById,
  updateContract,
  deleteContract,
  approvedContract,
  declinedContract,
  completedContract
};
