import express from 'express';
import {
    createEarning,
    getAllEarnings,
    getEarningById,
    updateEarningById,
    deleteEarningById
} from '../controllers/earningController.js';
import { protect } from '../middlewares/authToken.js';

const router = express.Router();

router.post('/earnings', protect, createEarning);
router.get('/earnings', protect, getAllEarnings);
router.get('/earnings/:id', protect, getEarningById);
router.put('/earnings/:id', protect, updateEarningById);
router.delete('/earnings/:id', protect, deleteEarningById);

export default router;
