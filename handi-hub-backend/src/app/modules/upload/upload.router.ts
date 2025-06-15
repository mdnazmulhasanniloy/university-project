import { Request, Response, Router } from "express";
import multer, { memoryStorage } from "multer";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../error/AppError";
import { UploadedFiles } from "../../interface/common.interface";
import httpStatus from "http-status";
import { uploadManyToS3 } from "../../utils/s3";
import sendResponse from "../../utils/sendResponse";

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  upload.fields([{ name: 'images', maxCount: 5 }]),
  catchAsync(async (req: Request, res: Response) => {
    let imagUrl;
    if (!req.files) {
      throw new AppError(httpStatus.BAD_REQUEST, 'image is required');
    }
    const { images } = req.files as UploadedFiles;
    if (images) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `message/images`,
        });
      });

      imagUrl = await uploadManyToS3(imgsArray);
    }
    console.log(imagUrl);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Image uploaded successfully',
      data: imagUrl,
    });
  }),
);

export const uploadRouter = router;