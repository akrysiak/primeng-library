import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Book } from './book.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as BooksActions from '../books/book-store/book.actions';
import { Actions, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BooksResolverService implements Resolve<Book[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('books').pipe(
      take(1),
      map((booksState) => {
        return booksState.books;
      }),
      switchMap((books) => {
        if (books.length === 0) {
          this.store.dispatch(new BooksActions.FetchBooks());
          return this.actions$.pipe(ofType(BooksActions.SET_BOOKS), take(1));
        } else {
          return of(books);
        }
      })
    );
  }
}
