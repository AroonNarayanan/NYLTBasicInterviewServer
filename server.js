var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');

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
        cb(null, req.params.id);
    }
});
var candidate_image_uploads = multer({ storage: options });

router.route('/candidates')
    .get(function (req, res) {
        Candidate.find({}).exec(function (err, results) {
            if (err) { res.send(err); } else {
                res.json(results);
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
router.route('/candidates/:id/image')
    .get(function (req, res) {
        res.sendFile(path.join(__dirname, "/images/" + req.params.id));
    })
    .post(candidate_image_uploads.single('candidateImage'), function (req, res) {
        res.json({ message: 'File uploaded.' });
    });

app.use(router);
var port = process.env.port || 80;

app.listen(port);
console.log('Server available on port ' + port);