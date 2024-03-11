import { Action } from '@ngrx/store';
import { Shelf } from '../shelf.model';

export const SET_SHELVES = '[Shelves] Set Shelves';
export const FETCH_SHELVES = '[Shelves] Fetch Shelves';
export const STORE_SHELVES = '[Shelves] Store Shelves';
export const ADD_SHELF = '[Shelves] Add Shelf';
export const UPDATE_SHELF = '[Shelves] Update Shelf';
export const DELETE_SHELF = '[Shelves] Delete Shelf';

export class SetShelves implements Action {
  readonly type = SET_SHELVES;

  constructor(public payload: Shelf[]) {}
}

export class FetchShelves implements Action {
  readonly type = FETCH_SHELVES;
}

export class StoreShelves implements Action {
  readonly type = STORE_SHELVES;
}

export class AddShelf implements Action {
  readonly type = ADD_SHELF;

  constructor(public payload: Shelf) {}
}

export class UpdateShelf implements Action {
  readonly type = UPDATE_SHELF;

  constructor(public payload: { index: number; newShelf: Shelf }) {}
}

export class DeleteShelf implements Action {
  readonly type = DELETE_SHELF;

  constructor(public payload: number) {}
}

export type ShelvesActions =
  | SetShelves
  | FetchShelves
  | StoreShelves
  | AddShelf
  | UpdateShelf
  | DeleteShelf;
