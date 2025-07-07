import express, { Router } from "express";
import { protect } from "../middlewares/authToken.js";
import { authAdmin, createadmin, deletProfile, getAllUsers, getProfile, getProfileById, updateProfile, getConsultantsByBranch, paginatedUser } from "../controllers/userController.js";
const router = express.Router();

router.post('/admins', createadmin);
router.post('/admins/auth', authAdmin);
router.get('/admins/users', protect, getAllUsers);
router.route('/admins/profile/:id').put(protect, updateProfile).get(protect, getProfileById).delete(protect, deletProfile);
router.route('/admins/profile').get(protect, getProfile)
router.get('/admins/consultants/:id', protect, getConsultantsByBranch);
router.get('/admins/pagination', protect, paginatedUser);

export default router; 