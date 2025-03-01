import express from "express";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import friedshipRoutes from "./routes/friendsship.routes.js";
import cookieParser from "cookie-parser";

import chat from "./routes/chat.routes.js";
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
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/frieds", friedshipRoutes);
app.use("/api/v1/chat", chat);
export default app;
