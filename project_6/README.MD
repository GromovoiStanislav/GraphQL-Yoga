## GraphQL Yoga (js) with Mongoose

```
query Ping {
  ping
}

mutation CreateMessage {
  createMessage(title: "Title", content: "content", author: "content") {
    ...AllMessageData
  }
}

query GetMessages {
  getMessages {
    ...AllMessageData
  }
}

query GetMessage {
  getMessage(id: "649d3efd75c6dbb95a42fa65") {
    ...AllMessageData
  }
}

mutation DeleteMessage {
  deleteMessage(id: "649d3efd75c6dbb95a42fa65") {
    ...AllMessageData
  }
}

fragment AllMessageData on Message {
  id
  title
  author
}
```
