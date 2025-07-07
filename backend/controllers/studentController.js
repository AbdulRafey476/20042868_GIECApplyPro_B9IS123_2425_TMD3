import Student from '../Models/Student.js';
import Status from '../Models/Status.js';
import mongoose from 'mongoose';
import Payment from '../Models/Payment.js';

export const createStudentWithStatus = async (req, res) => {
    const { name, email, last_qualification, gpa, phone, city, englishTest, source, country_interested_in, branch_id, consultant_id } = req.body;

    try {
        let student = await Student.findOne({ email });
        if (!student) {
            student = new Student({ name, email, last_qualification, gpa, phone, city, englishTest, source, country_interested_in, branch_id, consultant_id });
            await student.save();
        }
        res.status(201).json({ student });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        let student = await Student.findById(id);

        if (student) {
            student = await Student.findByIdAndUpdate(req.params.id, { $set: req.body }, { runValidators: true })
        } else {
            return res.status(404).json({ message: "Student not found" });
        }

        const updatedStudent = await student.save();
        res.status(200).json({ message: "Student profile updated successfully", updatedProfile: updatedStudent });
    } catch (err) {
        res.status(500).json({ message: "Error updating Student profile", error: err.message });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || undefined;
        const search = req.query.search || '';
        let branch_id = req.query.branch_id || '';
        const status = req.query.status || '';
        const showPaymentsAdded = req.query.showPaymentsAdded || '';
        const skip = (page - 1) * limit;

        let query = req.user.role === 'admin' ? {} : { branch_id: req.user.branch_id };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if (status) {
            const statusRecords = await Status.find({ status: { $regex: status, $options: 'i' } });
            const studentIds = statusRecords.map(record => record.studentId);
            query._id = { $in: studentIds };
        }

        if (branch_id && mongoose.Types.ObjectId.isValid(branch_id)) {
            query.branch_id = branch_id;
        } else if (branch_id && branch_id.trim() === '') {
            branch_id = undefined;
        }

        let students;
        let totalCount;

        if (showPaymentsAdded === 'true') {
            const payments = await Payment.find({ studentId: { $in: (await Student.find(query).select('_id')).map(s => s._id) } });
            const studentIdsWithPayments = payments.map(payment => payment.studentId._id);

            query._id = { $in: studentIdsWithPayments };
        } else if (showPaymentsAdded === 'false') {
            const payments = await Payment.find({ studentId: { $in: (await Student.find(query).select('_id')).map(s => s._id) } });
            const studentIdsWithPayments = payments.map(payment => payment.studentId._id);

            query._id = { $nin: studentIdsWithPayments };
        }

        [students, totalCount] = await Promise.all([
            Student.find(query)
                .populate('branch_id')
                .populate('consultant_id')
                .skip(skip)
                .limit(limit),
            Student.countDocuments(query),
        ]);

        const response = {
            students,
            totalCount,
            pageCount: Math.ceil(totalCount / limit),
            currentPage: page,
            next: page < Math.ceil(totalCount / limit) ? { page: page + 1 } : null,
            previous: page > 1 ? { page: page - 1 } : null
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students", error: error.message });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
};

export const deleteStudentById = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ message: "Access Denied: only admin can delete students" });
    }

    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error: error.message });
    }
};

export const getMonthlyStudentCount = async (req, res) => {
    try {
        const { branch_id, month } = req.query;
        const matchStage = {};

        if (req.user.role === 'branch_admin') {
            matchStage.branch_id = new mongoose.Types.ObjectId(req.user.branch_id._id);
        } else if (req.user.role === 'admin' && branch_id) {
            matchStage.branch_id = new mongoose.Types.ObjectId(branch_id);
        } else if (req.user.role === 'consultant') {
            matchStage.branch_id = new mongoose.Types.ObjectId(req.user.branch_id._id);
        }

        const monthMap = {
            January: 1, February: 2, March: 3, April: 4,
            May: 5, June: 6, July: 7, August: 8,
            September: 9, October: 10, November: 11, December: 12
        };

        if (month && monthMap[month]) {
            matchStage.$expr = { $eq: [{ $month: "$createdAt" }, monthMap[month]] };
        }

        const monthlyData = await Student.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const formattedData = monthlyData.map(item => ({
            month: months[item._id - 1],
            count: item.count
        }));

        res.status(200).json(formattedData);
    } catch (err) {
        console.error("Error fetching monthly student data:", err);
        res.status(500).json({ message: "Error fetching monthly student data", error: err.message });
    }
};


