'use strict';

// load the things we need
const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();
const cors = require('cors');
app.use(cors());


// set the view engine to ejs - Turn on server
app.set('view engine', 'ejs');
const PORT=process.env.PORT||8080;

//listen
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

// let list =[];
app.listen(PORT);
console.log(`${PORT} is the magic port`);

//error
client.on('err', err => console.error(err));

//file locations for ejs templates
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));

// Index
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
//helper constructor for info retrieved from api
function Book(data){
  this.title = data.title?data.title:'Unknown';
  this.authors = data.authors?data.authors:['Unknown'];
  this.description = data.description?data.description:'No description.';
  this.image = data.imageLinks.thumbnail?data.imageLinks.thumbnail:'./img/book-icon-135.png';
}

//display the search page
function newSearch(request, response) {
  response.render('pages/searches/new-search'); //location for ejs files
  app.use(express.static('./public'));//location for other files 
}
//save the selected book to db
//display all saved books
//return client query
//display details for selected books- a function
//handle errors
//create catch all
//delete current book in library
//client query
//search google api-function
//console logs
//superagent



function errorHandler(err){
  console.log(`${err.response} error: ${err.message}`);
}
