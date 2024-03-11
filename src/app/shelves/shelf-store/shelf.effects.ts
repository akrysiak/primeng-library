import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import * as ShelvesActions from './shelf.actions';
import * as fromApp from '../../store/app.reducer';
import { Shelf } from '../shelf.model';
import { Store } from '@ngrx/store';

@Injectable()
export class ShelfEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  fetchShelves = createEffect(() =>
    this.actions$.pipe(
      ofType(ShelvesActions.FETCH_SHELVES),
      switchMap(() => {
        return this.http.get<Shelf[]>(
          'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/shelves.json'
        );
      }),
      map((shelves) => {
        if (!shelves) {
          return new ShelvesActions.SetShelves([]);
        }
        return new ShelvesActions.SetShelves(shelves);
      })
    )
  );

  storeShelves = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShelvesActions.STORE_SHELVES),
        withLatestFrom(this.store.select('shelves')),
        switchMap(([actionData, shelvesState]) => {
          return this.http.put(
            'https://ng-library-da213-default-rtdb.europe-west1.firebasedatabase.app/shelves.json',
            shelvesState.shelves
          );
        })
      ),
    { dispatch: false }
  );
}
