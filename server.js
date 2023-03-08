const cors = require("cors");
const express = require("express");
const connectDatabase = require("./config/dbconnect");
const { sendEmail } = require("./Middlewares/sendEmail");
const app = express();

app.use(express.json());
app.use(cors());

// Config files
require("dotenv").config({ path: "./config.env" });


// All Middlewares


// All routes 
const userRoute = require("./Route/user.route")
app.use("/api/user",userRoute)


// app.use(sendEmail)


// connecting to the mongodb server
connectDatabase()

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
