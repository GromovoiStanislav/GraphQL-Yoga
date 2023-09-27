## GraphQL Yoga with axios (TS/JS)

to run:

```bash
npm run build
npm start
#or
mpm run dev
```

```
query Posts {
   posts {
    id
    userId
    title
    user {
      name
      id
    }
  }
}

query Post {
  post(id: 1) {
    id
    body
    title
    userId
    comments {
      postId
      id
      name
      email
      body
    }
  }
}

query Users {
  users {
    id
    name
    username
    email
    address {
      city
      street
      suite
      zipcode
      geo {
        lat
        lng
      }
    }
  }
}

query User {
  user(id: 1) {
    id
    name
    username
    posts {
      id
      title
      userId
      comments {
        id
        body
        postId
      }
    }
  }
}

query User {
  user(id: 1) {
    id
    name
    username
    todos {
      id
      title
      userId
      completed
    }
  }
}

query Todos {
  todos {
    completed
    id
    title
    userId
    user {
      id
      name
    }
  }
}

query Todo {
  todo(id: "1") {
    completed
    id
    title
    userId
    user {
      id
      name
    }
  }
}
```
