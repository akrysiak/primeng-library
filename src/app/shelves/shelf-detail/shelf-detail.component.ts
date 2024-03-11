import { Component, OnInit } from '@angular/core';
import { Shelf } from '../shelf.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-shelf-detail',
  templateUrl: './shelf-detail.component.html',
  styleUrl: './shelf-detail.component.css',
})
export class ShelfDetailComponent implements OnInit {
  shelf: Shelf;
  id: number;
  selectedShelf: Shelf;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => {
          return +params['id'];
        }),
        switchMap((id) => {
          this.id = id;
          return this.store.select('shelves');
        }),
        map((shelvesState) => {
          return shelvesState.shelves.find((shelf, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe((shelf) => {
        this.selectedShelf = shelf;
      });
  }
}
