require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const mongoose = require('mongoose');
const urlModel = require('./model');
const dns = require('dns');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://root:12345@nodefreecodecamp.izv3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Connected')). catch((err)=> console.log('Error'))

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res)=>{
  const url = req.body.url;
  
  if(validUrl.isUri(url)){
    const count = urlModel.count({"estado": true}).exec((err, short_url) => {
      const encontrado = urlModel.findOne({original_url: url});
      
      encontrado.then((uri)=>{
        res.json({
          original_url: uri.original_url,
          sohrt_url: uri.short_url
        })
      }).catch(e =>{
        const result = crearUrl(url, short_url);
        result.then(() => {
        res.json({
          original_url: url,
          short_url: short_url
        })
      }) 
      })
    })
  }else{
    res.json({
      error: 'invalid url'
    })
  }
  
});

app.get('/api/shorturl/:short_url', (req, res) => { 
  const url = req.params.short_url;
  const resultado = urlModel.findOne({short_url: url});

  resultado.then(u => {
    res.redirect(u.original_url);
  }).catch(e => {
    res.json({
      error: 'invalid url'
    })
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


const crearUrl = async (url, short) => {

  let new_url = new urlModel({
    original_url: url,
    short_url: short,
    estado: true
  });
  return await new_url.save();
}
