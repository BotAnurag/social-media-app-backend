import express from "express";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);

app.use("/api/v1/user", userRoutes);
export default app;
