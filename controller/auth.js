const customError = require('../error/');
const User = require('../model/auth')
const { createJwt } = require('../healper');

exports.register = async(req, res) => { 
    const { name, email, password } = req.body || '';
    if (!name || !email || !password) { 
        throw new customError.BadRequestError('Please provide all values');
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) { 
        throw new customError.BadRequestError('Email already in use');
    }
    const firstAcc = (await User.countDocuments({})) === 0;
    const role = firstAcc ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const payload = { userId: user._id, name: user.name, role: user.role };

    const token = createJwt({ payload });
    res.status(201).json({msg: "Successful Created an account", user: { name: user.name, email: user.email, role: user.role }, token });
}
