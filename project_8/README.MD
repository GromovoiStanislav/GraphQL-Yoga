## GraphQL Yoga - subscription (TS/JS)

to run:

```bash
npm run build
npm start
#or
mpm run dev
```

```bash
query GetTodos {
  getTodos {
    done
    id
    text
  }
}

subscription Todos {
  todos {
    done
    id
    text
  }
}

mutation AddTodo {
  addTodo(text: "gggg") {
    done
    id
    text
  }
}

mutation SetDone {
  setDone(done: true, id: "2") {
    done
    id
    text
  }
}
```
