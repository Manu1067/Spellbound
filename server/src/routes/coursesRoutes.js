import { Router } from 'express';
import * as coursesController from '../controllers/coursesController.js';

const router = Router();

router.get('/', coursesController.getCourses);
router.get('/:code', coursesController.getCourseByCode);
router.get('/:code/resources', coursesController.getCourseResources);

export default router;
