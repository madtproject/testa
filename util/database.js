const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const admin = require('../routes/admin');

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://admin:og41FgO2V7QgzQ06@mycluster-eatj8.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology:true}).
    then(client =>{
        console.log('Connected');
        _db = client.db('shop');
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

const getdb = () => {
    if(_db){
        return _db;
    }
    throw 'No database found';
};

function getMydb(){
    if(_db){
        return _db;
    }
    throw 'No database found';
}

class Product{
    constructor(title,price){
        this.title = title;
        this.price = price;
    }

    save(){
        const db = getMydb();
        db.collection('shop').insertOne(this)
        .then(result => {
            console.log('database.js main save ke andar');
            console.log(result);
        })
        .catch(err => {
            console.log('error in save in database.js');
            console.log(err);
        });
    }
}

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;