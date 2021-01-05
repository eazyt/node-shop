const mongoose = require('mongoose')
const Product = require('../models/product')

exports.getAllProduct = (req, res, next) => {
  // res.status(200).json({
  //   message: 'Handling GET request to /products'
  // })
  console.log('going home')
  Product.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs
          .map(doc => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + doc._id
              }
            }
          })
      }
      // console.log(docs)
      res.status(200).json(response)
    })
    .catch(err => {
      console.log('struggling' + err)
      res.status(500).json({
        error: err
      })
    })
}

exports.postProduct = (req, res, next) => {
  console.log('going home')
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  product.save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })

}

exports.getProductById = (req, res, next) => {
  const id = req.params.productId
  console.log('myProductId' + id)
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log('From database:', doc)
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'GET_ALL_PRODUCTS',
            url: 'http://localhost:3000/products/' + id
          }
        })
      } else {
        res.status(404).json({
          message: 'No valid entry found for given ID'
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.patchProduct = (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.updateOne({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          description: 'UPDATE_PRODUCT',
          url: 'http://localhost:3000/products/' + id
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
  // res.status(200).json({
  //   message: 'Updated product!'
  // })
}

exports.deleteProduct = (req, res, next) => {
  // res.status(200).json({
  //   message: 'Deleted product!'
  // })
  const id = req.params.productionId
  Product.deleteOne(id)
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}