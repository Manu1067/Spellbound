import { Router } from 'express';
import * as clubsController from '../controllers/clubsController.js';

const router = Router();

router.get('/', clubsController.getClubs);
router.get('/:id', clubsController.getClubById);

export default router;
