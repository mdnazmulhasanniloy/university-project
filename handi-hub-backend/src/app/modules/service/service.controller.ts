import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { uploadToS3 } from '../../utils/s3';
import sendResponse from '../../utils/sendResponse';
import { servicesService } from './service.service';

const createService = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.banner = await uploadToS3({
      file: req.file,
      fileName: `images/service/banner/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }

  const result = await servicesService.createService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'service created successfully',
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await servicesService.getAllServices(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All services fetched successfully',
    data: result,
  });
});

const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const result = await servicesService.getServiceById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'service fetched successfully',
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    req.body.banner = await uploadToS3({
      file: req.file,
      fileName: `images/service/banner/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }
  const result = await servicesService.updateService(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'service updated successfully',
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const result = await servicesService.deleteService(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'service deleted successfully',
    data: result,
  });
});

export const servicesController = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
