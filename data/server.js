'use strict';

// load the things we need
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

require('dotenv').config();

const cors = require('cors');

app.use(cors());

//set up
const app = express();

//database set up
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

//listen
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

//error
//const = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('err', err => console.error(err));

//file locations for ejs templates set up
app.set('view engine', 'ejs');

//turn on server -listen
const PORT=process.env.PORT||8080;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

//middleware handlers (not middlearth lol) - put and delete

//API Routes - show and saved library
app.get('/', showBooks);
app.get('/details/:book_id', showDetails);
// make sure to update in book folder

//edit details
app.put('/edit/:book_id', editDetails);

//delete book from library
app.delete('/delete/:book_id', deleteBook);

//search for books
app.get('/search', renderSearch);
app.post('/results', newSearch);
app.post('/add', addBook);

//catch all
app.get('*', (request, response) => response.status(404).send('This page does not exist'));




// Index
//app.get('/',(req, res) => {
//res.render('index');
//});
//app.get('/hello', (req, res) => {
//res.render('pages/hello')
//})
// about page
//app.get('/about', (req, res) => {
//res.render('pages/about');
//});
//app.get('*', (req, res) =>{
//res.render('searches/error');
//});

//search function
app.post('/search', (req, res) =>{
let url = `https://www.googleapis.com/books/v1/volumes?maxResults=10&orderBy=relevance&q=`;
if(req.body.search[1]==='title')url+='intitle:';
if(req.body.search[1]==='author')url+='inauthor:';
url+=req.body.search[0];
console.log(url);
url+=req.body[0];
//super agent return superagent.get(url)
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
function showBooks(request, response) {
  let SQL = 'SELECT * FROM books;';
//return client query
return client.query(SQL)
    .then(results => response.render('pages/index', {results: results.rows}))
    .catch(err => handleError(err, response));
}

//display details for selected books- a function
function showDetails(request, response) {
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [request.params.book_id];
  return client.query(SQL, values)
    .then((details) => {
      client.query('SELECT DISTINCT bookshelf FROM books;')
        .then((bookshelves) => {
          response.render('pages/books/details', {book: details.rows[0], bookshelves: bookshelves.rows})})
    })
    .catch(err => handleError(err, response));
}
//edit book details
function editDetails(request, response) {
  let {title, author, image_url, description, isbn, bookshelf} = request.body;
  let SQL = `UPDATE books SET title=$1, author=$2, image_url=$3, description=$4, isbn=$5, bookshelf=$6 WHERE id=$7;`;
  let values = [title, author, image_url, description, isbn, bookshelf, request.params.book_id];

  client.query(SQL, values)
    .then(response.redirect(`/details/${request.params.book_id}`))
    .catch(err => handleError(err, response));
}

//search google api-function no api key needed
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
//console logs

//delete book function
function deleteBook(request, response) {
  let SQL = `DELETE FROM books WHERE id=$1;`;
  let values = [request.params.book_id];

  client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}

function errorHandler(err){
  console.log(`${err.response} error: ${err.message}`);
}
