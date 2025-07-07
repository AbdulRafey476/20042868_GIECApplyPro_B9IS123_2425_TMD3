import Payment from '../Models/Payment.js';
import Student from '../Models/Student.js'

export const createPayment = async (req, res) => {
    const { studentId, amount, paymentType, paidOn, status, invoiceNumber, paymentMethod, comments } = req.body;

    try {
        const paymentExists = await Payment.findOne({ studentId, invoiceNumber });
        if (paymentExists) {
            return res.status(409).json({ message: "Error: Payment with this invoice number already exists for the student." });
        }

        const payment = new Payment({
            studentId,
            amount,
            paymentType,
            paidOn,
            status,
            invoiceNumber,
            paymentMethod,
            comments
        });

        await payment.save();
        res.status(201).send(payment);
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(400).send({ message: 'Error creating payment', error: error.message });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit || undefined;
        const skip = limit ? (page - 1) * limit : 0;
        const search = req.query.search || '';
        const branch_id = req.query.branch_id || '';
        const status = req.query.status || '';

        let studentQuery = req.user.role === 'admin' ? {} : { branch_id: req.user.branch_id };

        if (branch_id) {
            studentQuery.branch_id = branch_id;
        }

        if (search) {
            studentQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const students = await Student.find(studentQuery).select('_id');
        const studentIds = students.map(student => student._id);

        let paymentQuery = { studentId: { $in: studentIds } };

        if (status) {
            paymentQuery.status = { $regex: status, $options: 'i' };
        }

        const payments = await Payment.find(paymentQuery)
            .populate({
                path: 'studentId',
                populate: [
                    { path: 'branch_id' },
                    { path: 'consultant_id' }
                ]
            })
            .skip(skip)
            .limit(limit);

        const totalCount = await Payment.countDocuments(paymentQuery);

        const response = {
            payments,
            totalCount,
            pageCount: limit ? Math.ceil(totalCount / limit) : 1,
            currentPage: page,
            next: limit && page < Math.ceil(totalCount / limit) ? { page: page + 1 } : null,
            previous: limit && page > 1 ? { page: page - 1 } : null
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ message: "Error fetching payments", error: error.message });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('studentId');
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error("Error fetching payment:", error);
        res.status(500).json({ message: 'Error fetching payment', error: error.message });
    }
};

export const updatePaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { $set: { ...updates } },
            { new: true, runValidators: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: 'No payment found' });
        }

        res.status(200).json(updatedPayment);
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
};


export const deletePaymentById = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
};
