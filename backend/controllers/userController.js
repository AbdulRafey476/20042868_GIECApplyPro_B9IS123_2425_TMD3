import Branch from "../Models/Branch.js";
import User from "../Models/User.js";
import generateToken from "../utils/generateToken.js";

const authAdmin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('branch_id');

    if (user && (await user.matchPassword(password))) {

        const token = generateToken(user);

        return res.status(200).json({
            message: "Successfully Logged In",
            username: user.username,
            email: user.email,
            token: token
        });
    } else {
        return res.status(401).json({ message: "Invalid email or password" });
    }
};

const createadmin = async (req, res) => {
    const { username, email, password, role, isAdmin, branch_id } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
        username,
        email,
        password,
        role,
        isAdmin,
        branch_id,
    });

    if (newUser) {
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            isAdmin: newUser.isAdmin,
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password").populate('branch_id');

    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({ profile: user });
};

const getProfileById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").populate('branch_id');

    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({ profile: user });
};

const getAllUsers = async (req, res) => {
    try {
        let users;
        if (req.user.role === 'admin') {
            users = await User.find({}).select("-password").populate('branch_id');
        } else if (req.user.role === 'branch_admin') {
            users = await User.find({ branch_id: req.user.branch_id }).populate('branch_id');
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
        } else {
            return res.status(404).json({ message: "Admin not found" });
        }

        const updatedUser = await user.save();
        res.status(200).json({ message: "Admin profile updated successfully", updatedProfile: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Error updating admin profile", error: err.message });
    }
};

export const getConsultantsByBranch = async (req, res) => {
    const { id } = req.params;

    try {
        const consultants = await User.find({ branch_id: id, role: "consultant" }).select("-password");
        res.status(200).json(consultants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const Logout = async (req, res) => {
//     res.cookie("jwt", "", {
//         httpOnly: true,
//         expires: new Date(0),
//     });
//     res.status(200).json({ message: 'Admin Logged Out Successfully' });
// };

const deletProfile = async (req, res) => {
    const { id } = req.params;
    const branch_admin = await Branch.findOne({ admin_id: id }).lean().exec();

    if (branch_admin) {
        return res.status(200).json({ message: "User has assigned branch, are you sure you want to delete this user?" });
    }

    const user = await User.findByIdAndDelete(id).exec();
    res.status(200).json({ message: "User has been deleted", profile: user });
};

const paginatedUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const branch_id = req.query.branch_id || '';
        const role = req.query.role || '';

        let userQuery = req.user.role === 'admin' ? {} : { branch_id: req.user.branch_id };

        if (branch_id) {
            userQuery.branch_id = branch_id;
        }

        if (role) {
            userQuery.role = role;
        }

        if (search) {
            const cleanSearch = search.trim();
            const regex = cleanSearch.split(' ').join('.*');

            userQuery.$or = [
                { name: { $regex: regex, $options: 'i' } },
                { email: { $regex: regex, $options: 'i' } }
            ];
        }

        const users = await User.find(userQuery)
            .select("-password")
            .populate('branch_id')
            .skip(skip)
            .limit(limit);

        const totalUser = await User.countDocuments(userQuery);

        const results = {
            totalUser,
            pageCount: Math.ceil(totalUser / limit),
            result: users,
            currentPage: page,
            next: page < Math.ceil(totalUser / limit) ? { page: page + 1 } : null,
            previous: page > 1 ? { page: page - 1 } : null
        };

        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};


export { authAdmin, createadmin, getProfile, getProfileById, getAllUsers, updateProfile, deletProfile, paginatedUser };
