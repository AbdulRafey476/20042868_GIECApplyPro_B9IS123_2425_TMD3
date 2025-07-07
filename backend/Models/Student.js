import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    last_qualification: {
        type: String,
        default: 'None'
    },
    country_interested_in: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        enum: ["Whatsapp", "Call", "Social Media", "Reference", "Walk In"],
        required: true,
    },
    englishTest: {
        type: String,
        default: 'None'
    },
    gpa: {
        type: String,
        default: 'None'
    },
    phone: {
        type: Number,
        default: 'None'
    },
    city: {
        type: String,
        required: true,
    },
    consultant_id: {
        type: mongoose.Schema.Types.ObjectId,
        requried: true,
        ref: 'User'
    },
    branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },

}, {
    timestamps: true,
});

export default mongoose.model("Student", studentSchema);
