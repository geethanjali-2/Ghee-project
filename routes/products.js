// const express = require('express');
// const router = express.Router();
// const Product = require('../models/product');

// // Route to display all products
// router.get('/', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.render('products/index', { products });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // Route to display a single product
// router.get('/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         res.render('products/show', { product });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// module.exports = router;
