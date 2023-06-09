const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostID = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostID[req.params.id] || []);
})

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostID[req.params.id] || [];
    
    comments.push({ id: commentId, content, status: 'pending' })
    commentsByPostID[req.params.id] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: "CommentCreated",
        data: {
            id: commentId,
            content, 
            status: 'pending', 
            postId: req.params.id
        }
    });

    res.status(201).send(comments);
})

app.post('/events', (req, res) => {
    console.log(`Received event : ${req.body.type}`);
    res.send({});
})

app.listen(4001, () => {
    console.log('Listening on 4001');
})