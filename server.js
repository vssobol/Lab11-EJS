'use strict';

// load the things we need
const express = require('express');
const app = express();


//add cors and superagent
const cors = require('cors');
app.use(cors());
const superagent = require('superagent');

// set the view engine to ejs
app.set('view engine', 'ejs');

const PORT=process.env.PORT||8080;
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
//message

app.post('/contact',(req, res)=>{
  console.log(req.body);
  res.sendFile('./thanks.html',{root:'./public'});
});

// use res.render to load up an ejs view file

// index page
app.get('/',(req, res) => {
  res.render('pages/index');
});

app.get('/hello', (req, res) => {
  res.render('pages/hello')
})

// about page
app.get('/about', (req, res) => {
  res.render('pages/about');
});

//search function
app.post('/searches', (req, res) =>{
  let url = '';
  return superagent.get(url)
    .then( res => res.body.map(book => new Book(book)))
});

function Book(data){
  this.title = data.volumeInfo.title;
  this.authors = data.volumeInfo.authors;
  this.description = data.description;
  this.image = data.imagelinks.medium;
}

let list =[];
app.listen(PORT);
console.log(`${PORT} is the magic port`);

//add postman
