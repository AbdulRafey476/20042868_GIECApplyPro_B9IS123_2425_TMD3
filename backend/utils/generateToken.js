import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const data = {
        id: user._id,
        role: user.role,
        branch_id: user.branch_id
    };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '3d' });

    return token

    // res.cookie("jwt", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV !== 'development',
    //     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
    //     sameSite: 'strict',
    // });
};

export default generateToken;
