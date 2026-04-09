const express=require('express');
const{ UserController }=require('../../controllers');
const {AuthRequestMiddlewares}=require('../../middleware')
const router=express.Router();

router.post('/signup',AuthRequestMiddlewares.validateSignupRequest,UserController.signup);
router.post('/signin',AuthRequestMiddlewares.validateAuthRequest,UserController.signin);
router.post('/refresh-token',AuthRequestMiddlewares.validateRefreshTokenRequest,UserController.refreshToken);
router.post('/role',AuthRequestMiddlewares.checkAuth,AuthRequestMiddlewares.isAdmin,UserController.addRoletoUser);
router.get('/session',AuthRequestMiddlewares.checkAuth,UserController.getSession);
router.get('/:id', UserController.getUser);
module.exports=router;