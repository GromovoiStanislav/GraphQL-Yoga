## GraphQL Yoga - subscription (TS/JS)

to run:

```bash
npm run build
npm start
#or
mpm run dev
```

```
subscription messages {
  messages {
    from
    id
    text
  }
}

query MyQuery {
  messages {
    from
    id
    text
  }
}

mutation MyMutation {
  add(from: "Tom", text: "some text...") {
    from
    id
    text
  }
}
```
