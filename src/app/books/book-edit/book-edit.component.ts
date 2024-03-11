import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Book } from '../book.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Author } from '../../authors/author.model';
import * as fromApp from '../../store/app.reducer';
import * as BooksActions from '../book-store/book.actions';
import * as AuthorsActions from '../../authors/author-store/author.actions';
import * as ShelvesActions from '../../shelves/shelf-store/shelf.actions';

import * as uuid from 'uuid';
import { map } from 'rxjs/operators';
import { Shelf } from '../../shelves/shelf.model';
import copy from 'fast-copy';

interface AuthorWithFullName extends Author {
  fullName: string;
}

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.css',
})
export class BookEditComponent implements OnInit {
  id: number;
  editMode = false;
  bookForm: FormGroup;
  selectedBook: Book;
  authors: Author[];
  authorsToShow: AuthorWithFullName[];
  testAuthors: Author[];
  filteredAuthors: Author[];
  filteredShelves: Shelf[];
  shelvesToShow: Shelf[];
  pickedAuthor: AuthorWithFullName;
  pickedShelf: Shelf;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new AuthorsActions.FetchAuthors());
    this.store
      .select('authors')
      .pipe(map((authorsState) => authorsState.authors))
      .subscribe((authors: Author[]) => {
        this.authors = authors;
        this.authorsToShow = [];
        this.authors.forEach((author) => {
          this.authorsToShow.push({
            ...author,
            fullName: author.name + ' ' + author.surname,
          });
        });
      });
    this.store.dispatch(new ShelvesActions.FetchShelves());
    this.store
      .select('shelves')
      .pipe(map((shelvesState) => shelvesState.shelves))
      .subscribe((shelves: Shelf[]) => {
        this.shelvesToShow = shelves;
      });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  validateAuthor(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.authorsToShow.includes(control.value) ||
      control.value == this.pickedAuthor
        ? null
        : { author: control.value };
  }

  validateShelf(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.shelvesToShow.includes(control.value) ||
      control.value == this.pickedShelf
        ? null
        : { shelf: control.value };
  }

  private initForm() {
    let title = '';
    let author: Author = null;
    let isbn = '';
    let shelf: Shelf = null;
    if (this.editMode) {
      this.store
        .select('books')
        .pipe(
          map((bookState) => {
            return bookState.books.find((book, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe((book) => {
          book = copy(book);
          title = book.title;
          author = book.author;
          shelf = book.shelf;
          isbn = book.isbn;
          this.pickedShelf = book.shelf;
          this.pickedAuthor = book.author;
          this.pickedAuthor.fullName =
            book.author.name + ' ' + book.author.surname;
          this.selectedBook = book;
        });
    }

    this.bookForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      author: new FormControl(author, [
        Validators.required,
        this.validateAuthor(),
      ]),
      shelf: new FormControl(shelf, [
        Validators.required,
        this.validateShelf(),
      ]),
      isbn: new FormControl(isbn, [
        Validators.required,
        Validators.pattern('^[0-9]{13}$'),
      ]),
    });
  }
  onSubmit() {
    let id =
      this.selectedBook && this.selectedBook.id
        ? this.selectedBook.id
        : uuid.v4();
    const newBook = new Book(
      id,
      this.bookForm.value['title'],
      this.bookForm.value['author'],
      this.bookForm.value['isbn'],
      this.bookForm.value['shelf'],
      true,
      null
    );
    let author = this.bookForm.value['author'];
    delete author.fullName;
    newBook.author = author;
    if (this.editMode) {
      this.store.dispatch(
        new BooksActions.UpdateBook({
          index: this.id,
          newBook: this.bookForm.value,
        })
      );
    } else {
      this.store.dispatch(new BooksActions.AddBook(newBook));
    }
    this.store.dispatch(new BooksActions.StoreBooks());
    this.onCancel();
  }

  filterAuthor(event) {
    // NAPRAWIONE - author.name zamiast author.fullName był <FACEPALM>
    if (event.query != undefined) {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.authorsToShow.length; i++) {
        let author = this.authorsToShow[i];
        if (author.fullName.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(author);
        }
      }

      this.filteredAuthors = filtered;
    }
    this.filteredAuthors = this.filteredAuthors;
  }

  filterShelf(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.shelvesToShow.length; i++) {
      let shelf = this.shelvesToShow[i];
      if (shelf.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(shelf);
      }
    }

    this.filteredShelves = filtered;
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
