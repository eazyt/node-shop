require('dotenv').config()
// console.log(process.env)
const express = require('express')
const app = express()
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRoutes = require('./api/routes/user')

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if(req.method == 'OPTIONS') {
    res.header('Access-ControlAllow-Methods', 'PUT, POST, PATCH, GET, DELETE')
    return res.status(200).json({})
  }
  next()
})


app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
})
.then(() => console.log('MongoDb connected'))
.catch((err) => console.log('MongoDb Connection error', err))

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, next) => {
  res.status(err.status || 5000)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;