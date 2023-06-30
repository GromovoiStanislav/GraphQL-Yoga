## GraphQL Yoga (js) relationships - example

```
query Books {
  books {
    id
    title
    author {
      id
      name
    }
    reviews {
      id
      text
    }
  }
}

query Authors {
  authors {
    id
    name
    books {
      id
      title
    }
  }
}

query Reviews {
  reviews {
    id
    text
    book {
      id
      title
      author {
        id
      }
    }
  }
}
```
