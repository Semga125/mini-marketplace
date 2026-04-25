const express = require('express');
require('dotenv').config();

const cors = require('cors');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");


const userRouter = require('./routes/tasks.js');

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

app.use('/users', userRouter);

app.listen(10000, () => {
  console.log("Server started");
});