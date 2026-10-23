import { Router } from 'express';
import * as scheduleController from '../controllers/scheduleController.js';

const router = Router();

router.get('/', scheduleController.getSchedule);
router.patch('/:id/status', scheduleController.toggleScheduleStatus);

export default router;
