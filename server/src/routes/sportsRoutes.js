import { Router } from 'express';
import * as sportsController from '../controllers/sportsController.js';

const router = Router();

router.get('/standings', sportsController.getStandings);
router.get('/matches', sportsController.getMatches);

export default router;
