// load the things we need
const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

const PORT=process.env.PORT||3000;
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
//message

app.post('/contact',(request, Response)=>{
	console.log(request.body);
	Response.sendFile('./thanks.html',{root:'./public'});
}

// use res.render to load up an ejs view file

// index page 
app.get('/',(Response, res) {
	res.render('pages/index');
});

// about page 
app.get('/about', function(req, res) {
	res.render('pages/about');
});
let list =[]
app.listen(8080);
console.log('8080 is the magic port');