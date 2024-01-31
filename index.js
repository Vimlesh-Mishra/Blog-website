const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/test');


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');


const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  postDate: {
    type: Date,
    default: Date.now
  },
});

const Post = mongoose.model('Post', postSchema);


app.get('/', async (req, res) => {
  const posts = await Post.find();
  res.render('index', { posts });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    postDate: new Date(req.body.postDate),
  });

  await post.save();
  res.redirect('/');
});

app.get('/update/:postId', async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  res.render('update', { post });
});

app.post('/update/:postId', async (req, res) => {
  const postId = req.params.postId;
  await Post.findByIdAndUpdate(postId, {
    title: req.body.title,
    content: req.body.content,
    description: req.body.description,
  });

  res.redirect('/');
});

app.post('/delete/:postId', async (req, res) => {
  const postId = req.params.postId;
  await Post.findByIdAndDelete(postId);
  res.redirect('/');
});

app.get('/post/:postId', async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  res.render('post', { post });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
