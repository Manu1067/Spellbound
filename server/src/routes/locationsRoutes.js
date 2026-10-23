import { Router } from 'express';
import * as locationsController from '../controllers/locationsController.js';

const router = Router();

router.get('/', locationsController.getLocations);
router.get('/pathways', locationsController.getPathways);
router.get('/:id', locationsController.getLocationById);

export default router;
