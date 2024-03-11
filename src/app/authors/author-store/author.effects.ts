import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import * as AuthorsActions from './author.actions';
import * as fromApp from '../../store/app.reducer';
import { Author } from '../author.model';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthorEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  fetchAuthors = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthorsActions.FETCH_AUTHORS),
      switchMap(() => {
        return this.http.get<Author[]>(
          'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/authors.json'
        );
      }),
      map((authors) => {
        if (!authors) {
          return new AuthorsActions.SetAuthors([]);
        }
        return new AuthorsActions.SetAuthors(authors);
      })
    )
  );

  storeAuthors = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthorsActions.STORE_AUTHORS),
        withLatestFrom(this.store.select('authors')),
        switchMap(([actionData, authorsState]) => {
          return this.http.put(
            'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/authors.json',
            authorsState.authors
          );
        })
      ),
    { dispatch: false }
  );
}
