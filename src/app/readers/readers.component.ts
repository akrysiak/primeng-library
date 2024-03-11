import { Component, OnDestroy, OnInit } from '@angular/core';
import { Reader } from './reader.model';
import { Subscription, map } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Book } from '../books/book.model';
import * as fromApp from '../store/app.reducer';
import * as ReadersActions from '../readers/reader-store/reader.actions';
import { Store } from '@ngrx/store';
import * as BooksActions from '../books/book-store/book.actions';

@Component({
  selector: 'app-readers',
  templateUrl: './readers.component.html',
  styleUrl: './readers.component.css',
})
export class ReadersComponent implements OnInit, OnDestroy {
  readers: Reader[] = [];
  cols: any[] = [];
  id: number;
  selectedReader: Reader;
  subscription: Subscription;
  books: Book[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ReadersActions.FetchReaders());
    this.subscription = this.store
      .select('readers')
      .pipe(map((readersState) => readersState.readers))
      .subscribe((readers: Reader[]) => {
        this.readers = readers;
      });
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.selectedReader = this.getReader(this.id);
    });
  }

  getReader(index: number) {
    return this.readers[index];
  }

  onSelect(i, reader) {
    this.selectedReader = reader;
    this.id = i;
    this.store.dispatch(new BooksActions.FetchBooks());
    this.subscription = this.store
      .select('books')
      .pipe(map((booksState) => booksState.books))
      .subscribe((books: Book[]) => {
        this.books = books;
        let selectedBooks = [];
        books.forEach((book) => {
          if (book.reader && book.reader.id == reader.id) {
            selectedBooks.push(book);
          }
        });
        this.books = selectedBooks;
      });
  }

  onNewReader() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEditReader() {
    this.router.navigate(['./', this.id, 'edit'], { relativeTo: this.route });
  }

  onDelete() {
    this.store.dispatch(new ReadersActions.DeleteReader(this.id));
    this.store.dispatch(new ReadersActions.StoreReaders());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
