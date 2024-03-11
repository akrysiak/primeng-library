import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';

import * as ReadersActions from './reader.actions';
import * as fromApp from '../../store/app.reducer';
import { Reader } from '../reader.model';
import { Store } from '@ngrx/store';

@Injectable()
export class ReaderEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  fetchReaders = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadersActions.FETCH_READERS),
      switchMap(() => {
        return this.http.get<Reader[]>(
          'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/readers.json'
        );
      }),
      map((readers) => {
        if (!readers) {
          return new ReadersActions.SetReaders([]);
        }
        return new ReadersActions.SetReaders(readers);
      })
    )
  );

  fetchReaderById = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadersActions.FETCH_READER_BY_ID),
      switchMap((action: any) => {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('orderBy', '"id"');
        searchParams = searchParams.append('equalTo', `"${action.payload}"`);
        return this.http.get<Reader[]>(
          'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/readers.json',
          {
            params: searchParams,
          }
        );
      }),
      map((books) => {
        return new ReadersActions.SetReaders(Object.values(books));
      })
    )
  );

  storeAuthors = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReadersActions.STORE_READERS),
        withLatestFrom(this.store.select('readers')),
        switchMap(([actionData, readersState]) => {
          return this.http.put(
            'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/readers.json',
            readersState.readers
          );
        })
      ),
    { dispatch: false }
  );
}
