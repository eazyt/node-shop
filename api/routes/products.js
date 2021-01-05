const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const dateObj = new Date().toISOString()
    // cb(null, new Date().toISOString() + file.originalname)
    cb(null, file.fieldname + '-' + Date.now())
    // cb(null, file.fieldname + '-' + dateObj)
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
};

const upload = multer({
  storage: storage, limits: {
    filesize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get('/', ProductController.getAllProduct);

router.post('/', checkAuth, upload.single('productImage'), ProductController.postProduct);

router.get('/:productId', ProductController.getProductById);

router.patch('/:productId', checkAuth, ProductController.patchProduct);

router.delete('/:productId', checkAuth, ProductController.deleteProduct);
  

module.exports = router;



