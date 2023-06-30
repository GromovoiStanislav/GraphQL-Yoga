import {authors} from "../data/authors.js";
import {books} from "../data/books.js";
import {reviews} from "../data/reviews.js";

export const resolvers = {
    Query: {
        authors(_, {query}) {
            if (!query) {
                return authors;
            }
            return authors.filter(author => {
                return author.name.toLowerCase().includes(query.toLowerCase());
            });
        },
        books() {
            return books;
        },
        reviews() {
            return reviews;
        }
    },
    Book: {
        author(parent) {
            return authors.find(author => {
                return author.id === parent.authorId;
            });
        },
        reviews(parent) {
            return reviews.filter(review => {
                return review.bookId === parent.id;
            });
        }
    },
    Author: {
        books(parent) {
            return books.filter(book => {
                return book.authorId === parent.id;
            });
        }
    },
    Review: {
        book(parent) {
            return books.find(book => {
                return book.id === parent.bookId;
            });
        }
    }
};
