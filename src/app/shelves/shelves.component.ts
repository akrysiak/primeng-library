import { Component, OnDestroy, OnInit } from '@angular/core';
import { Shelf } from './shelf.model';
import { Subscription, map } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Book } from '../books/book.model';
import * as fromApp from '../store/app.reducer';
import * as ShelvesActions from '../shelves/shelf-store/shelf.actions';
import * as BooksActions from '../books/book-store/book.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shelves',
  templateUrl: './shelves.component.html',
  styleUrl: './shelves.component.css',
})
export class ShelvesComponent implements OnInit, OnDestroy {
  shelves: Shelf[] = [];
  books: Book[] = [];
  cols: any[] = [];
  id: number;
  selectedShelf: Shelf;
  subscription: Subscription;
  bookSub: Subscription;
  canDeleteShelf: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new BooksActions.FetchBooks());
    this.bookSub = this.store
      .select('books')
      .pipe(map((booksState) => booksState.books))
      .subscribe((books: Book[]) => {
        this.books = books;
      });

    this.store.dispatch(new ShelvesActions.FetchShelves());
    this.subscription = this.store
      .select('shelves')
      .pipe(map((shelvesState) => shelvesState.shelves))
      .subscribe((shelves: Shelf[]) => {
        this.shelves = shelves;
      });
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.selectedShelf = this.getShelf(this.id);
    });
  }

  getShelf(index: number) {
    return this.shelves[index];
  }

  onNewShelf() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEditShelf() {
    this.router.navigate(['./', this.id, 'edit'], { relativeTo: this.route });
  }

  onSelect(index, shelf) {
    if (!shelf) {
      this.store.dispatch(new BooksActions.FetchBooks());
      this.bookSub = this.store
        .select('books')
        .pipe(map((booksState) => booksState.books))
        .subscribe((books: Book[]) => {
          this.books = books;
          let selectedBooks = [];
          books.forEach((book) => {
            selectedBooks.push(book);
          });
          this.books = selectedBooks;
        });
    } else {
      this.selectedShelf = shelf;

      this.id = this.shelves.findIndex(
        (shelf) => shelf.id === this.selectedShelf.id
      );
      this.store.dispatch(new BooksActions.FetchBooks());
      this.bookSub = this.store
        .select('books')
        .pipe(map((booksState) => booksState.books))
        .subscribe((books: Book[]) => {
          this.books = books;
          let selectedBooks = [];
          books.forEach((book) => {
            if (book.shelf.id == shelf.id) {
              selectedBooks.push(book);
            }
          });
          this.books = selectedBooks;
          this.canDeleteShelf = false;
          this.selectedShelf = shelf;
          if (books.some((book) => book.shelf.id == this.selectedShelf.id)) {
            this.canDeleteShelf = true;
          }
        });
    }
  }

  onDelete() {
    this.books.forEach((book) => {
      if (book.shelf === this.selectedShelf) {
        return;
      } else {
        this.store.dispatch(
          new ShelvesActions.DeleteShelf(this.selectedShelf.id)
        );
        this.store.dispatch(new ShelvesActions.StoreShelves());
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.bookSub.unsubscribe();
  }
}
