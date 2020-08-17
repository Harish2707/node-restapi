const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    res.status(200).json({
        message: "Orders are fetched"
    });
});

router.post('/', (req, res) =>{
    const order = {
        productId : req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: "Orders are created",
        order: order
    });
});

router.get('/:orderId', (req, res) =>{
    res.status(200).json({
        message: "Order details",
        orderID : req.params.orderId
    });
});

router.delete('/:orderId', (req, res) =>{
    res.status(200).json({
        message: "Order deleted",
        orderID : req.params.orderId
    });
});


module.exports = router;