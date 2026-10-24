import { Router } from 'express';
import * as communityController from '../controllers/communityController.js';

const router = Router();

router.get('/posts', communityController.getPosts);
router.post('/posts', communityController.createPost);
router.post('/posts/:id/sign', communityController.signPost);
router.get('/posts/:id/replies', communityController.getPostReplies);
router.post('/posts/:id/replies', communityController.createPostReply);
router.post('/posts/:id/report', communityController.reportPost);
router.get('/groups', communityController.getCommunities);
router.post('/groups/:id/join', communityController.toggleJoinCommunity);

export default router;
