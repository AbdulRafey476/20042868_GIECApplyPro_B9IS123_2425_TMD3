import mongoose from "mongoose";

const studentStatusSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    comments: {
        type: String,
    },
    status: {
        type: String,
        enum: [
            "Query Received",
            "Processing",
            "Application Submitted",
            "Visa Filed",
            "Visa Approved",
            "Visa Rejected"
        ],
        default: "Query Received",
    },
    processedOn: {
        type: Date,
    },
    admissionReceivedOn: {
        type: Date,
    },
    visaFiledOn: {
        type: Date,
    },
    visaDecisionOn: {
        type: Date,
    },
    internationalContactNumber: {
        type: String,
        required: function () {
            return this.status === "Visa Approved";
        }
    },
    log: [{
        status: {
            type: String,
            enum: [
                "Query Received",
                "Processing",
                "Application Submitted",
                "Visa Filed",
                "Visa Approved",
                "Visa Rejected"
            ],
            required: true,
        },
        comments: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        }
    }]
});

studentStatusSchema.path('internationalContactNumber').validate(function (value) {
    if (this.status === "Visa Approved" && (value === undefined || value === null || value === "")) {
        return false;
    }
    return true;
}, 'International contact number is required when the status is Visa Approved.');

studentStatusSchema.pre('save', function (next) {
    if (this.isModified('status') || this.isModified('comments')) {
        const logEntry = {
            status: this.status,
            comments: this.comments,
            date: new Date(),
        };
        this.log.push(logEntry);
    }
    next();
});

export default mongoose.model("Status", studentStatusSchema);
