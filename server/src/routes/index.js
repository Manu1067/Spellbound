import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import eventsRoutes from './eventsRoutes.js';
import locationsRoutes from './locationsRoutes.js';
import coursesRoutes from './coursesRoutes.js';
import studentsRoutes from './studentsRoutes.js';
import housesRoutes from './housesRoutes.js';
import sportsRoutes from './sportsRoutes.js';
import communityRoutes from './communityRoutes.js';
import mysteriesRoutes from './mysteriesRoutes.js';
import owlsRoutes from './owlsRoutes.js';
import scheduleRoutes from './scheduleRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/events', eventsRoutes);
router.use('/locations', locationsRoutes);
router.use('/courses', coursesRoutes);
router.use('/students', studentsRoutes);
router.use('/houses', housesRoutes);
router.use('/sports', sportsRoutes);
router.use('/community', communityRoutes);
router.use('/mysteries', mysteriesRoutes);
router.use('/owls', owlsRoutes);
router.use('/schedule', scheduleRoutes);

export default router;
