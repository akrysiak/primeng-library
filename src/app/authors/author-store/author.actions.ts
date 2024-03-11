import { Action, Store } from '@ngrx/store';
import { Author } from '../author.model';

export const SET_AUTHORS = '[Authors] Set Authors';
export const FETCH_AUTHORS = '[Authors] Fetch Authors';
export const STORE_AUTHORS = '[Authors] Store Authors';
export const ADD_AUTHOR = '[Authors] Add Author';
export const UPDATE_AUTHOR = '[Authors] Update Author';
export const DELETE_AUTHOR = '[Authors] Delete Author';

export class SetAuthors implements Action {
  readonly type = SET_AUTHORS;

  constructor(public payload: Author[]) {}
}

export class FetchAuthors implements Action {
  readonly type = FETCH_AUTHORS;
}

export class StoreAuthors implements Action {
  readonly type = STORE_AUTHORS;
}

export class AddAuthor implements Action {
  readonly type = ADD_AUTHOR;

  constructor(public payload: Author) {}
}

export class UpdateAuthor implements Action {
  readonly type = UPDATE_AUTHOR;

  constructor(public payload: { index: number; newAuthor: Author }) {}
}

export class DeleteAuthor implements Action {
  readonly type = DELETE_AUTHOR;

  constructor(public payload: number) {}
}

export type AuthorsActions =
  | SetAuthors
  | FetchAuthors
  | StoreAuthors
  | AddAuthor
  | UpdateAuthor
  | DeleteAuthor;
