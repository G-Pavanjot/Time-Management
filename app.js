const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use(bodyParser.json());

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser: true}, () => console.log("Connected to DB"));

//Import Routes
const userRoute = require('./routes/users');

app.use('/user', userRoute);

app.listen(3000, () => console.log("Server Up and Running"));