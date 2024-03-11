import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Shelf } from '../shelf.model';
import * as fromApp from '../../store/app.reducer';
import * as uuid from 'uuid';
import * as ShelvesActions from '../../shelves/shelf-store/shelf.actions';
import * as BooksActions from '../../books/book-store/book.actions';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Book } from '../../books/book.model';
import copy from 'fast-copy';

@Component({
  selector: 'app-shelf-edit',
  templateUrl: './shelf-edit.component.html',
  styleUrl: './shelf-edit.component.css',
})
export class ShelfEditComponent implements OnInit {
  id: number;
  editMode = false;
  shelfForm: FormGroup;
  selectedShelf: Shelf;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let name = '';

    if (this.editMode) {
      this.store
        .select('shelves')
        .pipe(
          map((shelfState) => {
            return shelfState.shelves.find((shelf, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe((shelf) => {
          this.selectedShelf = shelf;
          name = shelf.name;
        });
    }

    this.shelfForm = new FormGroup({
      name: new FormControl(name, Validators.required),
    });
  }

  onSubmit() {
    let id =
      this.selectedShelf && this.selectedShelf.id
        ? this.selectedShelf.id
        : uuid.v4();
    const newShelf = new Shelf(id, this.shelfForm.value['name']);
    if (this.editMode) {
      this.store.dispatch(
        new ShelvesActions.UpdateShelf({
          index: this.id,
          newShelf: this.shelfForm.value,
        })
      );
      let booksToUpdate = [];
      this.store.dispatch(new BooksActions.FetchBooks());
      this.store
        .select('books')
        .pipe(map((booksState) => booksState.books))
        .subscribe((books: Book[]) => {
          booksToUpdate = copy(books);
        });
      booksToUpdate.forEach((book, index) => {
        if (book.shelf.id === newShelf.id) {
          book.shelf = newShelf;
          this.store.dispatch(
            new BooksActions.UpdateBook({
              index: index,
              newBook: book,
            })
          );
        }
      });
      this.store.dispatch(new BooksActions.StoreBooks());
    } else {
      this.store.dispatch(new ShelvesActions.AddShelf(newShelf));
    }
    this.onCancel();
    this.store.dispatch(new ShelvesActions.StoreShelves());
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
