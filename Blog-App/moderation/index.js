const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const exclusiveFilter = ["orange"]

app.post('/events', async (req, res) => {
    console.log(`Received event : ${req.body.type} - ${req.body.data.status}`);

    const { type, data } = req.body;

    if (type === 'CommentCreated'){
        const { id: thisCommentId, content, status: thisStatus, postId: thisPostId } = data;
        
        if(thisStatus == 'pending'){
            rejected = false;
            
            exclusiveFilter.forEach(filter => {
                if(content.includes(filter)){
                    rejected = true;
                    return;
                }
            });

            const newStatus = rejected ? "rejected" : "approved";

            await axios.post('http://event-bus-srv:4005/events', {
                type: "CommentModerated",
                data: {
                    id: thisCommentId,
                    content, 
                    status: newStatus, 
                    postId: thisPostId
                }
            });

            console.log(`${thisStatus} comment id ${thisCommentId}`);
        }
    }

    res.send({});
})

app.listen(4003, () => {
    console.log('Listening on 4003');
})