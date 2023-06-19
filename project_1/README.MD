## GraphQL-Yoga (ts)

```
query {
  hello
  feed {
    id
    url
    description
  }
}

mutation {
  postLink(
    url: "www.prisma.io"
    description: "Prisma replaces traditional ORMs"
  ) {
    id
  }
}

subscription{
  countdown(from:15)
}
```