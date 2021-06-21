const express = require('express'),
    xlsxtojson = require("xlsx-to-json");
    xlstojson = require("xls-to-json"),
    app = express();

app.post('/api/xlstojson', function(req, res) {
    xlsxtojson({
        input: "./client.xlsx",  // input xls
        output: "client.json", // output json
    }, function(err, result) {
        if(err) {
          res.json(err);
        } else {
          res.json(result);
        }
    });
});
const port = 3030;
app.listen(port, function () {
    console.log("SERVER I'M HERE IN " + port)
})