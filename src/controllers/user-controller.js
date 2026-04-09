const {StatusCodes}=require('http-status-codes');
const{UserService}=require('../services');

const {ErrorResponse, SuccessResponse}=require('../utils/common');

/*
POST -> /signup 
request body -> {email:'Shruti12@gmail.com',password:'1234'}
 */
async function signup(req, res){
    try {
        const user = await UserService.create({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.password
        });
        SuccessResponse.data = user;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}
async function signin(req, res){
    try {
        const user = await UserService.signin({
            email:req.body.email,
            password:req.body.password
        });
        SuccessResponse.data = user;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}
async function refreshToken(req, res){
    try {
        const tokens = await UserService.refreshToken(req.body.refreshToken);
        SuccessResponse.data = tokens;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}
async function addRoletoUser(req, res){
    try {
        const user = await UserService.addRoletoUser({
            role:req.body.role,
            id:req.body.id
        });
        SuccessResponse.data = user;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}
async function getSession(req, res){
    try {
        const userId = req.user;
        const user = await UserService.getUser(userId);
        const isAdmin = await UserService.isAdmin(userId);
        SuccessResponse.data = { ...user, isAdmin };
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}

async function getUser(req, res){
    try {
        const user = await UserService.getUser(req.params.id);
        SuccessResponse.data = user;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}

module.exports={
    signup,
    signin,
    refreshToken,
    addRoletoUser,
    getSession,
    getUser
}