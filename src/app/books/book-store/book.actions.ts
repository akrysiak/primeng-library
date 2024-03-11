import { Action, Store } from '@ngrx/store';
import { Book } from '../book.model';

export const SET_BOOKS = '[Books] Set Books';
export const FETCH_BOOKS = '[Books] Fetch Books';
export const STORE_BOOKS = '[Books] Store Books';
export const ADD_BOOK = '[Books] Add Book';
export const UPDATE_BOOK = '[Books] Update Book';
export const DELETE_BOOK = '[Books] Delete Book';
export const FETCH_BY_AUTHOR_ID = '[Books] Fetch Books by Author ID';

export class SetBooks implements Action {
  readonly type = SET_BOOKS;

  constructor(public payload: Book[]) {}
}

export class FetchBooks implements Action {
  readonly type = FETCH_BOOKS;
}

export class StoreBooks implements Action {
  readonly type = STORE_BOOKS;
}

export class AddBook implements Action {
  readonly type = ADD_BOOK;

  constructor(public payload: Book) {}
}

export class UpdateBook implements Action {
  readonly type = UPDATE_BOOK;

  constructor(public payload: { index: number; newBook: Book }) {}
}

export class DeleteBook implements Action {
  readonly type = DELETE_BOOK;

  constructor(public payload: number) {}
}

export class FetchBooksByAuthorId implements Action {
  readonly type = FETCH_BY_AUTHOR_ID;

  constructor(public payload: number) {}
}

export type BooksActions =
  | SetBooks
  | FetchBooks
  | StoreBooks
  | AddBook
  | UpdateBook
  | DeleteBook
  | FetchBooksByAuthorId;
