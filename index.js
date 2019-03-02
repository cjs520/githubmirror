const listenPort = 9083;

const request = require("request");
const express = require('express');
const app = express();
const tgt = "https://github.com";
const zlib = require('zlib');

function urlReplace(data){
    if(!data.replace){
        return data;
    }
    return data.replace(/(?<=[https\:\/\/|\s*|"|'])github\.com/g, "github.trs.ai");
}

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
            data = urlReplace(decoded.toString());

            encoder(data,function(err,buffer){
                callback( err,  buffer); 
            });
        });
    }else{
        data = urlReplace(buffer.toString());
        
        callback( null,   data);
    }
}

function replaceHeaders(response){
    for(var key in response.headers){
        response.headers[key]  = urlReplace(response.headers[key]);
    }
}

function pipReq(req, res) {
    var requrl = tgt + req.originalUrl;
    const r = request[req.method.toLowerCase()]({
      //  proxy:"http://localhost:8888",
        "strictSSL":false,
        "followRedirect":false,
        "body":req.body,
        "url": requrl,
        encoding:null,
        "headers": {
            "host": "github.com",
        }
    },function (err, response, body){
        if(err){
            console.log(err);
           // res.err(err);
           res.status(500).send(err);
            return;
        }

        console.log(`statusCode: ${response.statusCode} Url: ${requrl} `);

        // replaceHeaders(response);
        // delete response.headers["content-security-policy"];
        // delete response.headers["set-cookie"];
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