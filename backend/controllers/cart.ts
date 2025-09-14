import type { NextFunction } from "express";
import Cart from "../models/cart";
import { DATE, NOW } from "sequelize";

// list all orders
export const orders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;

        if (!userId) return res.status(401).json({ msg: "Unauthorized" })

        const orders = await Cart.findAll({
            where: { customer_id: userId },
            attributes: ["id", "order_date", "total_amount"],
            raw: true,
        })

        if (!orders) return res.status(404).json({ msg: "Orders not found" })

        res.status(200).json(orders)
    } catch (err) {
        next(err)
    }
}

// accept to buy - payment
export const payment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customer_id, total_amount } = req.body;
        if (!customer_id || !total_amount) {
            return res.status(400).json({ msg: "Missing required fields" });
        }
        const newOrder = await Cart.create({
            customer_id,
            total_amount,
        })

        return res.status(201).json({
            msg: "Ordered sucessfully",
            order: {
                customer_id: newOrder.customer_id,
                order_date: newOrder.order_date,
                total_amount: newOrder.total_amount
            }
        });
    } catch (err) {
        console.error("Order error", err);
        return res.status(500).json({ msg: "Internal server" })
    }
}