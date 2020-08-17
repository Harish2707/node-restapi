const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');

router.get('/', (req, res) =>{
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res) =>{
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    });

    product.save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Handling POST for /produts",
            createdProduct: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.get('/:productID', (req, res) =>{
    const id = req.params.productID;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({ message: 'No Valid entry found for provided ID'});
        } 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:productID', (req, res) =>{  
    const id = req.params.productID;
    Product.updateOne({ _id: id }, { $set: { name: req.body.name, price: req.body.price } })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:productID', (req, res) =>{  
    const id = req.params.productID;
    Product.remove({ _id: id })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router