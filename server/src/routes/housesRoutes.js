import { Router } from 'express';
import * as housesController from '../controllers/housesController.js';

const router = Router();

router.get('/', housesController.getHouses);
router.get('/history', housesController.getPointsHistory);
router.get('/:id', housesController.getHouseById);
router.post('/:id/points', housesController.awardPoints);

export default router;
