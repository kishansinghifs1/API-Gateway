const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

function validateAuthRequest(req, res, next) {
  if (!req.body.email) {
    ErrorResponse.message = "Something went wrong while authentication user";
    ErrorResponse.error = new AppError(["Email is not found in the incoming request body"],StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.password) {
    ErrorResponse.message = "Something went wrong while authentication user";
    ErrorResponse.error = new AppError(["password is not found in the incoming request body"],StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}

function validateSignupRequest(req, res, next) {
  if (!req.body.firstName) {
    ErrorResponse.message = 'Something went wrong while creating user';
    ErrorResponse.error = new AppError(['firstName is not found in the incoming request body'], StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (!req.body.lastName) {
    ErrorResponse.message = 'Something went wrong while creating user';
    ErrorResponse.error = new AppError(['lastName is not found in the incoming request body'], StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  return validateAuthRequest(req, res, next);
}

function validateRefreshTokenRequest(req,res,next){
  if (!req.body.refreshToken) {
    ErrorResponse.message = "Something went wrong while refreshing token";
    ErrorResponse.error = new AppError(["refreshToken is not found in the incoming request body"],StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}
async function checkAuth(req,res,next){
try {
  const response=await UserService.isAuthenticated(req.headers['x-access-token']);
  if(response){
    req.user=response;//setting the user id in the req object
    next();
  }
} catch (error) {
   return res
   .status(error.statusCode)
   .json(error);
}
}
async function isAdmin(req,res,next){
  const response=await UserService.isAdmin(req.user);
  if(!response){
    return res.status(StatusCodes.UNAUTHORIZED)
    .json({message:'User not authorized for this action'});
  }
  next();
}


module.exports = {
    validateAuthRequest,
  validateSignupRequest,
  validateRefreshTokenRequest,
    checkAuth,
    isAdmin
}