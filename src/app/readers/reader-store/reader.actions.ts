import { Action } from '@ngrx/store';
import { Reader } from '../reader.model';

export const SET_READERS = '[Readers] Set Readers';
export const FETCH_READERS = '[Readers] Fetch Readers';
export const FETCH_READER_BY_ID = '[Readers] Fetch Reader By Id';
export const STORE_READERS = '[Readers] Store Readers';
export const ADD_READER = '[Readers] Add Reader';
export const UPDATE_READER = '[Readers] Update Reader';
export const DELETE_READER = '[Readers] Delete Reader';

export class SetReaders implements Action {
  readonly type = SET_READERS;

  constructor(public payload: Reader[]) {}
}

export class FetchReaders implements Action {
  readonly type = FETCH_READERS;
}

export class FetchReaderById implements Action {
  readonly type = FETCH_READER_BY_ID;

  constructor(public payload: number) {}
}

export class StoreReaders implements Action {
  readonly type = STORE_READERS;
}

export class AddReader implements Action {
  readonly type = ADD_READER;

  constructor(public payload: Reader) {}
}

export class UpdateReader implements Action {
  readonly type = UPDATE_READER;

  constructor(public payload: { index: number; newReader: Reader }) {}
}

export class DeleteReader implements Action {
  readonly type = DELETE_READER;

  constructor(public payload: number) {}
}

export type ReadersActions =
  | SetReaders
  | FetchReaders
  | StoreReaders
  | AddReader
  | UpdateReader
  | DeleteReader
  | FetchReaderById;
