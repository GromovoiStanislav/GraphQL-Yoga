## GraphQL-Yoga with Prisma (ts)

```
query {
  hello
  
  links {
    id
    url
    description
    comments {
      id
      body
    }
  }
  
  link(id: 1){
    url
    description
    comments {
      id
      body
    }
  }
  
  comments{
    id
    body
    link {
      id
    }
  }
  
  comment(id: 1) {
    body
    link {
      id
    }
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

mutation postCommentOnLink {
  postCommentOnLink(linkId: "1", body: "This is my first comment!") {
    id
    body
  }
}
```