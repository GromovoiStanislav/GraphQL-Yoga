## GraphQL Yoga - subscription (TS/JS)

to run:

```bash
npm run build
npm start
#or
mpm run dev
```

```
subscription Messages {
  messages {
    id
    user
    content
  }
}

query Messages {
  messages {
    id
    content
    user
  }
}

mutation PostMessage {
  postMessage(content: "some text...", user: "Tom")
}
```
