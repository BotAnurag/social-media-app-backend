import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./db/index.js";

import app from "./app.js";
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is runnign at ${process.env.PORT}`);
    });
    app.on("error:", (error) => {
      console.log("error: ", error);
    });
  })
  .catch((err) => {
    console.log(`db connection fail`);
  });
