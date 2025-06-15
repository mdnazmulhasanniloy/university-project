import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { contractService } from './contract.service';
import sendResponse from '../../utils/sendResponse'; 
import { uploadManyToS3 } from '../../utils/s3';
import { UploadedFiles } from '../../interface/common.interface';

const createContract = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req?.user?.userId;
  if (req.files) {
    const { images } = req.files as UploadedFiles;
    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/contract`,
        });
      });

      req.body.images = await uploadManyToS3(imgsArray);
    }
  }
  const result = await contractService.createContract(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Contract created successfully',
    data: result,
  });
});

const getAllContract = catchAsync(async (req: Request, res: Response) => {
  const result = await contractService.getAllContract(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All contract fetched successfully',
    data: result,
  });
});
const getMyContracts = catchAsync(async (req: Request, res: Response) => {
  req.query['user'] = req.user.userId;
  const result = await contractService.getAllContract(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My contract fetched successfully',
    data: result,
  });
});
const getByServiceProviderContracts = catchAsync(
  async (req: Request, res: Response) => {
    req.query['serviceProvider'] = req.user.userId;
    const result = await contractService.getAllContract(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'My contract fetched successfully',
      data: result,
    });
  },
);

const getContractById = catchAsync(async (req: Request, res: Response) => {
  const result = await contractService.getContractById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contract fetched successfully',
    data: result,
  });
});

const updateContract = catchAsync(async (req: Request, res: Response) => {
  if (req.files) {
    const { images } = req.files as UploadedFiles;
    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/contract`,
        });
      });

      req.body.images = await uploadManyToS3(imgsArray);
    }
  }
  const result = await contractService.updateContract(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contract updated successfully',
    data: result,
  });
});

const deleteContract = catchAsync(async (req: Request, res: Response) => {
  const result = await contractService.deleteContract(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contract deleted successfully',
    data: result,
  });
});
const approvedContract = catchAsync(async (req: Request, res: Response) => {
  const result = await contractService.approvedContract(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'contract approved successfully',
    data: result,
  });
});
const declinedContract = catchAsync(async (req: Request, res: Response) => {
  const result = await contractService.declinedContract(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contract declined successfully',
    data: result,
  });
});
const completedContract = catchAsync(async (req: Request, res: Response) => {
  const result = await contractService.completedContract(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contract completed successfully',
    data: result,
  });
});

export const contractController = {
  createContract,
  getAllContract,
  getContractById,
  updateContract,
  deleteContract,
  approvedContract,
  declinedContract,
  completedContract,
  getMyContracts,
  getByServiceProviderContracts,
};
