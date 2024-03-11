import { Book } from '../book.model';
import * as BooksActions from './book.actions';

export interface State {
  books: Book[];
}

const initialState: State = {
  books: [],
};

export function bookReducer(
  state = initialState,
  action: BooksActions.BooksActions
) {
  switch (action.type) {
    case BooksActions.SET_BOOKS:
      return {
        ...state,
        books: [...action.payload],
      };
    case BooksActions.ADD_BOOK:
      return {
        ...state,
        books: [...state.books, action.payload],
      };
    case BooksActions.UPDATE_BOOK:
      const updatedBook = {
        ...state.books[action.payload.index],
        ...action.payload.newBook,
      };

      const updatedBooks = [...state.books];
      updatedBooks[action.payload.index] = updatedBook;

      return {
        ...state,
        books: updatedBooks,
      };
    case BooksActions.DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter((book, index) => {
          return index != action.payload;
        }),
      };
    default:
      return state;
  }
}
