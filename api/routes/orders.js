const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrderController = require('../controllers/orders');


router.get('/', checkAuth, OrderController.getAllOrders);

router.post('/', checkAuth, OrderController.postOrder);

router.get('/:orderId', checkAuth, OrderController.getOrderById);

router.delete('/:orderId', checkAuth, OrderController.deleteOrderById);



module.exports = router;