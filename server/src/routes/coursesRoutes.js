import { Router } from 'express';
import * as coursesController from '../controllers/coursesController.js';

const router = Router();

router.get('/', coursesController.getCourses);
router.get('/resources', coursesController.getAllResources);
router.get('/potion-ingredients', coursesController.getPotionIngredients);
router.post('/brew-potion', coursesController.brewPotion);
router.post('/quizzes/submit', coursesController.submitQuiz);
router.get('/progress/:studentId', coursesController.getStudentProgress);
router.get('/:code', coursesController.getCourseByCode);
router.get('/:code/resources', coursesController.getCourseResources);

export default router;
