import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { stripeController } from './stripe.controller';

const router = Router();

router.patch(
  '/connect',
  auth(USER_ROLE.service_provider),
  stripeController.stripLinkAccount,
);
router.get('/oauth/callback', stripeController.handleStripeOAuth);
router.get('/return/:id', stripeController.returnUrl);
router.get('/refresh/:id', stripeController.refresh);

const stripeRoute = router;
export default stripeRoute;
