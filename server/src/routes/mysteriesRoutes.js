import { Router } from 'express';
import * as mysteriesController from '../controllers/mysteriesController.js';

const router = Router();

router.get('/puzzles', mysteriesController.getPuzzles);
router.post('/verify', mysteriesController.verifyAnswer);

export default router;
