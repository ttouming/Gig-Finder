const express = require('express');
const mashupRouter = require('./routes/mashup');
const locationRouter = require('./routes/location');
const fs = require('fs');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;
const cors = require('cors');
const path = require('path')
app.use(cors());

const filePath1 = path.resolve('.', 'public/javascript/fnapp.js')
const filePath2 = path.resolve('.', 'public/stylesheet.css')
const jsBuffer = fs.readFileSync(filePath1)
const cssBuffer = fs.readFileSync(filePath2)

app.get('/', (req, res) => {

    res.writeHead(200,{'content-type': 'text/html'});
    fs.readFile('index3.html', 'utf8', (err, data)=>{
        if(err){
            console.log("error")
            res.end('Could not find or open file\n');
        }
        else{
            res.end(data)
        }
    })
});

app.use(express.static(path.join(__dirname,'public')));

app.use('/search?',mashupRouter); 
app.use('/location?',locationRouter); 

app.listen(port, function () {
    console.log(`Express app listening at http://${hostname}:${port}/`);
});
