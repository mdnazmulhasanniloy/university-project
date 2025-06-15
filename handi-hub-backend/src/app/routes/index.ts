import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { categoryRoutes } from '../modules/category/category.route';
import { servicesPostService } from '../modules/servicesPost/servicesPost.service';
import { servicesRoutes } from '../modules/service/service.route';
import { reviewRoutes } from '../modules/review/review.route';
import { chatRoutes } from '../modules/chat/chat.route';
import { messagesRoutes } from '../modules/messages/messages.route';
import { servicesPostRoutes } from '../modules/servicesPost/servicesPost.route';
import { contractRoutes } from '../modules/contract/contract.route';
import stripeRoute from '../modules/stripe/stripe.route';
import { paymentsRoutes } from '../modules/payments/payments.route';
import { contentsRoutes } from '../modules/contents/contents.route';
import { uploadRouter } from '../modules/upload/upload.router';

const router = Router();
const moduleRoutes = [
  {
    path: '/upload',
    route: uploadRouter,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/contents',
    route: contentsRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/chats',
    route: chatRoutes,
  },
  {
    path: '/chats',
    route: messagesRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
  {
    path: '/services',
    route: servicesRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/service-post',
    route: servicesPostRoutes,
  },
  {
    path: '/contract',
    route: contractRoutes,
  },
  {
    path: '/stripe',
    route: stripeRoute,
  },
  {
    path: '/payments',
    route: paymentsRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
