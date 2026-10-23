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
