import mongoose from "mongoose";

const earningSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    feePaid: {
        type: Number,
        required: true,
    },
    commissionPercentage: {
        type: Number,
        required: true,
    },
    commissionAmount: {
        type: Number,
        required: true,
    },
    splitPercentage: {
        type: Number,
        required: true,
    },
    splitAmount: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    invoiceFiledOn: {
        type: Date,
        required: true,
    },
    invoiceReceivedOn: {
        type: Date,
        required: true,
    },
    comments: {
        type: String,
    },
    log: [{
        feePaid: Number,
        commissionAmount: Number,
        dueDate: Date,
        invoiceFiledOn: Date,
        invoiceReceivedOn: Date,
        comments: String,
        modifiedOn: {
            type: Date,
            default: Date.now,
        },
    }]
});

earningSchema.pre('save', function (next) {
    const isModified = this.isModified('feePaid') || this.isModified('commissionAmount') ||
        this.isModified('dueDate') || this.isModified('invoiceFiledOn') ||
        this.isModified('invoiceReceivedOn') || this.isModified('comments');

    if (isModified) {
        const logEntry = {
            feePaid: this.feePaid,
            commissionAmount: this.commissionAmount,
            dueDate: this.dueDate,
            invoiceFiledOn: this.invoiceFiledOn,
            invoiceReceivedOn: this.invoiceReceivedOn,
            comments: this.comments,
            modifiedOn: new Date(),
        };

        this.log.push(logEntry);
    }

    next();
});

export default mongoose.model("Earnings", earningSchema);
