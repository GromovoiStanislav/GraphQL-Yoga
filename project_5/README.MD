## GraphQL Yoga (js) with Mongoose

```
mutation CreateUser {
  createUser(nickname: "tom", fullname: "Tom", phone: "455624564+6", city: "Omsk") {
    id
    nickname
    fullname
    phone
    city
  }
}

mutation DeleteUser {
  deleteUser(id: "649d34e74f450a47e67686af") {
    ...AllUserData
  }
}

query GetUsers {
  getUsers {
    ...AllUserData
  }
}

query GetUser {
  getUser(id: "649d349c4f450a47e67686ad") {
    ...AllUserData
  }
}

fragment AllUserData on User {
  id
  fullname
  phone
  city
}
```
