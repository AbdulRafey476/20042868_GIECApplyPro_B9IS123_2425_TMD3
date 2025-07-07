import { response } from 'express';
import Earning from '../Models/Earnings.js';
import Student from '../Models/Student.js';

export const createEarning = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
    }

    const { studentId, feePaid, commissionPercentage, splitPercentage, splitAmount, dueDate, invoiceFiledOn, invoiceReceivedOn, comments } = req.body;

    try {
        const earningExists = await Earning.findOne({ studentId });
        if (earningExists) {
            return res.status(409).json({ message: "Error: Earning record for this student already exists" });
        }
        const commissionAmount = feePaid * commissionPercentage / 100;
        const splitAmount = commissionAmount * splitPercentage / 100;

        const earning = new Earning({
            studentId,
            feePaid,
            commissionPercentage,
            commissionAmount,
            splitPercentage,
            splitAmount,
            dueDate,
            invoiceFiledOn,
            invoiceReceivedOn,
            comments,
        });

        await earning.save();
        res.status(201).send(earning);
    } catch (error) {
        console.error("Error creating earning:", error);
        res.status(400).send({ message: 'Error creating earning', error: error.message });
    }
};

export const getAllEarnings = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const branchId = req.query.branch_id || '';
        const studentIds = req.query.studentIds ? req.query.studentIds.split(',') : [];
        const status = req.query.status || '';

        let studentQuery = {};

        if (search) {
            studentQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (branchId) {
            studentQuery['branch_id'] = branchId;
        }

        if (studentIds.length > 0) {
            studentQuery['_id'] = { $in: studentIds };
        }

        const students = await Student.find(studentQuery).select('_id');
        const studentIdsFromQuery = students.map(student => student._id);

        if (studentIdsFromQuery.length === 0) {
            return res.status(200).json({
                earnings: [],
                totalCount: 0,
                pageCount: 0,
                currentPage: page,
                next: null,
                previous: null
            });
        }

        let earningsQuery = { studentId: { $in: studentIdsFromQuery } };

        if (status) {
            earningsQuery['status'] = status;
        }

        const totalCount = await Earning.countDocuments(earningsQuery);
        const pageCount = Math.ceil(totalCount / limit);
        const nextPage = page < pageCount ? { page: page + 1 } : null;
        const prevPage = page > 1 ? { page: page - 1 } : null;

        const earnings = await Earning.find(earningsQuery)
            .populate({
                path: 'studentId',
                populate: [
                    { path: 'branch_id' },
                    { path: 'consultant_id' }
                ]
            });

        res.status(200).json({
            earnings,
            totalCount,
            pageCount,
            currentPage: page,
            next: nextPage,
            previous: prevPage
        });

    } catch (error) {
        console.error("Error fetching earnings:", error.message);
        res.status(500).json({ message: "Error fetching earnings", error: error.message });
    }
};

export const getEarningById = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
    }
    try {
        const earning = await Earning.findById(req.params.id).populate('studentId');
        if (!earning) {
            return res.status(404).json({ message: "Earning record not found" });
        }
        res.status(200).json(earning);
    } catch (error) {
        console.error("Error fetching earning:", error);
        res.status(500).json({ message: 'Error fetching earning', error: error.message });
    }
};

export const updateEarningById = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
    }

    try {
        const { id } = req.params;
        const updates = req.body;

        const commissionAmount = updates.feePaid * updates.commissionPercentage / 100;
        const splitAmount = commissionAmount * updates.splitPercentage / 100;

        const logEntry = {
            feePaid: updates.feePaid,
            commissionPercentage: updates.commissionPercentage,
            commissionAmount,
            splitPercentage: updates.splitPercentage,
            splitAmount,
            dueDate: updates.dueDate,
            invoiceFiledOn: updates.invoiceFiledOn,
            invoiceReceivedOn: updates.invoiceReceivedOn,
            comments: updates.comments,
            modifiedOn: new Date(),
        };

        const updatedEarning = await Earning.findByIdAndUpdate(
            id,
            {
                $push: { log: logEntry },
                $set: {
                    feePaid: updates.feePaid,
                    commissionPercentage: updates.commissionPercentage,
                    commissionAmount,
                    splitPercentage: updates.splitPercentage,
                    splitAmount,
                    dueDate: updates.dueDate,
                    invoiceFiledOn: updates.invoiceFiledOn,
                    invoiceReceivedOn: updates.invoiceReceivedOn,
                    comments: updates.comments,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedEarning) {
            return res.status(404).json({ message: 'No earning record found' });
        }

        res.status(200).json(updatedEarning);
    } catch (error) {
        console.error('Error updating earning:', error);
        res.status(500).json({ message: 'Error updating earning', error: error.message });
    }
};

export const deleteEarningById = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
    }

    try {
        const earning = await Earning.findOneAndDelete({ studentId: req.params.id });
        if (!earning) {
            return res.status(404).json({ message: 'Earning record not found' });
        }
        res.status(200).json({ message: 'Earning deleted successfully' });
    } catch (error) {
        console.error("Error deleting earning:", error);
        res.status(500).json({ message: 'Error deleting earning', error: error.message });
    }
};
