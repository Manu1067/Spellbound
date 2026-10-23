import { Router } from 'express';
import * as eventsController from '../controllers/eventsController.js';

const router = Router();

router.get('/', eventsController.getEvents);
router.get('/:id', eventsController.getEventById);
router.post('/:id/rsvp', eventsController.toggleRsvp);

export default router;
