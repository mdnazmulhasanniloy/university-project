import { Router } from 'express';
import { reviewController } from './review.controller';
import validateRequest from '../../middleware/validateRequest';
import { ReviewValidation } from './review.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

// images;
router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(ReviewValidation.createReviewZodSchema),
  reviewController.createReview,
);
// router.get('/all', reviewController.getAllReview);
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  reviewController.updateReview,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  reviewController.deleteReview,
);

router.get('/review-flow/:id', reviewController.reviewFlow);
router.get('/:id', reviewController.getReviewById);
router.get('/', reviewController.getAllReview);

export const reviewRoutes = router;
