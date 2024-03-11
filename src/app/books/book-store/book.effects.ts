import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import * as BooksActions from './book.actions';
import * as fromApp from '../../store/app.reducer';
import { Book } from '../book.model';
import { Store } from '@ngrx/store';

@Injectable()
export class BookEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  fetchBooks = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.FETCH_BOOKS),
      switchMap(() => {
        return this.http.get<Book[]>(
          'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/books.json'
        );
      }),
      map((books) => {
        if (!books) {
          return new BooksActions.SetBooks([]);
        }
        return new BooksActions.SetBooks(books);
      })
    )
  );

  storeBooks = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BooksActions.STORE_BOOKS),
        withLatestFrom(this.store.select('books')),
        switchMap(([actionData, booksState]) => {
          return this.http.put(
            'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/books.json',
            booksState.books
          );
        })
      ),
    { dispatch: false }
  );

  fetchBooksByAuthorId = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.FETCH_BY_AUTHOR_ID),
      switchMap((action: any) => {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('orderBy', '"id"');
        searchParams = searchParams.append('equalTo', `"${action.payload}"`);
        return this.http.get<Book[]>(
          'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/readers.json',
          {
            params: searchParams,
          }
        );
      }),
      map((books) => {
        return new BooksActions.SetBooks(Object.values(books));
      })
    )
  );
}
