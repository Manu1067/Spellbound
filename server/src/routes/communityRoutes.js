import { Router } from 'express';
import * as communityController from '../controllers/communityController.js';

const router = Router();

router.get('/posts', communityController.getPosts);
router.post('/posts', communityController.createPost);
router.post('/posts/:id/sign', communityController.signPost);

export default router;
