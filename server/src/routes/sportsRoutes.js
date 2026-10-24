import { Router } from 'express';
import * as sportsController from '../controllers/sportsController.js';

const router = Router();

router.get('/standings', sportsController.getStandings);
router.get('/teams', sportsController.getTeams);
router.post('/teams', sportsController.registerTeam);
router.get('/matches', sportsController.getMatches);
router.patch('/matches/:id/score', sportsController.updateMatchScore);
router.post('/matches/:id/simulate', sportsController.simulateMatch);
router.get('/bracket', sportsController.getTournamentBracket);

export default router;
