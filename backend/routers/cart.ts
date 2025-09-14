import {Router} from 'express';
import { authorization } from '../middlewares/authorization';
import { payment, orders } from '../controllers/cart';

const router = Router();

// cart routes
router.post("/payment", payment)
router.get("/orders", authorization, orders)

export default router