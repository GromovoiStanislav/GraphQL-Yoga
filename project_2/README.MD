## GraphQL-Yoga (ts) with Prisma, ErrorHandling, Validation, Filtering and Pagination


Prisma:
```
npm i prisma -D
npm i @prisma/client
npx prisma init
npx prisma migrate dev --name init

npx prisma generate
npx prisma studio
```


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
  
  links(filterNeedle:"QL"){
    id
    url
    description
    comments {
      id
      body
    }
  }
  
    links(take: 1, skip: 1){
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