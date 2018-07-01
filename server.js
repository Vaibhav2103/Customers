const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var db = require('./db/mongoose');
var Customer = require('./models/customer');
var app = express();

const PORT = 3000;

// var john = new Customer(
//     firstname: 'John',
//     lastname: 'Doe',
//     email: 'john.doe@example.com',
//     phone:'1234567890',
//     address: '10 Main Street Columbus Ohio'
// });
app.use(bodyParser.json());
app.post('/customer/create',(req,res)=>{
    var customer = new Customer(req.body);
    customer.GenerateJWTToken((result)=>{
        if(result.status == 'Success'){
            res.json(result);
        }else{
            res.status(400).send(result.ErrorDetails);
        }
    })
    
    //res.status(200).send('all ok');
})

app.get('/customers',(req,res)=>{
    Customer.verifyJWTToken(req.header('X-Auth'))
    .then(result =>{
        return Customer.find({});
    })
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(err))
    });
    

app.get('/customer/:id',(req,res)=>{
    Customer.verifyJWTToken(req.header('X-Auth'))
    .then(result =>{
        return Customer.findOne({"ID":req.params.id});
    })
    
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(err));
});

app.patch('/customer/:id',(req,res)=>{
    req.body.update_timestamp = Date.now();
    Customer.verifyJWTToken(req.header('X-Auth'))
    .then(result =>{
        return Customer.findOneAndUpdate({"ID":req.params.id},req.body);
    })
    
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(err));
})

app.listen(PORT,()=>{
    console.log('Express listening on port:',PORT);
})