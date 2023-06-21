## GraphQL-Yoga (ts) with Prisma, Authentication, Subscription, ErrorHandling, Validation

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
    votes {
      user {
        name
      }
    }
  } 
  
  link(id: 1){
    url
    description
    postedBy {
      id
      name
    }
    votes {
      user {
        name
      }
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

subscription {
  newLink {
    id
    url
    description
    postedBy {
      id
      name
      email
    }
  }
}

subscription {
  newVote {
    id
    link {
      url
      description
    }
    user {
      name
      email
    }
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

mutation {
  vote(linkId: 1) {
    id
    link {
      id
      description
    }
    user {
      id
      name
    }
  }
}
```