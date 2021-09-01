const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://dad-jokes.p.rapidapi.com/random/joke/png',
  headers: {
    'x-rapidapi-host': 'dad-jokes.p.rapidapi.com',
    'x-rapidapi-key': '8ef833bacfmsh733efab50e8bf52p146dbajsn1808a4bbba7f'
  }
};

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://omda:omarhussein58@cluster0.i2y6m.mongodb.net/blogs?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');
app.get('/api',(req,res)=>{
  axios.request(options).then(function (response) {
    console.log(response.data);
    res.render('api',{title: 'api',joke: response.data})
  }).catch(function (error) {
    console.error(error);
  });
  
})
// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});