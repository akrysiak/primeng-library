import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from './book.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Reader } from '../readers/reader.model';
import * as fromApp from '../store/app.reducer';
import * as BooksActions from '../books/book-store/book.actions';
import * as ReadersActions from '../readers/reader-store/reader.actions';
import copy from 'fast-copy';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  readers: Reader[] = [];
  id: number;
  selectedBook: Book;
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new BooksActions.FetchBooks());
    this.store.dispatch(new ReadersActions.FetchReaders());
    this.store
      .select('readers')
      .pipe(map((readersState) => readersState.readers))
      .subscribe((readers: Reader[]) => {
        this.readers = readers;
      });
    this.subscription = this.store
      .select('books')
      .pipe(map((booksState) => booksState.books))
      .subscribe((books: Book[]) => {
        this.books = books;
      });
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.selectedBook = this.getBook(this.id);
    });
  }

  getBook(index: number) {
    return this.books[index];
  }

  onSelect(i, book) {
    if (this.selectedBook && !book) {
      this.selectedBook = null;
    } else {
      this.selectedBook = book;
      this.id = i;
    }
  }

  onNewBook() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEditBook() {
    this.router.navigate(['./', this.id, 'edit'], { relativeTo: this.route });
    this.selectedBook = null;
  }

  onLend() {
    this.selectedBook = copy(this.selectedBook);
    if (!this.selectedBook.isLent) {
      this.selectedBook.reader = null;
      this.selectedBook.isLent = !this.selectedBook.isLent;
      this.store.dispatch(
        new BooksActions.UpdateBook({
          index: this.id,
          newBook: this.selectedBook,
        })
      );
      this.store.dispatch(new BooksActions.StoreBooks());
    } else {
      this.router.navigate(['./', this.id, 'lend'], { relativeTo: this.route });
    }
  }

  onDelete() {
    this.store.dispatch(new BooksActions.DeleteBook(this.id));
    this.store.dispatch(new BooksActions.StoreBooks());
    this.selectedBook = null;
    this.router.navigate(['books']);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
