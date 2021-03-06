const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')


exports.getAllOrders = (req, res, next) => {
  Order.find()
    .exec()
    .populate('product','name')
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs
          .map(doc => {
            return {
              product: doc.product,
              quantity: doc.quantity,
              _id: doc._id,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + doc._id
              }
            }
          })
      })

    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.postOrder = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        })
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      })
      return order.save()
    })
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Product not found',
        error: err
      })
    })
}

exports.getOrderById = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId)
    .exec()
    .populate('product')
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        })
      }
      res.status(200).json({
        order: order,
        request: {
          typr: 'GET',
          url: 'http://localhost:3000/orders'
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })

}

exports.deleteOrderById = (req, res, next) => {
  const orderId = req.params.orderId
  Order.remove({
      _id: orderId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order Deleted',
        request: {
          typr: 'POST',
          url: 'http://localhost:3000/orders',
          body: {
            productId: 'ID',
            quantity: 'Number'
          }
        }
      })

    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}