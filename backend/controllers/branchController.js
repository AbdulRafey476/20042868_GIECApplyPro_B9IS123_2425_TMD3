import Branch from "../Models/Branch.js";
import User from "../Models/User.js";

const createBranch = async (req, res) => {
    const { name, location, phoneNumber } = req.body;

    let user = await User.findById(req.user.id);

    if (!user || req.user.role !== "admin" || !user.isAdmin) {
        return res.status(401).json({ message: "Access Denied: Only admins can create branches" });
    }

    const branchExists = await Branch.findOne({ location });
    if (branchExists) {
        return res.status(400).json({ message: "Branch already exists. Try logging in again." });
    }

    const newBranch = await Branch.create({
        name,
        location,
        phoneNumber
    });

    if (newBranch) {
        res.status(201).json({ data: newBranch });
    } else {
        res.status(400).json({ message: "Invalid branch data" })
    }

};

const getAllBranches = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        let branches;
        let totalCount;

        if (search) {
            const branchSearch = { name: { $regex: search, $options: 'i' } };

            const adminSearch = await User.find({
                role: 'branch_admin',
                username: { $regex: search, $options: 'i' }
            }).select('branch_id');

            const adminBranchIds = adminSearch.map(user => user.branch_id);

            branches = await Branch.find({
                $or: [
                    branchSearch,
                    { _id: { $in: adminBranchIds } }
                ]
            })
                .skip(skip)
                .limit(limit);

            totalCount = await Branch.countDocuments({
                $or: [
                    branchSearch,
                    { _id: { $in: adminBranchIds } }
                ]
            });
        } else {
            branches = await Branch.find()
                .skip(skip)
                .limit(limit);
            totalCount = await Branch.countDocuments();
        }

        const response = {
            branches,
            totalCount,
            pageCount: Math.ceil(totalCount / limit),
            currentPage: page,
            next: page < Math.ceil(totalCount / limit) ? { page: page + 1 } : null,
            previous: page > 1 ? { page: page - 1 } : null
        };

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: "Error fetching branches", error: err.message });
    }
};

const getBranch = async (req, res) => {
    const branches = await Branch.findById(req.params.id);

    if (!req.params.id) {
        return res.status(400).json({ message: "Branch ID is required" });
    }

    if (!branches) {
        res.status(400).json({ message: "Branch not Found" })
    }
    res.status(200).json({ data: branches })

};

const updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await Branch.findById(id);

        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        if (branch) {
            branch.name = req.body.name || branch.name;
            branch.location = req.body.location || branch.location;
        } else {
            res.status(404).json({ message: "Branch not found" });
        }

        const updateBranch = await branch.save();

        res.status(200).json({ message: "Admin profile updated successfully", updateBranch });
    } catch (err) {
        res.status(500).json({ message: "Error updating admin profile", error: err.message });
    }
};

const deleteBranches = async (req, res) => {
    const role = req.user.role;

    if (role !== "admin") {
        return res.status(401).json({ message: "Access Denied: Only admins can delete branches" });
    }
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
    }

    if (branch) {
        res.status(200).json({ message: "Successfully deleted the Branch", branch });
    } else {
        res.status(400).json({ message: "Error deleting the branch" });
    }

};

export { createBranch, getAllBranches, getBranch, deleteBranches, updateBranch };