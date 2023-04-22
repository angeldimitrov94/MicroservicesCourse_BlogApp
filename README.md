# MicroservicesWithNodeJSMongoReact

##Summary
A basic 'blog-style' application that allows a user to do the following tasks : 
- create a text post
- create a comment on an existing post
  - moderation of comments is possible based on an exclusion filter (list of strings)

##Tech stack 
- Front end : 
  - React
- Back end : 
  - Node.JS
    - NPM dependencies :
      - express
      - axios
      - cors
      - body-parser
- Infrastructure : 
  - Docker
  - Kubernetes

##Architecture
The application uses a simple microservice architecture, where each service performs a discrete function and allows for a certain degree of fault tolerance and resiliance. The services are as follows : 
- client
  - the React application itself
- posts
  - handles creation of new posts
    - POST HTTP requests at /posts/create
  - handles retrieval of existing posts
    - GET HTTP requests at /posts
- comments
  - handles creation of new comments associated with a post
    - POST HTTP requests at /posts/{id}/comments
  - handles retrieval of existing comments associated with a post
    - GET HTTP requests at /posts/{id}/comments
- event-bus
  - handles insertion of items into the event bus
    - POST HTTP requests at /events
    - distributes all requests that are sent to this endpoint to every other service (posts, comments, moderation, query), as in a publish-subscribe style model
  - handles retrieval of existing items in the event bus
    - GET HTTP requests at /events
- moderation 
  - intercept POST HTTP requests to /events and perform moderation on them by way of an exclusive filter list, if they are of a 'CommentCreated' type
- query
  - intercept POST HTTP requests to /events and perform moderation on them by way of an exclusive filter list, if they are of a 'CommentCreated' type
  - store and serve up in-memory post objects, for consumption by the React service
    - GET HTTP requests at /posts
