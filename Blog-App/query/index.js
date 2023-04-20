const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
})

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    console.log(posts);

    res.send();
})

const handleEvent = (type, data) => {
    if (type === 'PostCreated'){
        const { id, title } = data;
        posts[id] = { id, title, comments: [] }
    }

    if (type === 'CommentCreated'){
        const { id, content, status, postId } = data;
        const post = posts[postId];
        post.comments.push({id, content, status});
    }

    if (type === 'CommentModerated'){
        const { id: commentId, content, status: moderatedStatus, postId } = data;
        
        posts[postId].comments.forEach(comment => {
            if(comment.id == commentId){
                comment.status = moderatedStatus;
            }
        });
    }
}

app.listen(4002, async () => {
    console.log('Listening on 4002');

    const res = await axios.get('http://localhost:4005/events');

    console.log(res);

    for(let event of res.data){
        console.log(`Handling event : ${event.type}`);
        handleEvent(event.type, event.data)
    }
});