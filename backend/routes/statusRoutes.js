import express from 'express';
import {
    createStatus,
    getAllStatuses,
    getStatusByStudentId,
    updateStatusByStudentId,
    deleteStatusByStudentId
} from '../controllers/statusController.js';

const router = express.Router();

router.post('/statuses/', createStatus);
router.get('/statuses/', getAllStatuses);
router.get('/statuses/:id', getStatusByStudentId);
router.put('/statuses/:id', updateStatusByStudentId);
router.delete('/statuses/:id', deleteStatusByStudentId);

export default router;
