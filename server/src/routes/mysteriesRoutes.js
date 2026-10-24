import { Router } from 'express';
import * as mysteriesController from '../controllers/mysteriesController.js';

const router = Router();

// Student Council Section
router.get('/council', mysteriesController.getStudentCouncil);

// Upcoming Events Section
router.get('/events', mysteriesController.getUpcomingEvents);

// Future Warnings & Official Notices Section
router.get('/notices', mysteriesController.getOfficialNotices);

// Anonymous Confessions Section
router.get('/confessions', mysteriesController.getConfessions);
router.post('/confessions', mysteriesController.createConfession);
router.post('/confessions/:id/like', mysteriesController.likeConfession);

// Complaints & Grievance Tracking Section
router.post('/complaints', mysteriesController.submitComplaint);
router.get('/complaints/:refId', mysteriesController.getComplaintStatus);

// Arcane Puzzles Section
router.get('/puzzles', mysteriesController.getPuzzles);
router.post('/verify', mysteriesController.verifyAnswer);

export default router;
