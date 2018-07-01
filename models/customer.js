const mongoose = require('mongoose');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    ID:{
        type: Number,
        required: true,
        unique: true,
        default: parseInt(moment(new Date()).format('mmssSSS'))
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    update_timestamp:{
        type: Date,
        default: Date.now()
    }
})

CustomerSchema.methods.GenerateJWTToken = function(callback){
    bcrypt.hash(this.password,10,(err, hashed_pw)=>{
        this.password = hashed_pw;
        this.save()
        .then(result => {
            console.log(result);
            callback({status: 'Success',
                    token: jwt.sign({email: this.email, password: this.password},'abc123')
                    });
        })
        .catch(err => {
           callback({status: 'error',
        ErrorDetails: err});
        });
    })
}

CustomerSchema.statics.verifyJWTToken = function(token){
    var decoded;
    try{
        decoded = jwt.verify(token, 'abc1234');
        return Promise.resolve(decoded);
    }catch(error){
        return Promise.reject(error);
    }
}

var Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;