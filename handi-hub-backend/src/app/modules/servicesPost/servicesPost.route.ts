import { Router } from 'express';
import { servicesPostController } from './servicesPost.controller';
import multer, { memoryStorage } from 'multer';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.service_provider),
  upload.single('banner'),
  parseData(),
  servicesPostController.createServicesPost,
);
router.patch(
  '/:id',
  auth(USER_ROLE.service_provider),
  upload.single('banner'),
  parseData(),
  servicesPostController.updateServicesPost,
);
router.delete(
  '/:id',
  auth(USER_ROLE.service_provider),
  servicesPostController.deleteServicesPost,
);
router.get(
  '/my-post',
  auth(USER_ROLE.service_provider),
  servicesPostController.getMyPost,
);
router.get('/:id', servicesPostController.getServicesPostById);
router.get('/', servicesPostController.getAllServicesPost);

export const servicesPostRoutes = router;
