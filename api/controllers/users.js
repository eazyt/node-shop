const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10

exports.signUp = (req, res, next) => {
  const myPlaintextPassword = req.body.password
  // console.log(User.find({ email: req.body.email }))
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email exists'
        })
      } else {
        bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
          if (err) {
            // console.log(err)
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            })
            user.save()
              .then(result => {
                res.status(201).json({
                  message: 'User created'
                })
              })
              .catch(err => {
                console.log(err)
                res.status(500).json({
                  error: err
                })
              })
          }
        })
      }
    })
}

exports.login = (req, res) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      const pass = req.body.password
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      bcrypt.compare(pass, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          })
        }
        if (result) {
          const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY, {
              expiresIn: '1h'
            })
          return res.status(200).json({
            message: 'Auth Successfull',
            token: token
          })
        }
        res.status(401).json({
          message: 'Auth failed'
        })
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.deleteUser = (req, res, next) => {
  User.remove({
      _id: req.params.userId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}