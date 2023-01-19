const path = require('path');

exports.getIndex = (req, res, next) =>{
    res.render('index.html');
}
