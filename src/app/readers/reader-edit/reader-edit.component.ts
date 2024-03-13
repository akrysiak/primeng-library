import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Reader } from '../reader.model';
import * as uuid from 'uuid';
import * as fromApp from '../../store/app.reducer';
import * as ReadersActions from '../../readers/reader-store/reader.actions';
import * as BooksActions from '../../books/book-store/book.actions';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Book } from '../../books/book.model';
import copy from 'fast-copy';

@Component({
  selector: 'app-reader-edit',
  templateUrl: './reader-edit.component.html',
  styleUrl: './reader-edit.component.css',
})
export class ReaderEditComponent implements OnInit {
  id: number;
  editMode = false;
  readerForm: FormGroup;
  selectedReader: Reader;

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
    let surname = '';

    if (this.editMode) {
      this.store
        .select('readers')
        .pipe(
          map((readerState) => {
            return readerState.readers.find((reader, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe((reader) => {
          name = reader.name;
          surname = reader.surname;
          this.selectedReader = reader;
        });
    }

    this.readerForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      surname: new FormControl(surname, Validators.required),
    });
  }

  onSubmit() {
    let booksToUpdate: Book[] = [];
    let id =
      this.selectedReader && this.selectedReader.id
        ? this.selectedReader.id
        : uuid.v4();
    const newReader = new Reader(
      id,
      this.readerForm.value['name'],
      this.readerForm.value['surname']
    );
    if (this.editMode) {
      this.store.dispatch(
        new ReadersActions.UpdateReader({
          index: this.id,
          newReader: this.readerForm.value,
        })
      );
      this.store.dispatch(new BooksActions.FetchBooks());
      this.store
        .select('books')
        .pipe(map((booksState) => booksState.books))
        .subscribe((books: Book[]) => {
          booksToUpdate = copy(books);
        });
      booksToUpdate.forEach((book, index) => {
        if (book.reader && book.reader.id === newReader.id) {
          book.reader = newReader;
          this.store.dispatch(
            new BooksActions.UpdateBook({
              index: index,
              newBook: book,
            })
          );
        }
      });

      this.store.dispatch(new BooksActions.StoreBooks());
      this.onCancel();
    } else {
      this.store.dispatch(new ReadersActions.AddReader(newReader));
      this.router.navigate(['readers']);
    }
    this.store.dispatch(new ReadersActions.StoreReaders());
  }

  onCancel() {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
