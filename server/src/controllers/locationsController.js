import * as locationsService from '../services/locationsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getLocations = (req, res, next) => {
  try {
    const { zone, includeSecrets } = req.query;
    const locations = locationsService.getAllLocations({
      zone,
      includeSecrets: includeSecrets === 'true' || includeSecrets === '1'
    });
    return sendSuccess(res, locations, { total: locations.length });
  } catch (err) {
    next(err);
  }
};

export const getLocationById = (req, res, next) => {
  try {
    const { id } = req.params;
    const location = locationsService.getLocationById(id);

    if (!location) {
      return sendError(res, `Location not found with ID '${id}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, location);
  } catch (err) {
    next(err);
  }
};

export const getPathways = (req, res, next) => {
  try {
    const pathways = locationsService.getPathways();
    return sendSuccess(res, pathways, { total: pathways.length });
  } catch (err) {
    next(err);
  }
};

export const getDirections = (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return sendError(res, "Both 'from' and 'to' location IDs are required for directions", 'VALIDATION_ERROR', 400);
    }

    const route = locationsService.calculateShortestPath(from, to);
    return sendSuccess(res, route);
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('No connected pathway')) {
      return sendError(res, err.message, 'NOT_FOUND', 404);
    }
    next(err);
  }
};
