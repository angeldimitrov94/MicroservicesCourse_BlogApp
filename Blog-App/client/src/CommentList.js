import React from 'react';

const CommentList = ({comments}) => {
    const renderedComments = comments.map(comment => {
        return <li key={comment.id}>
            {comment.status === 'pending' ? 'Comment pending approval' : comment.status === 'approved' ? comment.content : 'Comment rejected'}
            </li>;
    });

    return <ul>
        {renderedComments}
    </ul>;
}

export default CommentList;