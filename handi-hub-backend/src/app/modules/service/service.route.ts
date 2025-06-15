import { Router } from 'express';
import {
  servicesController, 
} from './service.controller';
import multer, { memoryStorage } from 'multer';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.service_provider),
  upload.single('banner'),
  parseData(),
  servicesController.createService,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.service_provider),
  upload.single('banner'),
  parseData(),
  servicesController.updateService,
);

router.delete('/:id', auth(USER_ROLE.admin), servicesController.deleteService);

router.get('/:id', servicesController.getServiceById);
router.get('/', servicesController.getAllServices);

export const servicesRoutes = router;
