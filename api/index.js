const express = require('express');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const { render } = require('ejs');
const { v4 } = require('uuid');

// express app
const app = express();

// for vercel
app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

// connect to MongoDB
const dbURI = 'mongodb+srv://Sony:WTL6183@cluster0.9xi6mad.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((request) => {
        // listen to request
        app.listen(3000);
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log(err);
    });

app.get('/api', (req, res) => {
    const path = `/api/item/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
    });
    
    app.get('/api/item/:slug', (req, res) => {
    const { slug } = req.params;
    res.end(`Item: ${slug}`);
    });

// To create view engine:
app.set('view engine', 'ejs');

// static file of style.css with the foldername of public
app.use(express.static('public'));

// Creating an express server
app.get('/', (req, res) => {
    res.redirect('/blogs')
    
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'Rules'});
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'New Confession'});
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', {title: 'All Blogs', blogs: result}) 
        })
        .catch((err) => {
            console.log(err);
        })
});;

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
  
    blog.save()
      .then(result => {
        res.redirect('/blogs');
      })
      .catch(err => {
        console.log(err);
      });
  });

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch(err => {
            console.log(err);
        })
});

app.use((req, res) => {
    res.status(404).render('404', { title: 'Page not found'});
});

module.exports = app;
