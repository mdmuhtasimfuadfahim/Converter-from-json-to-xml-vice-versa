const express = require('express')
const fs = require('fs')
const xml2js = require('xml2js')
const {exec} = require('child_process')
const util = require('util')
const app = express()
const path = require('path')
const isJson = require('is-json')
const isXml = require('is-xml')
// const json2xls = require('json2xls')
const json2xls = require('json2xml')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const json2xml = require('json2xml')

const PORT = process.env.PORT || 4080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get('/xmlJson', (req, res)=>{
    res.render('index',{title:'Convert XML to JSON - FreeMediaTools.com'})
})

app.get('/jsonXml', (req, res)=>{
    res.render('jsonXml',{title:'Convert JSON to XML - FreeMediaTools.com'})
})


// Set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//  const parser = new xml2js.Parser();
// fs.readD('example.xml', (err, data)=>{
//    parser.parseString(data, (err, result) =>{
//     console.log(util.inspect(result, false, null, true));
//    })
// })


// ---------------- XML to JSON
app.post('/xmltojson',(req,res) => {

    var xmldata = req.body.xml

    var jsonoutput = Date.now() + "output.json"

    if(isXml(xmldata)){

        xml2js.parseString(xmldata, (err, result) =>{
            if(err){
                throw err;
            }
            var json = JSON.stringify(result, null, 4);
            fs.writeFileSync(jsonoutput, json, 'binary');
        });

        // // const parser = new xml2js.Parser();
        // fs.writeFileSync(JSON.stringify(jsonoutput, json, 'binary'));

        res.download(jsonoutput,(err) => {
            if(err){
                fs.unlinkSync(jsonoutput)
                res.send("Unable to download the excel file")
            }
            fs.unlinkSync(jsonoutput)
        })
    }
    else{
        res.send("XML Data is not valid")
    }

})


// ---------------- JSON to XML
app.post('/jsontoxml',(req,res) => {

    var jsondata = req.body.json

    var xmloutput = Date.now() + "output.xml"

    if(isJson(jsondata)){
        var xml = json2xml(JSON.parse(jsondata));

        fs.writeFileSync(xmloutput, xml, 'binary');

        res.download(xmloutput,(err) => {
            if(err){
                fs.unlinkSync(xmloutput)
                res.send("Unable to download the excel file")
            }
            fs.unlinkSync(xmloutput)
        })
    }
    else{
        res.send("JSON Data is not valid")
    }

})

const server = app.listen(PORT, () =>{
    console.log(`Listening on Port ${PORT}`)
})

