import * as communityService from '../services/communityService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getPosts = (req, res, next) => {
  try {
    const { category, studentId } = req.query;
    const posts = communityService.getPosts({ category, studentId });
    return sendSuccess(res, posts, { total: posts.length });
  } catch (err) {
    next(err);
  }
};

export const createPost = (req, res, next) => {
  try {
    const { authorId, authorName, houseId, category, title, body } = req.body;

    if (!title || !title.trim()) {
      return sendError(res, 'Notice title is required', 'VALIDATION_ERROR', 400);
    }
    if (!body || !body.trim()) {
      return sendError(res, 'Notice content is required', 'VALIDATION_ERROR', 400);
    }

    const post = communityService.createPost({
      authorId,
      authorName,
      houseId,
      category: category || 'Study Circle',
      title: title.trim(),
      body: body.trim()
    });

    return sendSuccess(res, post, null, 201);
  } catch (err) {
    next(err);
  }
};

export const signPost = (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const result = communityService.signPost(id, studentId);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.message === 'Notice not found') {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};

export const getPostReplies = (req, res, next) => {
  try {
    const { id } = req.params;
    const replies = communityService.getPostReplies(id);
    return sendSuccess(res, replies, { total: replies.length });
  } catch (err) {
    next(err);
  }
};

export const createPostReply = (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorId, authorName, houseId, body } = req.body;
    if (!body || !body.trim()) {
      return sendError(res, 'Reply text is required', 'VALIDATION_ERROR', 400);
    }
    const reply = communityService.createPostReply({
      postId: id,
      authorId,
      authorName,
      houseId,
      body: body.trim()
    });
    return sendSuccess(res, reply, null, 201);
  } catch (err) {
    next(err);
  }
};

export const reportPost = (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const result = communityService.reportPost(id, reason);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.message === 'Notice not found') {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};

export const getCommunities = (req, res, next) => {
  try {
    const list = communityService.getCommunities();
    return sendSuccess(res, list, { total: list.length });
  } catch (err) {
    next(err);
  }
};

export const toggleJoinCommunity = (req, res, next) => {
  try {
    const { id } = req.params;
    const result = communityService.toggleJoinCommunity(id);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.message === 'Community not found') {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};
