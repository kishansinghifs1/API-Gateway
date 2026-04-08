const bcrypt =require('bcrypt');
const jwt=require('jsonwebtoken');

const {ServerConfig}=require("../../config");
function checkPassword(plainPassword,encryptedPassword){
    try {
        return bcrypt.compareSync(plainPassword,encryptedPassword);
    } catch (error) {
       console.log(error);
       throw error; 
    }
}
 function createAccessToken(input){
try {
   return jwt.sign(input,ServerConfig.JWT_SECRET,{expiresIn:ServerConfig.JWT_EXPIRY});
} catch (error) {
   console.log(error);
   throw error;
}
}
function createRefreshToken(input){
    try {
        return jwt.sign(input,ServerConfig.JWT_REFRESH_SECRET,{expiresIn:ServerConfig.JWT_REFRESH_EXPIRY});
    } catch (error) {
        console.log(error);
        throw error;
    }
}
function verifyAccessToken(token){
    try {
        return jwt.verify(token,ServerConfig.JWT_SECRET);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
function verifyRefreshToken(token){
    try {
        return jwt.verify(token,ServerConfig.JWT_REFRESH_SECRET);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
module.exports={
    checkPassword,
    createToken:createAccessToken,
    createAccessToken,
    createRefreshToken,
    verifyToken:verifyAccessToken,
    verifyAccessToken,
    verifyRefreshToken
}