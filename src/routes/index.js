const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/suppliersController');
const supplierMiddleware = require('../middlewares/suppliersMiddleware');

router.get('/suppliers', supplierController.getSuppliers);
router.delete('/supplier/:id', supplierController.deleteSupplier);
router.post('/supplier', supplierMiddleware.checkDuplicateSupplier, supplierController.addSupplier )

module.exports = router;