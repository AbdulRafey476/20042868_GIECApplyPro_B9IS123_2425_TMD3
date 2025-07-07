import express from 'express';
import {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePaymentById,
    deletePaymentById
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authToken.js';

const router = express.Router();

router.post('/payments', protect, createPayment);
router.get('/payments', protect, getAllPayments);
router.get('/payments/:id', protect, getPaymentById);
router.put('/payments/:id', protect, updatePaymentById);
router.delete('/payments/:id', protect, deletePaymentById);

export default router;
