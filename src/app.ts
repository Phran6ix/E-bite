import express from "express";
import authRoute from "./routes/auth/authRoute";
import userRoute from "./routes/user/userRoute";
import productRoute from "./routes/product/productRoute";
import orderRoute from "./routes/order/orderRoutes";
import globalErrorHandler from "./controller/Error/errorController";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

app.use(globalErrorHandler);

export default app;
