import { Router } from 'express';
import * as mysteriesController from '../controllers/mysteriesController.js';

const router = Router();

router.get('/puzzles', mysteriesController.getPuzzles);
router.post('/verify', mysteriesController.verifyAnswer);
router.get('/archives', mysteriesController.getMysteryArchives);
router.get('/filters', mysteriesController.getArchiveFilters);
router.get('/resources/:id', mysteriesController.getResourceById);
router.get('/recommendations', mysteriesController.getRecommendations);
router.post('/ask-scribe', mysteriesController.queryArchivalScribe);

export default router;
