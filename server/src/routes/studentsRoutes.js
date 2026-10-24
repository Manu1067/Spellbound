import { Router } from 'express';
import * as studentsController from '../controllers/studentsController.js';

const router = Router();

router.get('/', studentsController.getStudents);
router.get('/current/dossier', studentsController.getCurrentStudent);
router.get('/:id', studentsController.getStudentById);
router.put('/:id', studentsController.updateStudent);

export default router;
