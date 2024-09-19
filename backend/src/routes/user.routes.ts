import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser,signup,getUserDetails,updateProfile, changePassword, login } from '../controller/user.controller';
import { authentication } from '../middleware/authentication.middleware';
const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/user/signup',signup)
router.post('/user/login',login)
router.get('/user/details',getUserDetails)
router.patch('/user/details/:id',updateProfile)
router.patch('/user/password-change/:id', authentication(), changePassword);


export default router;