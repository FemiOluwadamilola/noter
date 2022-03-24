const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRouter = require('./routes/user');
const noteRouter = require('./routes/note');
const app = express();

require('dotenv').config();

// mongodb connection
const url = process.env.MONGODB_URL;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('mongoDB connected...'))

// express middlewares
app.use(express.json());
app.use(express.urlencoded({extend:true}))

// routes middlewares
app.use('/auth', authRoute);
app.use('/user', userRouter);
app.use('/note', noteRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("app running.."))