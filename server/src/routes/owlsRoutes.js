import { Router } from 'express';
import * as owlsController from '../controllers/owlsController.js';

const router = Router();

router.post('/', owlsController.dispatchOwl);
router.get('/recent', owlsController.getRecentDispatches);

export default router;
