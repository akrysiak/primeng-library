import { ActionReducerMap } from '@ngrx/store';
import * as fromBooks from '../books/book-store/book.reducer';
import * as fromAuth from '../auth/auth-store/auth.reducer';
import * as fromAuthors from '../authors/author-store/author.reducer';
import * as fromReaders from '../readers/reader-store/reader.reducer';
import * as fromShelves from '../shelves/shelf-store/shelf.reducer';

export interface AppState {
  books: fromBooks.State;
  authors: fromAuthors.State;
  readers: fromReaders.State;
  shelves: fromShelves.State;
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  books: fromBooks.bookReducer,
  authors: fromAuthors.authorReducer,
  readers: fromReaders.readerReducer,
  shelves: fromShelves.shelfReducer,
  auth: fromAuth.authReducer,
};
