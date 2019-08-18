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
app.use(express.urlencoded({extended:true}));
//message

// app.post('/contact',(req, res)=>{
//   console.log(req.body);
//   res.sendFile('./thanks.html',{root:'./public'});
// });

// use res.render to load up an ejs view file

// index page
app.get('/',(req, res) => {
  res.render('index');
});

app.get('/index',(req, res) => {
  res.render('index');
});

app.get('/hello', (req, res) => {
  res.render('pages/hello')
})

// about page
app.get('/about', (req, res) => {
  res.render('pages/about');
});

app.get('*', (req, res) =>{
  res.render('searches/error');
});

//search function
app.post('/search', (req, res) =>{
  let url = `https://www.googleapis.com/books/v1/volumes?maxResults=10&orderBy=relevance&q=`;
  if(req.body.search[1]==='title')url+='intitle:';
  if(req.body.search[1]==='author')url+='inauthor:';
  url+=req.body.search[0];
  // console.log(url);
  url+=req.body[0];
  return superagent.get(url)
    .then(apiRes => apiRes.body.items.map(book => new Book(book.volumeInfo)))
    .then(results => res.render('pages/results', {searchResults: results}))
    .catch(err => errorHandler(err));
});

function Book(data){
  this.title = data.title?data.title:'Unknown';
  this.authors = data.authors?data.authors:['Unknown'];
  this.description = data.description?data.description:'No description.';
  this.image = data.imageLinks.thumbnail?data.imageLinks.thumbnail:'./img/book-icon-135.png';
}

function errorHandler(err){
  console.log(`${err.response} error: ${err.message}`);
}

// let list =[];
app.listen(PORT);
console.log(`${PORT} is the magic port`);

//add postman
