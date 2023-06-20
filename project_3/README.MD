## GraphQL-Yoga (ts) with Prisma, Authentication, ErrorHandling, Validation


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
    description
    url
    postedBy {
      id
      name
    }
  } 
  
  link(id: 1){
    url
    description
    postedBy {
      id
      name
    }
  }  
}

mutation {
  signup(email: "test@mail.com", name: "Dotan Simha", password: "123456") {
    token
    user {
      id
      name
      email
    }
  }
}

mutation {
  login(email: "test@mail.com", password: "123456") {
    token
    user {
      id
      name
      email
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


in HEADERS section:
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}

me {
   id
   name
}

mutation {
  postLink(
    url: "www.graphqlconf.org"
    description: "An awesome GraphQL conference"
  ) {
    id
  }
}
```