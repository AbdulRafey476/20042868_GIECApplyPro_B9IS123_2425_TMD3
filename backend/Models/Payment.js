import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentType: {
        type: String,
        enum: ['Consultancy', 'University'],
        required: true,
    },
    paidOn: {
        type: Date,
        required: true,
    },
    invoiceNumber: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'Cash'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        required: true,
    },
    comments: {
        type: String,
    },
    log: [{
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
            required: true,
        },
        paidOn: {
            type: Date,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['Bank Transfer', 'Cash'],
            required: true,
        },
        comments: {
            type: String,
        },
    }]
});


paymentSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    const isModified = update.$set && (
        update.$set.amount || update.$set.status || update.$set.paidOn || update.$set.paymentMethod || update.$set.comments
    );

    if (isModified) {
        const payment = await this.model.findOne(this.getQuery()); 

        const logEntry = {
            amount: payment.amount,
            status: payment.status,
            paidOn: payment.paidOn,
            paymentMethod: payment.paymentMethod,
            comments: payment.comments,
        };

        update.$push = update.$push || {};
        update.$push.log = logEntry;
    }

    next();
});



export default mongoose.model("Payment", paymentSchema);
