import {Router} from 'express';
import {login, register, editProfile, readProfile, logout} from "../controllers/users.ts"
import { authorization } from '../middlewares/authorization.ts';
import validateUser from '../middlewares/validation.ts';

const router = Router();  

//users routes
router.post("/login", login);
router.post("/register", validateUser, register);
router.patch("/profile", authorization, editProfile)

router.get("/profile", authorization, readProfile);
router.post("/logout", logout);

export default router;