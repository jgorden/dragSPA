var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
});

router.post('/uploads', function(req, res, next) {
  // var fstream;
  // req.pipe(req.busboy);
  // req.busboy.on('file', function (fieldname, file, filename) {
  //     console.log("Uploading: " + filename); 
      // console.log(filename); 
      // console.log(file); 
      // fstream = fs.createWriteStream('./files/' + filename);
      // file.pipe(fstream);
      // fstream.on('close', function () {
          res.json({success: true});
      // });
  // });
});

module.exports = router;
