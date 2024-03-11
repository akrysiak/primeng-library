import { Component, OnInit } from '@angular/core';
import { Reader } from '../reader.model';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../books/book.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Subscription, map, switchMap } from 'rxjs';
import * as BooksActions from '../../books/book-store/book.actions';

@Component({
  selector: 'app-reader-detail',
  templateUrl: './reader-detail.component.html',
  styleUrl: './reader-detail.component.css',
})
export class ReaderDetailComponent implements OnInit {
  reader: Reader;
  id: number;
  selectedReader: Reader;
  books: Book[];
  subscription: Subscription;

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
          return this.store.select('readers');
        }),
        map((readersState) => {
          return readersState.readers.find((reader, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe((reader) => {
        this.selectedReader = reader;
        this.store.dispatch(new BooksActions.FetchBooks());
        this.subscription = this.store
          .select('books')
          .pipe(map((booksState) => booksState.books))
          .subscribe((books: Book[]) => {
            this.books = books;
            let selectedBooks = [];
            books.forEach((book) => {
              if (book.reader && book.reader.id == this.selectedReader.id) {
                selectedBooks.push(book);
              }
            });
            this.books = selectedBooks;
          });
      });
  }
}
