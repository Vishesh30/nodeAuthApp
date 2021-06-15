var mongoose = require('mongoose');

var connectMongoDB = function(){ 
    mongoose.connect('mongodb://localhost:27017/nodeAuthApp',{useNewUrlParser: true})
    .then(()=> console.log("connnected to MongoBD"))
    .catch(err => console.log(err));
};

module.exports ={
    connectMonogDB: connectMongoDB
};
