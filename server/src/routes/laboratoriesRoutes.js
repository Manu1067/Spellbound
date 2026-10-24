import { Router } from 'express';
import * as laboratoriesController from '../controllers/laboratoriesController.js';

const router = Router();

router.get('/', laboratoriesController.getLaboratories);
router.get('/:id', laboratoriesController.getLaboratoryById);
router.get('/:id/resources', laboratoriesController.getLaboratoryResources);

export default router;
