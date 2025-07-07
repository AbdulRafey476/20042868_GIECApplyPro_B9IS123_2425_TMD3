import express, { Router } from "express";
import { protect } from "../middlewares/authToken.js";
import {
    createBranch, deleteBranches, getAllBranches, getBranch,
    updateBranch
} from "../controllers/branchController.js";

const router = express.Router();

router.post('/branch/', protect, createBranch);
router.get('/branch/allbranches', protect, getAllBranches);
router.put('/branch/updatebranch/:id', protect, updateBranch);
router.get('/branch/getbranch/:id', protect, getBranch);
router.delete('/branch/deletebranch/:id', protect, deleteBranches);

export default router;