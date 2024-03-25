import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bootstrap from "./src/index.router.js";
// import sendEmail from "./src/utils/email.js";
const app = express();
const port = 3000;

// await sendEmail({
//   to: "hebasoliman4648@gmail.com",
//   subject: "Hello ✔",
//   text: "Hello?",
//   html: "<b>Hi</b>",
// });
app.use("/uploads", express.static("./src/my-uploads"));
bootstrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
