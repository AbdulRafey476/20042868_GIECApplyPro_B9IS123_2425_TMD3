import express from "express";
import {
    createStudentWithStatus,
    getAllStudents,
    getStudentById,
    deleteStudentById,
    getMonthlyStudentCount,
    updateStudentById
} from "../controllers/studentController.js";
import { protect } from "../middlewares/authToken.js"

const router = express.Router();

router.get('/students/monthly-count', protect, getMonthlyStudentCount);
router.post("/students", protect, createStudentWithStatus);
router.put("/students/:id", protect, updateStudentById);
router.get("/students", protect, getAllStudents);
router.get("/students/:id", protect, getStudentById);
router.delete("/students/:id", protect, deleteStudentById);

export default router;
