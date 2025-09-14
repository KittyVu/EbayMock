import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createError } from "./utils/helpers";
import usersRouter from './routers/users';
import cartRouter from "./routers/cart"
import sequelize from "./utils/db";

const app = express();

/* ---------------- middlewares --------------- */
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));
app.use(cookieParser());
app.use(express.json());

/* ----------------- database ----------------- */
try {
    await sequelize.authenticate()
} catch (err) {
    console.error("database has error:", err);
}
// only the first time ?
//await sequelize.sync({ force: true });
// then 
sequelize.sync({ alter: true });
/* ------------------ routers ----------------- */
app.use('/api/users', usersRouter);
app.use("/api/cart", cartRouter)

/* -------------- error handlers -------------- */
app.use((req, res, next) => {
  next(createError(404, "❌ Route not defined!"));
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
  next();
});

/* ------------------- port ------------------- */
const port = process.env.PORT || 5001;
app.listen(port, () =>
  console.log(`server run on: http://localhost:${port} 🚀`)
);