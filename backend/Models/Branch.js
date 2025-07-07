import mongoose from "mongoose";

const branchschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true
});


export default mongoose.model("Branch", branchschema);
