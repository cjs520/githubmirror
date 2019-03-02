const listenPort = 9083;

const request = require("request");
const concat = require('concat-stream');
const express = require('express');
const app = express();
const tgt = "https://github.com";
const zlib = require('zlib');

function replaceBody(response,buffer,callback){
    var encoding = response.headers['content-encoding'];
    var decoder,encoder;

    if (encoding == 'gzip') {
        decoder = zlib.gunzip;
        encoder = zlib.gzip;
    } else if (encoding == 'deflate') {
        decoder = zlib.inflate;
        encoder = zlib.deflate;
    } 

    console.log("Replace url in body.");
    if(decoder != undefined){
        decoder(buffer, function (err, decoded) {
            data = decoded.toString();
            data = data.replace(/github.com/g, "github.trs.ai");

            encoder(data,function(err,buffer){
                callback( err,  buffer); 
            });
        });
    }else{
        data = buffer.toString();
        data = data.replace(/github.com/g, "github.trs.ai");
        
        callback( null,   data);
    }
}

function pipReq(req, res) {
    var requrl = tgt + req.originalUrl;
    const r = request[req.method.toLowerCase()]({
       // proxy:"http://localhost:8888",
        "strictSSL":false,
        "followRedirect":false,
        "body":req.body,
        "url": requrl,
        encoding:null,
        "headers": {
            "host": "github.com",
            "Origin":"https://github.com",
            "Referer":requrl
        }
    },function (err, response, body){
        if(err){
            console.log(err);
           // res.err(err);
           res.status(500).send(err);
            return;
        }

        console.log(`statusCode: ${response.statusCode} Url: ${requrl} `);

        res.writeHead(response.statusCode, response.headers);

        let contentTypes = response.headers["content-type"];
        if(contentTypes.indexOf("text/html") > -1) {
            if (body != undefined) {
                replaceBody(response,body,function(err,data){
                    res.end(data);   
                })
    
                return;
              }
        }

        res.end(body);
    });

    req.pipe(r);
}
 
app.use(function (req, res) {
    pipReq(req, res);
});
 
app.listen(listenPort, function () {
    console.log(`Started, work on port ${listenPort}    ${new Date()}`);
});