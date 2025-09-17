const { jwt } = require("jsonwebtoken");

exports.createJwt = ({payload}) => {
    const token = jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: 'id'});
    return { token };
} 

module.exports = { createJwt };