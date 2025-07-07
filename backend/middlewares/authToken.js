import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const protect = async (req, res, next) => {
    const token = req.header('token');

    if (!token) {
        return res.status(401).json({ message: "No Authorization, No Token" });
    }

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedUser.id)
            .select("-password")
            .populate('branch_id');

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        const allowedRoles = ['admin', 'branch_admin','consultant'];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Unauthorized role" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

export { protect };
