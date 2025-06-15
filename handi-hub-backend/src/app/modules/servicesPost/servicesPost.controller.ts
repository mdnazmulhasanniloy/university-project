
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';  
import { servicesPostService } from './servicesPost.service';
import sendResponse from '../../utils/sendResponse'; 
import { uploadToS3 } from '../../utils/s3';
import pick from '../../utils/pick';
import { paginationFields } from '../../constants/pagination';
import { Types } from 'mongoose';

const createServicesPost = catchAsync(async (req: Request, res: Response) => {
if(req?.file){
  req.body.banner = await uploadToS3({
    file: req.file,
    fileName: `images/servicesPost/banner/${Math.floor(100000 + Math.random() * 900000)}`,
  });
}
req.body.serviceProvider=req.user.userId;
 const result = await servicesPostService.createServicesPost(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'ServicesPost created successfully',
    data: result,
  });

});

const getAllServicesPost = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = Object.fromEntries(
    Object.entries(req.query).filter(
      ([key, value]) =>
        !paginationFields.includes(key) && value != null && value !== '',
    ),
  );

 const result = await servicesPostService.getAllServicesPost(filters, paginationOptions);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All servicesPost fetched successfully',
    data: result,
  });

});


const getMyPost = catchAsync(async (req: Request, res: Response) => {
  //@ts-ignore
  req.query.serviceProvider = new Types.ObjectId(req?.user?.userId);
  const paginationOptions = pick(req.query, paginationFields);
  const filters = Object.fromEntries(
    Object.entries(req.query).filter(
      ([key, value]) =>
        !paginationFields.includes(key) && value != null && value !== '',
    ),
  );

  const result = await servicesPostService.getAllServicesPost(
    filters,
    paginationOptions,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All servicesPost fetched successfully',
    data: result,
  });
});

const getServicesPostById = catchAsync(async (req: Request, res: Response) => {
 const result = await servicesPostService.getServicesPostById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ServicesPost fetched successfully',
    data: result,
  });

});


const updateServicesPost = catchAsync(async (req: Request, res: Response) => { 
  if (req?.file) {
    req.body.banner = await uploadToS3({
      file: req.file,
      fileName: `images/servicesPost/banner/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }


const result = await servicesPostService.updateServicesPost(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ServicesPost updated successfully',
    data: result,
  });

});


const deleteServicesPost = catchAsync(async (req: Request, res: Response) => {
 const result = await servicesPostService.deleteServicesPost(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ServicesPost deleted successfully',
    data: result,
  });

});

export const servicesPostController = {
  createServicesPost,
  getAllServicesPost,
  getServicesPostById,
  updateServicesPost,
  deleteServicesPost,
  getMyPost,
};