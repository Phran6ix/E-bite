import express from "express";
import authRoute from "./controller/Authentication/authRoute";
import userRoute from "./controller/Users/userRoute";
import globalErrorHandler from "./controller/Error/errorController";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

app.use(globalErrorHandler);

export default app;
