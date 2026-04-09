const{UserRepository,RoleRepository}=require('../repositories');
const AppError = require("../utils/errors/app-error");
const {Auth,Enums}=require('../utils/common')
const { StatusCodes } = require('http-status-codes');
const userRepo =new UserRepository();
const roleRepo =new RoleRepository();

function normalizeNamePart(value, fallback) {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : fallback;
}

function formatUserProfile(user) {
    return {
        userId: user.id,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email
    };
}

async function create(data){
try {
        const user = await userRepo.create({
            ...data,
            firstName: normalizeNamePart(data.firstName, 'User'),
            lastName: normalizeNamePart(data.lastName, 'Name')
        });
        const role=await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER);
    await user.addRole(role);
        return formatUserProfile(user);
    } catch (error) {
        if(error.name == 'SequelizeValidationError'||error.name == 'SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }

}

async function signin(data){
    try {
      const user=await userRepo.getUserByEmail(data.email);
       if(!user){
        throw new AppError('No user found for the given email',StatusCodes.NOT_FOUND);
       }
       const passwordMatch=Auth.checkPassword(data.password,user.password);
       if(!passwordMatch){
        throw new AppError('Invalid password',StatusCodes.BAD_REQUEST);
       }
       const accessToken=Auth.createAccessToken({id:user.id,email:user.email});
       const refreshToken=Auth.createRefreshToken({id:user.id,email:user.email});
       return {
        accessToken,
        refreshToken,
        user: formatUserProfile(user)
       };

    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function isAuthenticated(token){
    try {
        if(!token){
            throw new AppError('Missing JWT token',StatusCodes.BAD_REQUEST);
        }
        const response=Auth.verifyAccessToken(token);
        const user=await userRepo.get(response.id);
        if(!user){
            throw new AppError('No user found',StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
       if(error.name=='JsonWebTokenError') {
        throw new AppError('Invalid JWT token',StatusCodes.BAD_REQUEST);
       }
       if(error.name=='TokenExpiredError') {
        throw new AppError('JWT token Expired',StatusCodes.BAD_REQUEST);
       }
       console.log(error);
       throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function refreshToken(token){
    try {
        if(!token){
            throw new AppError('Missing refresh token',StatusCodes.BAD_REQUEST);
        }
        const payload = Auth.verifyRefreshToken(token);
        const user = await userRepo.get(payload.id);
        if(!user){
            throw new AppError('No user found',StatusCodes.NOT_FOUND);
        }
        const accessToken=Auth.createAccessToken({id:user.id,email:user.email});
        const refreshToken=Auth.createRefreshToken({id:user.id,email:user.email});
        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name=='JsonWebTokenError') {
            throw new AppError('Invalid refresh token',StatusCodes.BAD_REQUEST);
        }
        if(error.name=='TokenExpiredError') {
            throw new AppError('Refresh token expired',StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function addRoletoUser(data){
    try {
        const user=await userRepo.get(data.id);
        if(!user){
            throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND);
        }
        const role=await roleRepo.getRoleByName(data.role);
        if(!role){
            throw new AppError('No user found for the given role',StatusCodes.NOT_FOUND);
        }
        await user.addRole(role);
        return user;
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function isAdmin(id){
    try {
        const user=await userRepo.get(id);
        if(!user){
            throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND);
        }
        const adminrole=await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
        if(!adminrole){
            throw new AppError('No user found for the given role',StatusCodes.NOT_FOUND);
        }
        return user.hasRole(adminrole);
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getUser(id){
    try {
        const user = await userRepo.get(id);
        if(!user){
            throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND);
        }
        return formatUserProfile(user);
    } catch (error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    create,
    signin,
    isAuthenticated,
    refreshToken,
    addRoletoUser,
    isAdmin,
    getUser
}