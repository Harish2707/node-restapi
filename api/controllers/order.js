const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/products');

exports.orders_get_all = (req, res) =>{
    Order.find()
    .select('quantity product _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return{
                    product: doc.product,
                    quantity: doc.quantity,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.orders_create_order = (req, res) =>{
    Product.findById(req.body.productId)
    .then(product => {
        if (!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order Created Successfully',
            CreatedOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}

exports.orders_get_one = (req, res) =>{
    const id = req.params.orderId;
    Order.findById(id)
    .select('quantity product _id')
    .populate('product')
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc){
            res.status(200).json({
                order: doc,
                request:{
                    type: 'GET',
                    description: 'Get All Orders',
                    url: 'http://localhost:3000/orders/'
                }
            });
        }else{
            res.status(404).json({ message: 'Order not found'});
        } 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.orders_delete_order = (req, res) =>{
    const id = req.params.orderId;
    Order.remove({ _id: id })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Order Deleted',
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}