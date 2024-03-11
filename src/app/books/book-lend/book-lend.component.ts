import { Component, OnInit } from '@angular/core';
import { Reader } from '../../readers/reader.model';
import { ActivatedRoute, Params } from '@angular/router';
import { Book } from '../book.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as BooksActions from '../book-store/book.actions';
import * as ReadersActions from '../../readers/reader-store/reader.actions';
import { map } from 'rxjs/operators';
import copy from 'fast-copy';

@Component({
  selector: 'app-book-lend',
  templateUrl: './book-lend.component.html',
  styleUrl: './book-lend.component.css',
})
export class BookLendComponent implements OnInit {
  cardNumber: number;
  books: Book[];
  selectedReader: Reader;
  id: number;
  selectedBook: Book;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.store
        .select('books')
        .pipe(map((booksState) => booksState.books))
        .subscribe((books: Book[]) => {
          this.books = books;
          this.selectedBook = books[this.id];
        });
    });
  }

  onSearch() {
    this.store.dispatch(new ReadersActions.FetchReaderById(this.cardNumber));
    this.store
      .select('readers')
      .pipe(map((readersState) => readersState.readers))
      .subscribe((readers: Reader[]) => {
        this.selectedReader = readers[0];
      });
  }
  onSubmit() {
    this.selectedBook = copy(this.selectedBook);
    if (this.selectedBook.reader == null) {
      this.selectedBook.reader = this.selectedReader;
      this.selectedBook.isLent = !this.selectedBook.isLent;
      this.store.dispatch(
        new BooksActions.UpdateBook({
          index: this.id,
          newBook: this.selectedBook,
        })
      );
    } else {
      this.selectedBook.reader = null;
      this.selectedBook.isLent = !this.selectedBook.isLent;
      this.store.dispatch(
        new BooksActions.UpdateBook({
          index: this.id,
          newBook: this.selectedBook,
        })
      );
    }
    this.store.dispatch(new BooksActions.StoreBooks());
  }
}
