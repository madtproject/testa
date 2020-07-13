const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const getdb = require('../util/database').getdb;

const products = [];
// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  products.push({title: req.body.title});
  const db = getdb();
  db.collection('products').insertOne({title: req.body.title, number: 2})
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
  res.redirect('/');
});

exports.routes = router;
exports.product = products;