import Status from '../Models/Status.js';

export const createStatus = async (req, res) => {
    const { studentId, comments, status, processedOn, admissionReceivedOn, visaFiledOn, visaDecisionOn } = req.body;

    try {
        const newStatus = new Status({
            studentId,
            comments,
            status,
            processedOn,
            admissionReceivedOn,
            visaFiledOn,
            visaDecisionOn,
        });

        const savedStatus = await newStatus.save();
        res.status(201).json(savedStatus);
    } catch (error) {
        res.status(400).json({ message: 'Error creating status', error });
    }
};

export const getAllStatuses = async (req, res) => {
    try {
        const statuses = await Status.find().populate('studentId');
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statuses', error });
    }
};

export const getStatusByStudentId = async (req, res) => {
    const { id } = req.params;

    try {
        const status = await Status.findById(id).populate('studentId');
        if (!status) {
            return res.status(404).json({ message: 'Status not found for this student' });
        }
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching status', error });
    }
};

export const updateStatusByStudentId = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const logEntry = {
            status: updates.status,
            comments: updates.comments,
            date: new Date(),
        };

        const updatedStatus = await Status.findByIdAndUpdate(
            id,
            {
                $push: { log: logEntry },
                ...updates,
            },
            { new: true, runValidators: true }
        );

        if (!updatedStatus) {
            return res.status(404).json({ message: 'No status found' });
        }

        res.status(200).json({ message: 'Status updated successfully', updatedStatus });
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
};

export const deleteStatusByStudentId = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStatus = await Status.findByIdAndDelete(id);
        if (!deletedStatus) {
            return res.status(404).json({ message: 'Status not found for this student' });
        }
        res.status(200).json({ message: 'Status deleted successfully', deletedStatus });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting status', error });
    }
};
