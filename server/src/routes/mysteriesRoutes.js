import { Router } from 'express';
import * as mysteriesController from '../controllers/mysteriesController.js';

const router = Router();

router.get('/puzzles', mysteriesController.getPuzzles);
router.post('/verify', mysteriesController.verifyAnswer);
router.get('/archives', mysteriesController.getMysteryArchives);
router.get('/recommendations', mysteriesController.getRecommendations);
router.post('/ask-scribe', mysteriesController.queryArchivalScribe);

export default router;
