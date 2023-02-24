const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error'); 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv= require("dotenv");

app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.use(
    express.urlencoded({
      extended: true,
    })
  );
  

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
  
  
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `${process.env.FRONTEND_URL2}`);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes");
const payment = require("./routes/paymentRoutes");

app.use("/api/v1" , product);
app.use("/api/v1" , user);
app.use("/api/v1" , order);
app.use("/api/v1" , payment);

app.use(errorMiddleware);



module.exports = app;