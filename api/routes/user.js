const express= require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const User = require('../models/user')
const myPlaintextPassword = 'password'
const saltRounds = 10

router.post('/signup', (req, res, next) => {
  const myPlaintextPassword = req.body.password
  // console.log(User.find({ email: req.body.email }))
  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if(user.length >= 1 ) {
        return res.status(409).json({
          message: 'Email exists'
        })
      } else {
          bcrypt.hash(myPlaintextPassword, 10, (err, hash) => {
            if(err) {
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
 


})

router.delete('/:userId', (req, res, next) => {
  User.remove({_id: req.params.userId})
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
})

module.exports = router