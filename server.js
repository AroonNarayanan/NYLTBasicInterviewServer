var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

var Candidate = require('./Candidate.js');
var app = express();

mongoose.connect('mongodb://nylt:aacnylt@ds050739.mlab.com:50739/basicinterviewserver');
//mongoose.connect('mongodb://localhost:27017');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router();

var options = multer.diskStorage({
    destination: 'images/',
    filename: function (req, file, cb) {
        cb(null, req.query.name);
    }
});
var candidate_image_uploads = multer({ storage: options });

router.route('/candidates')
    .get(function (req, res) {
        Candidate.find({}).exec(function (err, results) {
            if (err) { res.send(err); } else {
                res.json(results.sort(function(a,b){
                    var aname = a.LastName.toLowerCase();
                    var bname = b.LastName.toLowerCase();
                    if (aname < bname) {
                        return -1;
                    }
                    if (aname > bname) {
                        return 1;
                    }
                    return 0;
                }));
            }
        });
    })
    .post(function (req, res) {
        var candidate = new Candidate(req.body);
        candidate.Created = new Date();
        candidate.save(function (err) {
            if (err)
                res.send(err);
            else
                res.json({ message: 'Candidate created.' });
        });
    });
router.route('/candidates/:id')
    .delete(function (req, res) {
        Candidate.remove({_id: req.params.id}, function(err, scout){
            if (err) {res.send(err)} else {
                res.json({"message": "Deletion successful."});
            }
        })
    });
router.route('/images')
    .get(function (req, res) {
        res.sendFile(path.join(__dirname, "/images/" + req.query.name));
    })
    .post(candidate_image_uploads.single('candidateImage'), function (req, res) {
        res.json({ message: 'File uploaded.' });
    });
router.route('/policy')
    .get(function (req, res) {
        res.send("NYLT Interview Capture won't share any information transmitted through its app or stored on its servers, nor will that data be used for any other purpose beyond the services the app provides. The data will furthermore not be retained after it is deleted by the user.");
    });

app.use(router);
var port = process.env.port || 80;

app.listen(port);
console.log('Server available on port ' + port);