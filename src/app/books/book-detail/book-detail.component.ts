import { Component, Input, OnInit } from '@angular/core';
import { Book } from '../book.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css',
})
export class BookDetailComponent implements OnInit {
  id: number;
  selectedBook: Book;
  books: Book[];

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
          return this.store.select('books');
        }),
        map((booksState) => {
          return booksState.books.find((book, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe((book) => {
        this.selectedBook = book;
      });
  }
}
