import * as laboratoriesService from '../services/laboratoriesService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getLaboratories = (req, res, next) => {
  try {
    const labs = laboratoriesService.getAllLaboratories();
    return sendSuccess(res, labs, { total: labs.length });
  } catch (err) {
    next(err);
  }
};

export const getLaboratoryById = (req, res, next) => {
  try {
    const { id } = req.params;
    const lab = laboratoriesService.getLaboratoryById(id);

    if (!lab) {
      return sendError(res, `Laboratory not found with ID/Code '${id}'`, 'NOT_FOUND', 404);
    }

    return sendSuccess(res, lab);
  } catch (err) {
    next(err);
  }
};

export const getLaboratoryResources = (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, search } = req.query;
    const resources = laboratoriesService.getLaboratoryResources(id, { category, search });
    return sendSuccess(res, resources, { total: resources.length });
  } catch (err) {
    next(err);
  }
};
