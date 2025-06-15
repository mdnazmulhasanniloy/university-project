import { Router } from 'express';
import { contractController } from './contract.controller';
import multer, { memoryStorage } from 'multer';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.user),
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  contractController.createContract,
);

 
router.patch(
  '/approved/:id',
  auth(USER_ROLE.service_provider), 
  contractController.approvedContract,
);
router.patch(
  '/declined/:id',
  auth(USER_ROLE.service_provider), 
  contractController.declinedContract,
);
router.patch(
  '/completed/:id',
  auth(USER_ROLE.user), 
  contractController.completedContract,
);


router.patch(
  '/:id',
  auth(USER_ROLE.user),
  upload.fields([{ name: 'images', maxCount: 5 }]),
  parseData(),
  contractController.updateContract,
);
router.delete('/:id', contractController.deleteContract);
router.get('/my-contracts', auth(USER_ROLE.user), contractController.getMyContracts);
router.get('/service-provider', auth(USER_ROLE.service_provider), contractController.getByServiceProviderContracts);
router.get('/:id', contractController.getContractById);
router.get('/', contractController.getAllContract);

export const contractRoutes = router;
