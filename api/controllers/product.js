const mongoose = require('mongoose');
const Product = require('../models/products');

exports.products_get_all = (req, res) =>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return{
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
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

exports.products_create_product = (req, res) =>{
    console.log(req.file);
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage: req.file.path
    });

    product.save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Created Product Successfully",
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.products_get_product = (req, res) =>{
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc){
            res.status(200).json({
                product: doc,
                request:{
                    type: 'GET',
                    description: 'Get All Products',
                    url: 'http://localhost:3000/products/'
                }
            });
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
}

exports.products_update_product = (req, res) =>{  
    const id = req.params.productID;
    Product.updateOne({ _id: id }, { $set: { name: req.body.name, price: req.body.price } })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product Updated',
            request:{
                type:'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.products_delete_product = (req, res) =>{  
    const id = req.params.productID;
    Product.remove({ _id: id })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product Deleted',
            request:{
                type:'POST',
                url: 'http://localhost:3000/products/',
                body: { name: 'String', price: 'Number' }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}