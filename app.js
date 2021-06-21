const express = require('express'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    xlstojson = require("xls-to-json"),
    xlsxtojson = require("xlsx-to-json"),
    app = express();

app.use(bodyParser.json());

//multers Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        let datetimestamp = Date.now();
        let fileNameCustm = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]
        cb(null, fileNameCustm)
    }
});

const upload = multer({
    storage: storage,
    // filter
    fileFilter: (req, file, callback) => {
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong file type'));
        }
        callback(null, true);
    }
}).single('file');

// Post: excel to json
app.post('/xlstojson', (req, res) => {
    let exceltojson;
    upload(req, res, (err) => {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        // Check file from multer object
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }

        // Chech the file type "excel"        
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        console.log(req.file.path);

        // Response
        try {
            let jsonName = req.file.originalname.split('.')[0];
            exceltojson({
                input: req.file.path,
                output: `./jsonfiles/${jsonName}.json`,
            }, (err, result) => {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }
                res.json({data: result });
            });
        } catch (e) {
            res.json({ error_code: 1, err_desc: "excel file Corupted" });
        }
    })

});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen('3030', () => {
    console.log('3030: At your service, sir...');
});